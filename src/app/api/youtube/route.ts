import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
}

const SEARCH_QUERIES: Record<string, string> = {
  "전체": "대학입시 2027",
  "수시전략": "수시 전략 2027",
  "정시전략": "정시 전략 수능",
  "면접준비": "대학 면접 준비",
  "논술": "논술 전형 대비",
  "학습법": "수능 공부법",
  "대학탐방": "대학교 캠퍼스 투어",
};

// 메모리 캐시 (6시간) — 할당량 절약
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 6 * 3600 * 1000; // 6시간

export async function GET(request: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ success: false, error: "YouTube API 키가 설정되지 않았습니다." });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "전체";
  const limit = Math.min(Number(searchParams.get("limit")) || 12, 24);
  const query = searchParams.get("q") || SEARCH_QUERIES[category] || SEARCH_QUERIES["전체"];
  const pageToken = searchParams.get("pageToken") || "";

  // 캐시 확인
  const cacheKey = `${query}:${limit}:${pageToken}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": "public, max-age=21600, s-maxage=21600" },
    });
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(limit));
    url.searchParams.set("order", "relevance");
    url.searchParams.set("regionCode", "KR");
    url.searchParams.set("relevanceLanguage", "ko");
    url.searchParams.set("key", YOUTUBE_API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `YouTube API error: ${res.status}`;

      // 할당량 초과 시 캐시된 데이터라도 반환
      if (errMsg.includes("quota")) {
        // 아무 캐시라도 있으면 반환
        for (const [key, val] of cache) {
          if (key.startsWith(query.slice(0, 5))) {
            return NextResponse.json({ ...val.data, quotaExceeded: true });
          }
        }
        return NextResponse.json({
          success: false,
          error: "YouTube API 일일 할당량이 초과되었습니다. 내일 자동으로 리셋됩니다.",
          quotaExceeded: true,
        });
      }
      throw new Error(errMsg);
    }

    const data = await res.json();

    const videos: YouTubeVideo[] = (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
      description: item.snippet.description.slice(0, 150),
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    const result = {
      success: true,
      count: videos.length,
      data: videos,
      nextPageToken: data.nextPageToken || null,
    };

    // 캐시 저장
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=21600, s-maxage=21600" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "YouTube API 오류" },
      { status: 500 }
    );
  }
}
