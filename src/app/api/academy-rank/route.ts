import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID?.trim();
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET?.trim();

// === 학원 JSON 데이터 ===
interface Academy {
  n: string; r1: string; r2: string; f: string; s: string; c: string;
  a: string; p: string; cap: number; gisuk: boolean; est: string;
}

let cachedFileData: Academy[] | null = null;
function loadFileData(): Academy[] {
  if (cachedFileData) return cachedFileData;
  cachedFileData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "academies.json"), "utf-8"));
  return cachedFileData!;
}

const REGION_SHORT: Record<string, string> = {
  "서울특별시교육청": "서울", "부산광역시교육청": "부산", "대구광역시교육청": "대구",
  "인천광역시교육청": "인천", "광주광역시교육청": "광주", "대전광역시교육청": "대전",
  "울산광역시교육청": "울산", "세종특별자치시교육청": "세종", "경기도교육청": "경기",
  "강원특별자치도교육청": "강원", "충청북도교육청": "충북", "충청남도교육청": "충남",
  "전라북도교육청": "전북", "전북특별자치도교육청": "전북", "전라남도교육청": "전남",
  "경상북도교육청": "경북", "경상남도교육청": "경남", "제주특별자치도교육청": "제주",
};

function shortenName(name: string): string {
  let s = name;
  s = s.replace(/^\(주\)|\(사\)|\(학\)|\(재\)/g, "");
  s = s.replace(/(보습|전문|종합|입시|진학지도|상담지도|원격)?(학원|교습소|아카데미)$/g, "");
  s = s.replace(/(본관|별관|분원|신관|\d관|[A-Z]관|하이페리온관|현대관\d?|프리미엄관)$/g, "");
  s = s.replace(/\d+$/, "");
  return s.trim() || name;
}

