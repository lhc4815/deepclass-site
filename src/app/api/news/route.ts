import { NextRequest, NextResponse } from "next/server";
import type { NewsItem } from "@/lib/news-sources";

/**
 * 통합 뉴스 API
 * RSS + 네이버 API 결과를 합쳐서 반환
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "전체";
  const limit = searchParams.get("limit") || "20";

  const baseUrl = request.nextUrl.origin;

  // RSS와 네이버 API를 병렬 호출
  const [rssRes, naverRes] = await Promise.allSettled([
    fetch(`${baseUrl}/api/news/rss?category=${encodeURIComponent(category)}&limit=${limit}`),
    fetch(`${baseUrl}/api/news/naver?category=${encodeURIComponent(category)}&limit=${limit}`),
  ]);

  const allNews: NewsItem[] = [];

  // RSS 결과
  if (rssRes.status === "fulfilled" && rssRes.value.ok) {
    const rssData = await rssRes.value.json();
    if (rssData.success && rssData.data) {
      allNews.push(...rssData.data);
    }
  }

  // 네이버 결과
  if (naverRes.status === "fulfilled" && naverRes.value.ok) {
    const naverData = await naverRes.value.json();
    if (naverData.success && naverData.data) {
      allNews.push(...naverData.data);
    }
  }

  // 중복 제거 (제목 기준) + 날짜순 정렬
  const seen = new Set<string>();
  const uniqueNews = allNews.filter((item) => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key) || !key) return false;
    seen.add(key);
    return true;
  });

  uniqueNews.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  const limitNum = Math.min(Number(limit), 50);

  return NextResponse.json({
    success: true,
    count: Math.min(uniqueNews.length, limitNum),
    data: uniqueNews.slice(0, limitNum),
  });
}
