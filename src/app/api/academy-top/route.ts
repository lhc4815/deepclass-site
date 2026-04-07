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
  const filePath = path.join(process.cwd(), "data", "academies.json");
  cachedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
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

// 지역별 입시 학원 TOP (정원 기준 상위)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "서울";
  const district = searchParams.get("district") || "";
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 200);

  const data = loadData();

  // 입시/보습 분야만 필터
  let filtered = data.filter((a) => {
    const short = REGION_SHORT[a.r1] || a.r1;
    if (short !== region && !a.r1.includes(region)) return false;
    if (district && a.r2 !== district) return false;
    return a.f?.includes("입시") || a.f?.includes("보습");
  });

  // 정원 기준 정렬 (큰 학원 = 유명)
  filtered.sort((a, b) => (b.cap || 0) - (a.cap || 0));

  // 구군 목록
  const distSet = new Set<string>();
  data.forEach((a) => {
    const short = REGION_SHORT[a.r1] || a.r1;
    if (short === region || a.r1.includes(region)) {
      if (a.f?.includes("입시") || a.f?.includes("보습")) distSet.add(a.r2);
    }
  });

  return NextResponse.json({
    success: true,
    data: filtered.slice(0, limit).map((a) => ({
      name: a.n,
      region: REGION_SHORT[a.r1] || a.r1,
      district: a.r2,
      subject: a.s,
      course: a.c,
      address: a.a,
      phone: a.p,
      capacity: a.cap || 0,
      dormitory: a.gisuk || false,
      established: a.est || "",
    })),
    total: filtered.length,
    districts: Array.from(distSet).sort(),
  });
}
