import { NextRequest, NextResponse } from "next/server";
import { NAVER_KEYWORDS, type NewsItem } from "@/lib/news-sources";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

interface NaverResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim();
}

export async function GET(request: NextRequest) {
  // API 키 미설정 시 안내
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return NextResponse.json({
      success: false,
      error: "네이버 API 키가 설정되지 않았습니다. .env.local에 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정해주세요.",
      setup_guide: true,
    }, { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "전체";
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

  try {
    // 카테고리에 해당하는 키워드 필터링
    const keywords =
      category === "전체"
        ? NAVER_KEYWORDS
        : NAVER_KEYWORDS.filter((k) => k.category === category || k.category === "전체");

    // 네이버 API 병렬 호출
    const results = await Promise.allSettled(
      keywords.map(async (kw) => {
        const url = new URL("https://openapi.naver.com/v1/search/news.json");
        url.searchParams.set("query", kw.keyword);
        url.searchParams.set("display", "10");
        url.searchParams.set("sort", "date");

        const res = await fetch(url.toString(), {
          headers: {
            "X-Naver-Client-Id": NAVER_CLIENT_ID!,
            "X-Naver-Client-Secret": NAVER_CLIENT_SECRET!,
          },
        });

        if (!res.ok) throw new Error(`Naver API error: ${res.status}`);

        const data: NaverResponse = await res.json();

        return data.items.map((item): NewsItem => ({
          id: `naver-${Buffer.from(item.link).toString("base64").slice(0, 20)}`,
          title: stripHtml(item.title),
          link: item.originallink || item.link,
          description: stripHtml(item.description).slice(0, 200),
          source: extractSource(item.originallink),
          category: kw.category,
          pubDate: item.pubDate,
          provider: "naver",
        }));
      })
    );

    const allNews: NewsItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allNews.push(...result.value);
      }
    }

    // 중복 제거 + 정렬
    const seen = new Set<string>();
    const uniqueNews = allNews.filter((item) => {
      const key = item.title.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    uniqueNews.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({
      success: true,
      count: Math.min(uniqueNews.length, limit),
      data: uniqueNews.slice(0, limit),
    });
  } catch (error) {
    console.error("Naver API error:", error);
    return NextResponse.json(
      { success: false, error: "네이버 뉴스를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

/** URL에서 매체명 추출 */
function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const knownSources: Record<string, string> = {
      "chosun.com": "조선일보",
      "edu.chosun.com": "조선에듀",
      "donga.com": "동아일보",
      "joongang.co.kr": "중앙일보",
      "hani.co.kr": "한겨레",
      "khan.co.kr": "경향신문",
      "veritas-a.com": "베리타스알파",
      "unn.net": "한국대학신문",
      "ebs.co.kr": "EBS",
      "yna.co.kr": "연합뉴스",
      "mk.co.kr": "매일경제",
      "hankyung.com": "한국경제",
      "news1.kr": "뉴스1",
      "newsis.com": "뉴시스",
      "segye.com": "세계일보",
      "edaily.co.kr": "이데일리",
      "dt.co.kr": "디지털타임스",
    };
    return knownSources[hostname] || hostname;
  } catch {
    return "기타";
  }
}
