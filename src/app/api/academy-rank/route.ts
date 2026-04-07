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

interface RankItem {
  name: string;
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
  { area: "성남시(분당)", region: "경기", district: "성남시" },
  { area: "수원시", region: "경기", district: "수원시" },
  { area: "고양시(일산)", region: "경기", district: "고양시" },
  { area: "용인시", region: "경기", district: "용인시" },
  { area: "부산", region: "부산", district: "" },
  { area: "대구", region: "대구", district: "" },
  { area: "인천", region: "인천", district: "" },
];

// 캐시 (24시간)
let cache: { data: Record<string, RankItem[]>; timestamp: number } | null = null;
const CACHE_TTL = 86400000;

/** 네이버 데이터랩 검색어 트렌드 (최대 5개씩) */
async function getTrends(keywords: string[]): Promise<Record<string, number>> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || keywords.length === 0) return {};

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0]; // 3개월

  const result: Record<string, number> = {};

  // 5개씩 배치 (API 제한)
  for (let i = 0; i < keywords.length; i += 5) {
    const batch = keywords.slice(i, i + 5);
    try {
      const res = await fetch("https://openapi.naver.com/v1/datalab/search", {
        method: "POST",
        headers: {
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          timeUnit: "month",
          keywordGroups: batch.map((kw) => ({
            groupName: kw,
            keywords: [kw],
          })),
        }),
      });

      if (!res.ok) continue;
      const data = await res.json();

      for (const r of data.results || []) {
        // 최근 월의 ratio 사용
        const latest = r.data?.[r.data.length - 1];
        result[r.title] = latest?.ratio || 0;
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
    // 1. DB에서 해당 지역 입시학원 후보 추출 (원격 제외, 정원 상위)
    const candidates = data
      .filter((a) => {
        const short = REGION_SHORT[a.r1] || a.r1;
        if (short !== area.region) return false;
        if (area.district && !a.r2.includes(area.district)) return false;
        if (!(a.f?.includes("입시") || a.f?.includes("보습"))) return false;
        if (a.n.includes("원격") || a.n.includes("온라인")) return false;
        if (a.cap > 50000) return false; // 비정상
        return true;
      })
      .sort((a, b) => b.cap - a.cap)
      .slice(0, 15); // 상위 15개 후보

    if (candidates.length === 0) continue;

    // 2. 네이버 데이터랩으로 검색 트렌드 조회
    const keywords = candidates.map((c) => c.n.replace(/\(.*\)/, "").trim());
    const trends = await getTrends(keywords);

    // 3. 트렌드 기준 정렬 (트렌드 0이면 정원순 폴백)
    const ranked = candidates.map((a) => {
      const cleanName = a.n.replace(/\(.*\)/, "").trim();
      return {
        name: a.n,
        trend: trends[cleanName] || 0,
        district: a.r2,
        phone: a.p || "",
        established: a.est || "",
      };
    });

    // 트렌드 있는 것 우선 → 트렌드 순 → 없으면 이름순
    ranked.sort((a, b) => {
      if (a.trend > 0 && b.trend > 0) return b.trend - a.trend;
      if (a.trend > 0) return -1;
      if (b.trend > 0) return 1;
      return 0;
    });

    result[area.area] = ranked.slice(0, 10);
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
