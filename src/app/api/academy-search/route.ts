import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface Academy {
  n: string;  // 학원명
  r1: string; // 시도
  r2: string; // 구군
  f: string;  // 분야
  s: string;  // 교습계열
  c: string;  // 교습과정
  a: string;  // 주소
  p: string;  // 전화
  cap: number;   // 정원
  gisuk: boolean; // 기숙사
  est: string;   // 개설일자
}

let cachedData: Academy[] | null = null;

function loadData(): Academy[] {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), "data", "academies.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedData = JSON.parse(raw);
  return cachedData!;
}

// 시도 코드 → 짧은 이름
const REGION_SHORT: Record<string, string> = {
  "서울특별시교육청": "서울",
  "부산광역시교육청": "부산",
  "대구광역시교육청": "대구",
  "인천광역시교육청": "인천",
  "광주광역시교육청": "광주",
  "대전광역시교육청": "대전",
  "울산광역시교육청": "울산",
  "세종특별자치시교육청": "세종",
  "경기도교육청": "경기",
  "강원특별자치도교육청": "강원",
  "충청북도교육청": "충북",
  "충청남도교육청": "충남",
  "전라북도교육청": "전북",
  "전북특별자치도교육청": "전북",
  "전라남도교육청": "전남",
  "경상북도교육청": "경북",
  "경상남도교육청": "경남",
  "제주특별자치도교육청": "제주",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "";   // 시도 (짧은 이름: 서울, 경기 등)
  const district = searchParams.get("district") || ""; // 구군
  const search = searchParams.get("search") || "";   // 학원명 검색
  const field = searchParams.get("field") || "";     // 분야 (입시, 예능 등)
  const page = Number(searchParams.get("page")) || 1;
  const size = Math.min(Number(searchParams.get("size")) || 20, 50);

  try {
    const data = loadData();

    let filtered = data;

    if (region) {
      filtered = filtered.filter((a) => {
        const short = REGION_SHORT[a.r1] || a.r1;
        return short === region || a.r1.includes(region);
      });
    }

    if (district) {
      filtered = filtered.filter((a) => a.r2 === district || a.r2.includes(district));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((a) => a.n.toLowerCase().includes(q));
    }

    if (field) {
      filtered = filtered.filter((a) => a.f.includes(field));
    }

    const total = filtered.length;
    const offset = (page - 1) * size;
    const paged = filtered.slice(offset, offset + size);

    // 구군 목록 (현재 시도 기준)
    let districts: string[] = [];
    if (region) {
      const distSet = new Set<string>();
      data.forEach((a) => {
        const short = REGION_SHORT[a.r1] || a.r1;
        if (short === region || a.r1.includes(region)) distSet.add(a.r2);
      });
      districts = Array.from(distSet).sort();
    }

    return NextResponse.json({
      success: true,
      data: paged.map((a) => ({
        name: a.n,
        region: REGION_SHORT[a.r1] || a.r1,
        district: a.r2,
        field: a.f,
        subject: a.s,
        course: a.c,
        address: a.a,
        phone: a.p,
        capacity: a.cap || 0,
        dormitory: a.gisuk || false,
        established: a.est || "",
      })),
      total,
      page,
      size,
      districts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
