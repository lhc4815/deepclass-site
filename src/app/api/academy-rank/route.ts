import { NextResponse } from "next/server";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

interface RankResult {
  name: string;
  searchVolume: number;
  category: string;
}

// 캐시 (2시간)
let cache: { data: Record<string, RankResult[]>; timestamp: number } | null = null;
const CACHE_TTL = 7200000;

const RANK_CATEGORIES: { category: string; items: { name: string; query: string }[] }[] = [
  {
    category: "대형 입시학원",
    items: [
      { name: "대성학원", query: "대성학원 입시" },
      { name: "종로학원", query: "종로학원 입시" },
      { name: "이투스247", query: "이투스247 재수" },
      { name: "메가스터디학원", query: "메가스터디 학원" },
      { name: "비상에듀", query: "비상에듀 학원" },
      { name: "시대인재", query: "시대인재 학원" },
      { name: "강남대성", query: "강남대성학원" },
      { name: "청솔학원", query: "청솔학원 재수" },
    ],
  },
  {
    category: "온라인 인강",
    items: [
      { name: "메가스터디", query: "메가스터디 인강" },
      { name: "대성마이맥", query: "대성마이맥 인강" },
      { name: "이투스", query: "이투스 인강" },
      { name: "EBSi", query: "EBSi 수능 강의" },
      { name: "스카이에듀", query: "스카이에듀 인강" },
    ],
  },
  {
    category: "입시 컨설팅",
    items: [
      { name: "진학사", query: "진학사 입시" },
      { name: "유웨이", query: "유웨이 입시" },
      { name: "새이솔", query: "새이솔 입시" },
      { name: "하이스트", query: "하이스트 입시 컨설팅" },
      { name: "종로학원 입시분석", query: "종로학원 배치표" },
    ],
  },
  {
    category: "수학 학원/강사",
    items: [
      { name: "현우진", query: "현우진 수학" },
      { name: "CMS에듀", query: "CMS에듀 수학" },
      { name: "수만휘", query: "수만휘 학원" },
      { name: "이하영 수학", query: "이하영 수학 강의" },
      { name: "정승제 수학", query: "정승제 수학" },
    ],
  },
  {
    category: "국어 강사",
    items: [
      { name: "박광일", query: "박광일 국어" },
      { name: "최서희", query: "최서희 국어" },
      { name: "이원준", query: "이원준 국어" },
      { name: "김동욱", query: "김동욱 국어 강의" },
    ],
  },
  {
    category: "영어 강사",
    items: [
      { name: "조정식", query: "조정식 영어" },
      { name: "김기훈", query: "김기훈 영어" },
      { name: "이충권", query: "이충권 영어 강의" },
    ],
  },
  {
    category: "의대 입시",
    items: [
      { name: "메디프렙", query: "메디프렙 의대" },
      { name: "MDC", query: "MDC 의대 입시" },
      { name: "프로메디", query: "프로메디 의대" },
      { name: "메디칼에듀", query: "메디칼에듀 의대" },
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

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: cache.data, cached: true });
  }

  const result: Record<string, RankResult[]> = {};

  for (const cat of RANK_CATEGORIES) {
    const items: RankResult[] = [];

    // 배치 처리 (3개씩)
    for (let i = 0; i < cat.items.length; i += 3) {
      const batch = cat.items.slice(i, i + 3);
      const batchResults = await Promise.all(
        batch.map(async (item) => ({
          name: item.name,
          searchVolume: await fetchSearchVolume(item.query),
          category: cat.category,
        }))
      );
      items.push(...batchResults);
    }

    items.sort((a, b) => b.searchVolume - a.searchVolume);
    result[cat.category] = items;
  }

  cache = { data: result, timestamp: Date.now() };

  return NextResponse.json({
    success: true,
    data: result,
    cached: false,
  }, {
    headers: { "Cache-Control": "public, max-age=7200, s-maxage=7200" },
  });
}
