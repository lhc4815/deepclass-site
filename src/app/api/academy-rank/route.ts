import { NextRequest, NextResponse } from "next/server";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID?.trim();
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET?.trim();

interface RankResult {
  name: string;
  searchVolume: number;
}

// 캐시 (3시간)
const cache = new Map<string, { data: RankResult[]; timestamp: number }>();
const CACHE_TTL = 10800000;

// 지역별 인기 학원 검색 쿼리
const AREA_SUBJECTS: { area: string; queries: { name: string; query: string }[] }[] = [
  {
    area: "강남/대치 수학",
    queries: [
      { name: "시대인재 수학", query: "대치동 시대인재 수학" },
      { name: "현우진 수학", query: "강남 현우진 수학" },
      { name: "CMS에듀 강남", query: "CMS에듀 강남 수학" },
      { name: "정승제 수학", query: "정승제 수학 강의" },
      { name: "이하영 수학", query: "이하영 수학 강의" },
    ],
  },
  {
    area: "강남/대치 국어",
    queries: [
      { name: "박광일 국어", query: "박광일 국어 강의" },
      { name: "최서희 국어", query: "최서희 국어 강의" },
      { name: "이원준 국어", query: "이원준 국어 강의" },
      { name: "김동욱 국어", query: "김동욱 국어 수능" },
    ],
  },
  {
    area: "강남/대치 영어",
    queries: [
      { name: "조정식 영어", query: "조정식 영어 강의" },
      { name: "김기훈 영어", query: "김기훈 영어 강의" },
      { name: "이충권 영어", query: "이충권 영어 강의" },
    ],
  },
  {
    area: "강남/대치 종합",
    queries: [
      { name: "시대인재", query: "대치동 시대인재 학원" },
      { name: "강남대성", query: "강남대성학원 입시" },
      { name: "청솔학원", query: "청솔학원 강남" },
      { name: "메가스터디학원", query: "메가스터디 강남 학원" },
    ],
  },
  {
    area: "목동",
    queries: [
      { name: "목동 시대인재", query: "목동 시대인재 학원" },
      { name: "목동 메가스터디", query: "목동 메가스터디 학원" },
      { name: "목동 수학학원", query: "목동 수학 학원 추천" },
      { name: "목동 영어학원", query: "목동 영어 학원 추천" },
    ],
  },
  {
    area: "노원/중계",
    queries: [
      { name: "중계동 학원가", query: "중계동 학원 입시" },
      { name: "노원 수학학원", query: "노원 수학 학원 추천" },
      { name: "노원 영어학원", query: "노원 영어 학원 추천" },
      { name: "노원 종합학원", query: "노원 입시 학원" },
    ],
  },
  {
    area: "분당/판교",
    queries: [
      { name: "분당 시대인재", query: "분당 시대인재 학원" },
      { name: "분당 수학학원", query: "분당 수학 학원 추천" },
      { name: "분당 영어학원", query: "분당 영어 학원 추천" },
      { name: "판교 학원", query: "판교 입시 학원 추천" },
    ],
  },
  {
    area: "일산/파주",
    queries: [
      { name: "일산 수학학원", query: "일산 수학 학원 추천" },
      { name: "일산 영어학원", query: "일산 영어 학원 추천" },
      { name: "일산 종합학원", query: "일산 입시 학원" },
    ],
  },
  {
    area: "온라인 인강",
    queries: [
      { name: "메가스터디", query: "메가스터디 인강 수능" },
      { name: "대성마이맥", query: "대성마이맥 인강 수능" },
      { name: "이투스", query: "이투스 인강 수능" },
      { name: "EBSi", query: "EBSi 수능 강의" },
      { name: "스카이에듀", query: "스카이에듀 인강" },
    ],
  },
  {
    area: "재수종합반",
    queries: [
      { name: "대성학원", query: "대성학원 재수종합반" },
      { name: "종로학원", query: "종로학원 재수종합반" },
      { name: "이투스247", query: "이투스247 재수종합반" },
      { name: "메가스터디학원", query: "메가스터디 재수종합반" },
      { name: "청솔학원", query: "청솔학원 재수종합반" },
    ],
  },
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
  } catch { return 0; }
}

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area") || "";

  // 특정 지역 요청이면 해당만, 아니면 전체
  const targets = area
    ? AREA_SUBJECTS.filter((a) => a.area === area)
    : AREA_SUBJECTS;

  const result: Record<string, RankResult[]> = {};

  for (const cat of targets) {
    // 캐시 확인
    const cached = cache.get(cat.area);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      result[cat.area] = cached.data;
      continue;
    }

    const items: RankResult[] = [];
    for (let i = 0; i < cat.queries.length; i += 3) {
      const batch = cat.queries.slice(i, i + 3);
      const batchResults = await Promise.all(
        batch.map(async (item) => ({
          name: item.name,
          searchVolume: await fetchSearchVolume(item.query),
        }))
      );
      items.push(...batchResults);
    }
    items.sort((a, b) => b.searchVolume - a.searchVolume);
    cache.set(cat.area, { data: items, timestamp: Date.now() });
    result[cat.area] = items;
  }

  // 지역 목록도 반환
  const areas = AREA_SUBJECTS.map((a) => a.area);

  return NextResponse.json({ success: true, data: result, areas }, {
    headers: { "Cache-Control": "public, max-age=10800, s-maxage=10800" },
  });
}
