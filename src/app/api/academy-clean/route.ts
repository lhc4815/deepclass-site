import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY?.trim();

interface Academy {
  n: string; r1: string; r2: string; f: string; cap: number;
}

const REGION_SHORT: Record<string, string> = {
  "서울특별시교육청": "서울", "부산광역시교육청": "부산", "대구광역시교육청": "대구",
  "인천광역시교육청": "인천", "광주광역시교육청": "광주", "대전광역시교육청": "대전",
  "울산광역시교육청": "울산", "세종특별자치시교육청": "세종", "경기도교육청": "경기",
  "강원특별자치도교육청": "강원", "충청북도교육청": "충북", "충청남도교육청": "충남",
  "전라북도교육청": "전북", "전북특별자치도교육청": "전북", "전라남도교육청": "전남",
  "경상북도교육청": "경북", "경상남도교육청": "경남", "제주특별자치도교육청": "제주",
};

let cachedData: Academy[] | null = null;
function loadData(): Academy[] {
  if (cachedData) return cachedData;
  cachedData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "academies.json"), "utf-8"));
  return cachedData!;
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

// POST: 특정 지역의 학원명을 AI로 정리
export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ success: false, error: "Claude API 키 없음" });
  }

  const { area, region, district } = await request.json();
  if (!area || !region) {
    return NextResponse.json({ success: false, error: "area, region 필수" });
  }

  const supabase = await getSupabase();

  // 이미 처리된 지역인지 확인
  const { data: existing } = await supabase
    .from("academy_brands")
    .select("id")
    .eq("area", area)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ success: true, message: "이미 처리된 지역", skipped: true });
  }

  // 해당 지역 학원 후보 추출 (입시/보습, 상위 100개)
  const data = loadData();
  const candidates = data
    .filter((a) => {
      const short = REGION_SHORT[a.r1] || a.r1;
      if (short !== region) return false;
      if (district) {
        const dists = district.split("|");
        if (!dists.some((d: string) => a.r2 === d || a.r2.includes(d))) return false;
      }
      if (!(a.f?.includes("입시") || a.f?.includes("보습"))) return false;
      if (a.n.includes("원격") || a.n.includes("온라인") || a.n.includes("화상")) return false;
      if (a.cap > 50000 || a.cap <= 0) return false;
      return true;
    })
    .sort((a, b) => b.cap - a.cap)
    .slice(0, 100);

  if (candidates.length === 0) {
    return NextResponse.json({ success: true, message: "학원 없음", count: 0 });
  }

  // Claude API로 학원명 정리 (50개씩 배치)
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const allResults: any[] = [];

  for (let i = 0; i < candidates.length; i += 50) {
    const batch = candidates.slice(i, i + 50).map((c) => c.n);

    try {
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `다음 ${area} 지역 학원 이름을 정리해줘. JSON 배열로만 응답해 (마크다운 코드블록 없이 순수 JSON만).
각 항목: {"original":"원래이름","common":"통상 부르는 짧은 이름","brand":"브랜드그룹명"}
규칙:
- 같은 브랜드의 분원/별관/관은 같은 brand로 통합 (예: 대찬시대학원, 대찬W학원 → brand: "대찬")
- common은 사람들이 실제로 부르는 가장 짧고 자연스러운 이름
- 학원/교습소/전문/보습 등 접미사 제거
- (주) 등 법인 접두사 제거
- 원격/온라인 학원은 brand에 "제외"

학원 목록:
${batch.join("\n")}`,
        }],
      });

      const text = msg.content[0].type === "text" ? msg.content[0].text : "";
      // JSON 파싱 (코드블록 제거)
      const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      allResults.push(...parsed);
    } catch (err: any) {
      console.error("Claude API error:", err.message);
    }
  }

  // DB에 저장
  let saved = 0;
  for (const r of allResults) {
    if (r.brand === "제외") continue;
    const { error } = await supabase.from("academy_brands").upsert({
      area,
      original_name: r.original,
      common_name: r.common,
      brand: r.brand,
    }, { onConflict: "area,original_name" });
    if (!error) saved++;
  }

  return NextResponse.json({
    success: true,
    processed: allResults.length,
    saved,
    brands: [...new Set(allResults.filter((r) => r.brand !== "제외").map((r) => r.brand))].length,
    message: `${area}: ${allResults.length}개 처리, ${saved}개 저장`,
  });
}

// GET: 정리된 브랜드 목록 조회
export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area") || "";
  const supabase = await getSupabase();

  let query = supabase.from("academy_brands").select("*");
  if (area) query = query.eq("area", area);

  const { data } = await query.order("brand").limit(500);

  // 브랜드별 그룹
  const brands: Record<string, { common: string; count: number; names: string[] }> = {};
  for (const r of data || []) {
    if (!brands[r.brand]) brands[r.brand] = { common: r.common_name, count: 0, names: [] };
    brands[r.brand].count++;
    brands[r.brand].names.push(r.original_name);
  }

  return NextResponse.json({
    success: true,
    total: data?.length || 0,
    brands: Object.entries(brands)
      .map(([brand, info]) => ({ brand, common: info.common, count: info.count, names: info.names }))
      .sort((a, b) => b.count - a.count),
  });
}
