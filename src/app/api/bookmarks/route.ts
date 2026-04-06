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

// GET: 내 스크랩 목록
export async function GET(request: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // news, video, post 또는 null(전체)

  let query = supabase.from("bookmarks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (type) query = query.eq("item_type", type);

  const { data, error } = await query.limit(50);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data: data || [] });
}

// POST: 스크랩 추가
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

  const body = await request.json();
  const { item_type, item_id, title, url, thumbnail, summary, source } = body;

  if (!item_type || !item_id || !title) {
    return NextResponse.json({ success: false, error: "필수 항목 누락" }, { status: 400 });
  }

  const { data, error } = await supabase.from("bookmarks").upsert({
    user_id: user.id, item_type, item_id, title, url, thumbnail, summary, source,
  }, { onConflict: "user_id,item_type,item_id" }).select().single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

// DELETE: 스크랩 삭제
export async function DELETE(request: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

  const { id } = await request.json();
  const { error } = await supabase.from("bookmarks").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
