import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID?.trim();
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET?.trim();

interface Academy {
  n: string; r1: string; r2: string; f: string; s: string; c: string;
  a: string; p: string; cap: number; gisuk: boolean; est: string;
}

let cachedData: Academy[] | null = null;
function loadData(): Academy[] {
  if (cachedData) return cachedData;
  cachedData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "academies.json"), "utf-8"));
  return cachedData!;
}

const REGION_SHORT: Record<string, string> = {
  "서울특별시교육청": "서울", "부산광역시교육청": "부산", "대구광역시교육청": "대구",
  "인천광역시교육청": "인천", "광주광역시교육청": "광주", "대전광역시교육청": "대전",
  "울산광역시교육청": "울산", "세종특별자치시교육청": "세종", "경기도교육청": "경기",
  "강원특별자치도교육청": "강원", "충청북도교육청": "충북", "충청남도교육청": "충남",
  "전라북도교육청": "전북", "전북특별자치도교육청": "전북", "전라남도교육청": "전남",
  "경상북도교육청": "경북", "경상남도교육청": "경남", "제주특별자치도교육청": "제주",
};

/** 학원명 축약 (트렌드 검색용) */
function shortenName(name: string): string {
  let s = name;
  s = s.replace(/^\(주\)|\(사\)|\(학\)|\(재\)/g, "");
  s = s.replace(/(보습|전문|종합|입시|진학지도|상담지도|원격)?(학원|교습소|아카데미)$/g, "");
  s = s.replace(/(본관|별관|분원|신관|\d관|[A-Z]관|하이페리온관|현대관\d?|프리미엄관)$/g, "");
  s = s.replace(/\d+$/, "");
  return s.trim() || name;
}

interface RankItem {
  name: string;
  shortName: string;
  trend: number;
  district: string;
  phone: string;
  established: string;
}

const RANK_AREAS = [
  { area: "강남구", region: "서울", district: "강남구" },
  { area: "서초구", region: "서울", district: "서초구" },
  { area: "송파구", region: "서울", district: "송파구" },
  { area: "양천구(목동)", region: "서울", district: "양천구" },
  { area: "노원구(중계)", region: "서울", district: "노원구" },
  { area: "마포/서대문", region: "서울", district: "마포구|서대문구" },
  { area: "성남시(분당)", region: "경기", district: "성남시" },
  { area: "수원시", region: "경기", district: "수원시" },
  { area: "고양시(일산)", region: "경기", district: "고양시" },
  { area: "용인시", region: "경기", district: "용인시" },
  { area: "부산", region: "부산", district: "" },
  { area: "대구", region: "대구", district: "" },
  { area: "인천", region: "인천", district: "" },
  { area: "대전", region: "대전", district: "" },
];

// 캐시 (7일 = 주간 갱신)
let cache: { data: Record<string, RankItem[]>; timestamp: number } | null = null;
const CACHE_TTL = 7 * 86400000;

/** 네이버 데이터랩 검색어 트렌드 (5개씩 배치) */
async function getTrends(keywords: { name: string; short: string }[]): Promise<Record<string, number>> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || keywords.length === 0) return {};

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];

  const result: Record<string, number> = {};

  // 중복 축약명 제거
  const seen = new Set<string>();
  const unique = keywords.filter((k) => {
    if (seen.has(k.short)) return false;
    seen.add(k.short);
    return true;
  });

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
          keywordGroups: batch.map((kw) => ({ groupName: kw.short, keywords: [kw.short] })),
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

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: cache.data, areas: RANK_AREAS.map((a) => a.area) });
  }

  const data = loadData();
  const result: Record<string, RankItem[]> = {};

  for (const area of RANK_AREAS) {
    // 1. DB에서 후보 40개 (원격/온라인 제외)
    const candidates = data
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
        return true;
      })
      .sort((a, b) => b.cap - a.cap)
      .slice(0, 100);

    if (candidates.length === 0) continue;

    // 2. 축약명으로 트렌드 조회 (중복 제거)
    const keywords = candidates.map((c) => ({ name: c.n, short: shortenName(c.n) }));
    const trends = await getTrends(keywords);

    // 3. 결과 구성
    const ranked: RankItem[] = candidates.map((a) => {
      const short = shortenName(a.n);
      return {
        name: a.n,
        shortName: short,
        trend: trends[short] || 0,
        district: a.r2,
        phone: a.p || "",
        established: a.est || "",
      };
    });

    // 트렌드 있는 것 먼저, 트렌드 순, 없으면 정원순 유지
    ranked.sort((a, b) => {
      if (a.trend > 0 && b.trend > 0) return b.trend - a.trend;
      if (a.trend > 0) return -1;
      if (b.trend > 0) return 1;
      return 0;
    });

    result[area.area] = ranked.slice(0, 30);
  }

  cache = { data: result, timestamp: Date.now() };

  return NextResponse.json({
    success: true,
    data: result,
    areas: RANK_AREAS.map((a) => a.area),
  }, {
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
  });
}
