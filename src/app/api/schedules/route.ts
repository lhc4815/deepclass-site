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

// GET: 일정 목록
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const upcoming = searchParams.get("upcoming") === "true";
  const limit = Number(searchParams.get("limit")) || 50;

  const supabase = await getSupabase();

  let query = supabase.from("schedules").select("*").order("date", { ascending: true });

  if (upcoming) {
    query = query.gte("date", new Date().toISOString().split("T")[0]);
  }

  const { data, error } = await query.limit(limit);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data || [] });
}

// POST: 일정 추가 (관리자)
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 관리자 확인
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();
  if (profile?.user_type !== "관리자") {
    return NextResponse.json({ success: false, error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const body = await request.json();
  const { date, end_date, title, type, category, important, description } = body;

  if (!date || !title) {
    return NextResponse.json({ success: false, error: "날짜와 제목은 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("schedules")
    .insert({ date, end_date: end_date || null, title, type: type || "기타", category: category || "공통", important: important || false, description: description || null })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// DELETE: 일정 삭제 (관리자)
export async function DELETE(request: NextRequest) {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();
  if (profile?.user_type !== "관리자") {
    return NextResponse.json({ success: false, error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { id } = await request.json();
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
