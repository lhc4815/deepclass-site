import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/**
 * YouTube RSS 피드로 채널별 최신 영상 수집 (API 키 불필요, 할당량 무제한)
 * YouTube 채널 RSS: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 */

// 입시 관련 유명 유튜브 채널
const CHANNELS = [
  { id: "UCKJkNOMMfSJiCjiLmROJaNQ", name: "입시탐탐", category: "전체" },
  { id: "UCqr0MRLnbXMYJPNGSMCTxHQ", name: "이투스", category: "전체" },
  { id: "UC_3BM0-GS-JBMdYTFrliXhg", name: "메가스터디", category: "전체" },
  { id: "UCFt_1Gz_boEXQTIGGh3M-Vg", name: "대성마이맥", category: "전체" },
  { id: "UCeEcIlJOb_cBJjH6BPCHBiw", name: "EBS", category: "학습법" },
  { id: "UCwqm4oZH5h0_Xb3hCaqXMdQ", name: "스카이에듀", category: "전체" },
];

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : "";
}

function extractEntries(xml: string): any[] {
  const entries: any[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const videoId = extractTag(block, "yt:videoId");
    const title = extractTag(block, "title").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const published = extractTag(block, "published");
    const channelName = extractTag(block, "name");

    // 썸네일
    const thumbMatch = block.match(/<media:thumbnail[^>]*url="([^"]+)"/);
    const thumbnail = thumbMatch ? thumbMatch[1] : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    // 설명
    const descMatch = block.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const description = descMatch ? descMatch[1].slice(0, 300) : "";

    if (videoId && title) {
      entries.push({
        id: videoId,
        title,
        description,
        thumbnail,
        channel_title: channelName,
        published_at: published,
        video_url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  }
  return entries;
}

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

// POST: RSS로 채널별 최신 영상 수집 → DB 저장 (관리자)
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();
  if (profile?.user_type !== "관리자") {
    return NextResponse.json({ success: false, error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  let totalCollected = 0;
  const errors: string[] = [];

  for (const channel of CHANNELS) {
    try {
      const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;

      const xml = await res.text();
      const entries = extractEntries(xml);

      const videos = entries.map((e) => ({
        ...e,
        category: channel.category,
        search_query: `rss:${channel.name}`,
        channel_title: e.channel_title || channel.name,
      }));

      if (videos.length > 0) {
        const { error } = await supabase.from("videos").upsert(videos, { onConflict: "id" });
        if (error) errors.push(`${channel.name}: ${error.message}`);
        else totalCollected += videos.length;
      }
    } catch (err: any) {
      errors.push(`${channel.name}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    collected: totalCollected,
    channels: CHANNELS.length,
    errors: errors.length > 0 ? errors : undefined,
    message: `${totalCollected}개 영상 수집 완료 (RSS, 할당량 무제한)`,
  });
}
