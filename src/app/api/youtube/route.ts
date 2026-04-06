import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

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

// GET: DB에서 영상 조회 (API 호출 없음, 할당량 0)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "전체";
  const limit = Math.min(Number(searchParams.get("limit")) || 12, 50);
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("q") || "";
  const offset = (page - 1) * limit;

  const supabase = await getSupabase();

  let query = supabase.from("videos").select("*", { count: "exact" });

  if (category !== "전체") {
    query = query.eq("category", category);
  }
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, count, error } = await query
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    // DB 테이블이 없으면 빈 배열 반환
    return NextResponse.json({ success: true, data: [], total: 0 });
  }

  return NextResponse.json({
    success: true,
    data: (data || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      thumbnail: v.thumbnail,
      channelTitle: v.channel_title,
      publishedAt: v.published_at,
      videoUrl: v.video_url,
    })),
    total: count || 0,
    page,
  });
}
