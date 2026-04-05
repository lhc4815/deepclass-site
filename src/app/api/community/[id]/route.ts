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

// GET: 게시글 상세
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  // 조회수 증가
  await supabase.rpc("increment_views", { p_id: Number(id) });

  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(name, avatar_url, user_type)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  // 현재 사용자의 좋아요 여부
  const { data: { user } } = await supabase.auth.getUser();
  let liked = false;
  if (user) {
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", id)
      .maybeSingle();
    liked = !!likeData;
  }

  return NextResponse.json({ success: true, data: { ...data, liked } });
}

// DELETE: 게시글 삭제
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { error } = await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
