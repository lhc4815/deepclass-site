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

export async function GET(request: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({
      success: false,
      error: "YouTube API 키가 설정되지 않았습니다.",
    });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "전체";
  const limit = Math.min(Number(searchParams.get("limit")) || 12, 24);
  const query = searchParams.get("q") || SEARCH_QUERIES[category] || SEARCH_QUERIES["전체"];
  const pageToken = searchParams.get("pageToken") || "";

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
      throw new Error(errData?.error?.message || `YouTube API error: ${res.status}`);
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

    return NextResponse.json({
      success: true,
      count: videos.length,
      data: videos,
      nextPageToken: data.nextPageToken || null,
    }, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error: any) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "YouTube API 오류" },
      { status: 500 }
    );
  }
}
