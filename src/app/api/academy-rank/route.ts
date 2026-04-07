import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

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
  capacity: number;
  district: string;
  course: string;
  phone: string;
  established: string;
}

// 지역+구군별 랭킹 정의
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

// 캐시 (24시간)
let cache: { data: Record<string, RankItem[]>; timestamp: number } | null = null;
const CACHE_TTL = 86400000;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: cache.data, areas: RANK_AREAS.map((a) => a.area) });
  }

  const data = loadData();
  const result: Record<string, RankItem[]> = {};

  for (const area of RANK_AREAS) {
    const filtered = data.filter((a) => {
      const short = REGION_SHORT[a.r1] || a.r1;
      if (short !== area.region && !a.r1.includes(area.region)) return false;
      if (area.district) {
        const dists = area.district.split("|");
        if (!dists.some((d) => a.r2 === d || a.r2.includes(d))) return false;
      }
      // 입시/보습만
      return a.f?.includes("입시") || a.f?.includes("보습");
    });

    // 정원 순 정렬 (원격학원, 비정상 정원 제외)
    const ranked = filtered
      .filter((a) => a.cap > 0 && a.cap < 50000 && !a.n.includes("원격"))
      .sort((a, b) => b.cap - a.cap)
      .slice(0, 10)
      .map((a) => ({
        name: a.n,
        capacity: a.cap,
        district: a.r2,
        course: a.c || a.s || "",
        phone: a.p || "",
        established: a.est || "",
      }));

    result[area.area] = ranked;
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
