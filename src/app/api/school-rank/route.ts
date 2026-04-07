import { NextRequest, NextResponse } from "next/server";
import https from "https";

export const runtime = "nodejs";

const NEIS_API_KEY = process.env.NEIS_API_KEY?.trim();
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID?.trim();
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET?.trim();

const OFFICE_CODES: Record<string, string> = {
  "서울": "B10", "부산": "C10", "대구": "D10", "인천": "E10", "광주": "F10",
  "대전": "G10", "울산": "H10", "세종": "I10", "경기": "J10", "강원": "K10",
  "충북": "M10", "충남": "N10", "전북": "P10", "전남": "Q10", "경북": "R10",
  "경남": "S10", "제주": "T10",
};

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

/** 학교명 축약 */
function shortenSchool(name: string): string {
  return name.replace(/(고등학교|중학교)$/, "").replace(/(여자|남자)$/, "").trim();
}

/** 네이버 데이터랩 (5개씩) */
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

// 캐시 (7일)
const cache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 7 * 86400000;

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") || "서울";
  const kind = request.nextUrl.searchParams.get("kind") || "고등학교";
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 30, 50);

  const cacheKey = `${region}-${kind}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: cached.data.slice(0, limit) });
  }

  if (!NEIS_API_KEY) {
    return NextResponse.json({ success: false, error: "NEIS API 키 없음" });
  }

  const officeCode = OFFICE_CODES[region];
  if (!officeCode) {
    return NextResponse.json({ success: false, error: "잘못된 지역" });
  }

  try {
    // 1. NEIS에서 학교 목록 (최대 100개)
    const url = new URL("https://open.neis.go.kr/hub/schoolInfo");
    url.searchParams.set("KEY", NEIS_API_KEY);
    url.searchParams.set("Type", "json");
    url.searchParams.set("ATPT_OFCDC_SC_CODE", officeCode);
    url.searchParams.set("SCHUL_KND_SC_NM", kind);
    url.searchParams.set("pIndex", "1");
    url.searchParams.set("pSize", "100");

    const text = await httpsGet(url.toString());
    const data = JSON.parse(text);

    const info = data.schoolInfo;
    if (!info || !info[1]?.row) {
      return NextResponse.json({ success: true, data: [] });
    }

    const schools = info[1].row.map((r: any) => ({
      name: r.SCHUL_NM,
      shortName: shortenSchool(r.SCHUL_NM),
      type: r.HS_SC_NM || r.SCHUL_KND_SC_NM || "",
      address: r.ORG_RDNMA || "",
      phone: r.ORG_TELNO || "",
      coedu: r.COEDU_SC_NM || "",
      publicPrivate: r.FOND_SC_NM || "",
    }));

    // 2. 축약명으로 트렌드 조회 (상위 50개만)
    const shortNames = schools.slice(0, 50).map((s: any) => s.shortName);
    const trends = await getTrends(shortNames);

    // 3. 트렌드 점수 부여 + 정렬
    const ranked = schools.map((s: any) => ({
      ...s,
      trend: trends[s.shortName] || 0,
    }));

    ranked.sort((a: any, b: any) => {
      if (a.trend > 0 && b.trend > 0) return b.trend - a.trend;
      if (a.trend > 0) return -1;
      if (b.trend > 0) return 1;
      return a.name.localeCompare(b.name);
    });

    cache.set(cacheKey, { data: ranked, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      data: ranked.slice(0, limit),
    }, {
      headers: { "Cache-Control": "public, max-age=604800, s-maxage=604800" },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