// 서울 25개 구 + 경기 주요 시 + 기타 시도
const RANK_AREAS = [
  // 서울 (25개 구)
  ...["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구",
    "동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구",
    "영등포구","용산구","은평구","종로구","중구","중랑구"
  ].map(d => ({ area: `서울 ${d}`, region: "서울", district: d })),
  // 경기 (주요 시)
  ...["고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","부천시",
    "성남시","수원시","시흥시","안산시","안양시","양주시","여주시","오산시","용인시",
    "의왕시","의정부시","이천시","파주시","평택시","하남시","화성시"
  ].map(d => ({ area: `경기 ${d}`, region: "경기", district: d })),
  // 기타 시도
  { area: "부산", region: "부산", district: "" },
  { area: "대구", region: "대구", district: "" },
  { area: "인천", region: "인천", district: "" },
  { area: "광주", region: "광주", district: "" },
  { area: "대전", region: "대전", district: "" },
  { area: "울산", region: "울산", district: "" },
  { area: "세종", region: "세종", district: "" },
  { area: "강원", region: "강원", district: "" },
  { area: "충북", region: "충북", district: "" },
  { area: "충남", region: "충남", district: "" },
  { area: "전북", region: "전북", district: "" },
  { area: "전남", region: "전남", district: "" },
  { area: "경북", region: "경북", district: "" },
  { area: "경남", region: "경남", district: "" },
  { area: "제주", region: "제주", district: "" },
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

/** 네이버 데이터랩 (5개씩 배치) */
async function getTrends(keywords: string[]): Promise<Record<string, number>> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || keywords.length === 0) return {};
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
  const result: Record<string, number> = {};
  const unique = [...new Set(keywords)];

  for (let i = 0; i < unique.length; i += 5) {
    const batch = unique.slice(i, i + 5);
    try {
      const res = await fetch("https://openapi.naver.com/v1/datalab/search", {
        method: "POST",
        headers: {
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate, endDate, timeUnit: "month",
          keywordGroups: batch.map((kw) => ({ groupName: kw, keywords: [kw] })),
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const r of data.results || []) {
        const latest = r.data?.[r.data.length - 1];
        if (latest?.ratio) result[r.title] = latest.ratio;
      }
    } catch {}
  }
  return result;
}

// GET: 랭킹 조회
// ?area=서울 강남구 → 특정 지역만 조회/갱신
// ?refresh=true → 강제 갱신
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedArea = searchParams.get("area") || "";
  const forceRefresh = searchParams.get("refresh") === "true";

  const supabase = await getSupabase();

  // DB에서 랭킹 읽기
  let query = supabase.from("academy_rankings").select("*").order("trend_score", { ascending: false });
  if (requestedArea) query = query.eq("area", requestedArea);
  const { data: dbRankings } = await query;

  // DB에 데이터가 있고, 최근 7일 이내 업데이트면 DB 결과 반환
  if (dbRankings && dbRankings.length > 0) {
    const lastUpdated = new Date(dbRankings[0].last_updated).getTime();
    const isRecent = Date.now() - lastUpdated < 7 * 86400000;

    if (isRecent && !forceRefresh) {
      const result: Record<string, any[]> = {};
      for (const r of dbRankings) {
        if (!result[r.area]) result[r.area] = [];
        result[r.area].push({
          name: r.name,
          shortName: r.short_name,
          trend: r.trend_score,
          district: r.district,
          phone: r.phone,
          established: r.established,
          weeksRanked: r.weeks_ranked,
        });
      }
      // 각 지역 TOP 30
      for (const area in result) {
        result[area] = result[area].sort((a: any, b: any) => b.trend - a.trend).slice(0, 30);
      }
      return NextResponse.json({ success: true, data: result, areas: RANK_AREAS.map((a) => a.area), fromDB: true });
    }
  }

  // === 갱신 필요: 트렌드 조회 + DB 업데이트 ===
  const fileData = loadFileData();
  const result: Record<string, any[]> = {};

  // 요청된 지역만 갱신 (없으면 전체, but 최대 5개씩)
  const targetAreas = requestedArea
    ? RANK_AREAS.filter((a) => a.area === requestedArea)
    : RANK_AREAS.slice(0, 5); // 전체 요청 시 5개씩만 (타임아웃 방지)

  for (const area of targetAreas) {
    // 1. 기존 DB 후보 가져오기
    const { data: existing } = await supabase
      .from("academy_rankings")
      .select("name, short_name, trend_score, weeks_in_pool, weeks_ranked")
      .eq("area", area.area);

    const existingNames = new Set((existing || []).map((e: any) => e.name));

    // 2. 파일에서 새 후보 추가 (기존 풀에 없는 학원)
    const newCandidates = fileData
      .filter((a) => {
        const short = REGION_SHORT[a.r1] || a.r1;
        if (short !== area.region) return false;
        if (area.district) {
          const dists = area.district.split("|");
          if (!dists.some((d) => a.r2 === d || a.r2.includes(d))) return false;
        }
        if (!(a.f?.includes("입시") || a.f?.includes("보습"))) return false;
        if (a.n.includes("원격") || a.n.includes("온라인") || a.n.includes("화상")) return false;
        if (a.cap > 50000 || a.cap <= 0) return false;
        return !existingNames.has(a.n);
      })
      .sort((a, b) => b.cap - a.cap)
      .slice(0, 30); // 새 후보 30개 추가

    // 3. 전체 후보 = 기존 + 신규
    const allCandidates = [
      ...(existing || []).map((e: any) => ({ name: e.name, shortName: e.short_name })),
      ...newCandidates.map((c) => ({ name: c.n, shortName: shortenName(c.n) })),
    ];

    // 4. 트렌드 조회
    const trends = await getTrends(allCandidates.map((c) => c.shortName));

    // 5. DB에 upsert (점수 업데이트 + 새 후보 추가)
    const now = new Date().toISOString();
    for (const cand of allCandidates) {
      const score = trends[cand.shortName] || 0;
      const existingItem = (existing || []).find((e: any) => e.name === cand.name);
      const fileItem = fileData.find((f) => f.n === cand.name);

      await supabase.from("academy_rankings").upsert({
        area: area.area,
        name: cand.name,
        short_name: cand.shortName,
        district: fileItem?.r2 || "",
        phone: fileItem?.p || "",
        established: fileItem?.est || "",
        prev_score: existingItem?.trend_score || 0,
        trend_score: score,
        weeks_in_pool: (existingItem?.weeks_in_pool || 0) + 1,
        weeks_ranked: (existingItem?.weeks_ranked || 0) + (score > 0 ? 1 : 0),
        last_updated: now,
      }, { onConflict: "area,name" });
    }

    // 6. 풀 정리: 4주 이상 트렌드 0인 학원 제거 (풀 관리)
    await supabase.from("academy_rankings")
      .delete()
      .eq("area", area.area)
      .eq("trend_score", 0)
      .lt("prev_score", 0.01)
      .gte("weeks_in_pool", 4);

    // 7. 결과 구성 (TOP 30)
    const { data: updated } = await supabase
      .from("academy_rankings")
      .select("*")
      .eq("area", area.area)
      .order("trend_score", { ascending: false })
      .limit(30);

    result[area.area] = (updated || []).map((r: any) => ({
      name: r.name,
      shortName: r.short_name,
      trend: r.trend_score,
      district: r.district,
      phone: r.phone,
      established: r.established,
      weeksRanked: r.weeks_ranked,
    }));
  }

  return NextResponse.json({
    success: true,
    data: result,
    areas: RANK_AREAS.map((a) => a.area),
    fromDB: false,
    message: "랭킹 갱신 완료",
  });
}
