import { NextResponse } from "next/server";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

interface RankResult {
  name: string;
  searchVolume: number;
}

// 캐시 (1시간)
let cache: { data: RankResult[]; timestamp: number } | null = null;
const CACHE_TTL = 3600000;

const ACADEMY_NAMES = [
  "대성학원 입시", "종로학원 입시", "이투스247", "메가스터디학원",
  "시대인재 학원", "강남대성학원", "청솔학원 입시",
  "메가스터디 인강", "대성마이맥", "이투스 인강", "EBSi 수능", "스카이에듀",
  "진학사 입시", "유웨이 입시", "새이솔 입시", "하이스트 입시",
  "CMS에듀 수학",
];

async function fetchSearchVolume(query: string): Promise<number> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) return 0;

  try {
    const url = new URL("https://openapi.naver.com/v1/search/blog.json");
    url.searchParams.set("query", query);
    url.searchParams.set("display", "1");

    const res = await fetch(url.toString(), {
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    });

    if (!res.ok) return 0;
    const data = await res.json();
    return data.total || 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  // 캐시 확인
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: cache.data, cached: true });
  }

  // 병렬 검색 (5개씩 배치)
  const results: RankResult[] = [];

  for (let i = 0; i < ACADEMY_NAMES.length; i += 5) {
    const batch = ACADEMY_NAMES.slice(i, i + 5);
    const batchResults = await Promise.all(
      batch.map(async (name) => ({
        name: name.replace(/ (입시|인강|학원|수능|수학)$/, ""),
        searchVolume: await fetchSearchVolume(name),
      }))
    );
    results.push(...batchResults);
  }

  // 검색량 기준 정렬
  results.sort((a, b) => b.searchVolume - a.searchVolume);

  // 캐시 저장
  cache = { data: results, timestamp: Date.now() };

  return NextResponse.json({
    success: true,
    data: results,
    cached: false,
  }, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
