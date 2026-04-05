import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

// GET: 게시글 목록
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const board = searchParams.get("board") || "all";
  const sort = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
  const offset = (page - 1) * limit;

  const supabase = await getSupabase();

  let query = supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(name, avatar_url, user_type)", { count: "exact" });

  if (board !== "all") {
    query = query.eq("board", board);
  }

  if (sort === "popular") {
    query = query.order("likes_count", { ascending: false }).order("created_at", { ascending: false });
  } else if (sort === "comments") {
    query = query.order("comments_count", { ascending: false }).order("created_at", { ascending: false });
  } else {
    query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: data || [],
    total: count || 0,
    page,
    limit,
  });
}

// POST: 게시글 작성
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, board } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ success: false, error: "제목과 내용을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: title.trim(),
      content: content.trim(),
      board: board || "free",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
