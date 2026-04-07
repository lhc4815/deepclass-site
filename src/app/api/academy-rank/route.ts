import { NextRequest, NextResponse } from "next/server";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID?.trim();
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET?.trim();

interface RankResult { name: string; searchVolume: number; }

// 캐시 (24시간)
const cache = new Map<string, { data: RankResult[]; timestamp: number }>();
const CACHE_TTL = 86400000;

const RANK_CATEGORIES: { area: string; items: { name: string; query: string }[] }[] = [
  // === 지역별 종합 ===
  { area: "대치동", items: [
    { name: "시대인재", query: "시대인재 대치동" },
    { name: "강남대성", query: "강남대성학원" },
    { name: "청솔학원", query: "청솔학원 강남" },
    { name: "메가스터디 강남", query: "메가스터디 강남학원" },
    { name: "유웨이 대치", query: "유웨이 대치동" },
  ]},
  { area: "목동", items: [
    { name: "시대인재 목동", query: "시대인재 목동" },
    { name: "메가스터디 목동", query: "메가스터디 목동" },
    { name: "목동 종합학원", query: "목동 입시학원" },
  ]},
  { area: "노원/중계", items: [
    { name: "중계동 학원가", query: "중계동 학원" },
    { name: "노원 입시", query: "노원 입시학원" },
    { name: "노원 종합", query: "노원 학원 추천" },
  ]},
  { area: "분당/판교", items: [
    { name: "분당 학원가", query: "분당 학원" },
    { name: "시대인재 분당", query: "시대인재 분당" },
    { name: "판교 학원", query: "판교 학원" },
  ]},
  { area: "일산", items: [
    { name: "일산 학원가", query: "일산 학원" },
    { name: "일산 입시", query: "일산 입시학원" },
  ]},
  { area: "부산", items: [
    { name: "부산 해운대학원가", query: "해운대 학원" },
    { name: "부산 서면학원가", query: "서면 학원" },
    { name: "부산 입시학원", query: "부산 입시학원" },
  ]},
  { area: "대구", items: [
    { name: "대구 수성구학원가", query: "수성구 학원" },
    { name: "대구 입시학원", query: "대구 입시학원" },
  ]},
  // === 과목별 (전국) ===
  { area: "수학 강사", items: [
    { name: "현우진", query: "현우진 수학" },
    { name: "정승제", query: "정승제 수학" },
    { name: "이하영", query: "이하영 수학" },
    { name: "김기현", query: "김기현 수학 강의" },
    { name: "양승진", query: "양승진 수학" },
  ]},
  { area: "국어 강사", items: [
    { name: "박광일", query: "박광일 국어" },
    { name: "최서희", query: "최서희 국어" },
    { name: "이원준", query: "이원준 국어" },
    { name: "김동욱", query: "김동욱 국어" },
    { name: "신영균", query: "신영균 국어" },
  ]},
  { area: "영어 강사", items: [
    { name: "조정식", query: "조정식 영어" },
    { name: "김기훈", query: "김기훈 영어" },
    { name: "이충권", query: "이충권 영어" },
    { name: "곽지영", query: "곽지영 영어" },
  ]},
  { area: "탐구 강사", items: [
    { name: "정종영 생명과학", query: "정종영 생명과학" },
    { name: "박지향 사회문화", query: "박지향 사회문화" },
    { name: "고석용 지구과학", query: "고석용 지구과학" },
    { name: "배기범 물리학", query: "배기범 물리학" },
  ]},
  // === 인강/재수 ===
  { area: "온라인 인강", items: [
    { name: "메가스터디", query: "메가스터디 인강" },
    { name: "대성마이맥", query: "대성마이맥" },
    { name: "이투스", query: "이투스 인강" },
    { name: "EBSi", query: "EBS 수능" },
    { name: "스카이에듀", query: "스카이에듀" },
  ]},
  { area: "재수종합반", items: [
    { name: "대성학원", query: "대성학원 재수" },
    { name: "종로학원", query: "종로학원 재수" },
    { name: "이투스247", query: "이투스247" },
    { name: "메가스터디학원", query: "메가스터디학원 재수" },
    { name: "청솔학원", query: "청솔학원 재수" },
    { name: "수만휘", query: "수만휘 기숙" },
  ]},
];

async function fetchNewsVolume(query: string): Promise<number> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) return 0;
  try {
    const url = new URL("https://openapi.naver.com/v1/search/news.json");
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
  const targets = area ? RANK_CATEGORIES.filter((a) => a.area === area) : RANK_CATEGORIES;

  const result: Record<string, RankResult[]> = {};

  for (const cat of targets) {
    const cached = cache.get(cat.area);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      result[cat.area] = cached.data;
      continue;
    }

    const items: RankResult[] = [];
    for (let i = 0; i < cat.items.length; i += 3) {
      const batch = cat.items.slice(i, i + 3);
      const batchResults = await Promise.all(
        batch.map(async (item) => ({
          name: item.name,
          searchVolume: await fetchNewsVolume(item.query),
        }))
      );
      items.push(...batchResults);
    }
    items.sort((a, b) => b.searchVolume - a.searchVolume);
    cache.set(cat.area, { data: items, timestamp: Date.now() });
    result[cat.area] = items;
  }

  const areas = RANK_CATEGORIES.map((a) => a.area);

  return NextResponse.json({ success: true, data: result, areas }, {
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
  });
}
