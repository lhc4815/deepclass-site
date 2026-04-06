import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY?.trim();

const DEFAULT_QUERIES = [
  { query: "대학입시 2027", category: "전체" },
  { query: "수시 전략 2027", category: "수시전략" },
  { query: "정시 전략 수능 2027", category: "정시전략" },
  { query: "대학 면접 준비 입시", category: "면접준비" },
  { query: "논술 전형 대비", category: "논술" },
  { query: "수능 공부법 2027", category: "학습법" },
  { query: "대학교 캠퍼스 투어", category: "대학탐방" },
];

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

async function searchYouTube(query: string, maxResults = 10): Promise<any[]> {
  if (!YOUTUBE_API_KEY) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("order", "relevance");
  url.searchParams.set("regionCode", "KR");
  url.searchParams.set("relevanceLanguage", "ko");
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `YouTube API ${res.status}`);
  }

  const data = await res.json();
  return data.items || [];
}

// POST: YouTube API로 검색 → DB에 저장 (관리자 전용)
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const customQuery = body.query;
  const customCategory = body.category || "전체";

  // 커스텀 검색어가 있으면 해당만, 없으면 기본 7개 카테고리 전체 수집
  const queries = customQuery
    ? [{ query: customQuery, category: customCategory }]
    : DEFAULT_QUERIES;

  let totalCollected = 0;
  let errors: string[] = [];

  for (const q of queries) {
    try {
      const items = await searchYouTube(q.query, 10);

      const videos = items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        description: (item.snippet.description || "").slice(0, 300),
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        channel_title: item.snippet.channelTitle,
        published_at: item.snippet.publishedAt,
        video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        category: q.category,
        search_query: q.query,
      }));

      // upsert (중복 시 업데이트)
      const { error } = await supabase
        .from("videos")
        .upsert(videos, { onConflict: "id" });

      if (error) {
        errors.push(`${q.category}: ${error.message}`);
      } else {
        totalCollected += videos.length;
      }
    } catch (err: any) {
      errors.push(`${q.category}: ${err.message}`);
      // 할당량 초과 시 중단
      if (err.message?.includes("quota")) break;
    }
  }

  return NextResponse.json({
    success: true,
    collected: totalCollected,
    errors: errors.length > 0 ? errors : undefined,
    message: `${totalCollected}개 영상 수집 완료`,
  });
}
