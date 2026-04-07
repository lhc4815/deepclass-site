import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/**
 * 검색어 기반 대량 수집 (7개 카테고리 x 10개 = 70개 영상)
 * YouTube API 할당량: 7회 검색 = 700 유닛 (하루 한번이면 충분)
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY?.trim();

const COLLECT_QUERIES = [
  { query: "대학입시 전략 2027", category: "전체" },
  { query: "수시 전형 전략 합격", category: "수시전략" },
  { query: "정시 수능 전략 배치", category: "정시전략" },
  { query: "대학 면접 준비 팁", category: "면접준비" },
  { query: "대학 논술 전형 준비", category: "논술" },
  { query: "수능 공부법 성적향상", category: "학습법" },
  { query: "대학교 캠퍼스 투어 학과", category: "대학탐방" },
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

// POST: 전체 카테고리 대량 수집 (하루 1회 권장, 700 유닛 사용)
export async function POST() {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ success: false, error: "YouTube API 키가 없습니다." });
  }

  let totalCollected = 0;
  const errors: string[] = [];

  for (const q of COLLECT_QUERIES) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("q", q.query);
      url.searchParams.set("type", "video");
      url.searchParams.set("maxResults", "10");
      url.searchParams.set("order", "date");
      url.searchParams.set("publishedAfter", thirtyDaysAgo);
      url.searchParams.set("regionCode", "KR");
      url.searchParams.set("relevanceLanguage", "ko");
      url.searchParams.set("key", YOUTUBE_API_KEY);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        errors.push(`${q.category}: ${err?.error?.message || res.status}`);
        if (err?.error?.message?.includes("quota")) break;
        continue;
      }

      const data = await res.json();
      const videos = (data.items || []).map((item: any) => ({
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

      if (videos.length > 0) {
        const { error } = await supabase.from("videos").upsert(videos, { onConflict: "id" });
        if (error) errors.push(`${q.category}: ${error.message}`);
        else totalCollected += videos.length;
      }
    } catch (err: any) {
      errors.push(`${q.category}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    collected: totalCollected,
    queries: COLLECT_QUERIES.length,
    errors: errors.length > 0 ? errors : undefined,
    message: `${totalCollected}개 영상 수집 완료 (${COLLECT_QUERIES.length}개 카테고리, API 사용)`,
  });
}
