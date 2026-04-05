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

// GET: 댓글 목록
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles!comments_author_id_fkey(name, avatar_url, user_type)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data || [] });
}

// POST: 댓글 작성
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { content } = await request.json();
  if (!content?.trim()) {
    return NextResponse.json({ success: false, error: "댓글 내용을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: Number(id), author_id: user.id, content: content.trim() })
    .select("*, profiles!comments_author_id_fkey(name, avatar_url, user_type)")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
