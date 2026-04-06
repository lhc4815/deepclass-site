import { NextRequest, NextResponse } from "next/server";
import { RSS_SOURCES, type NewsItem } from "@/lib/news-sources";

/** 간단한 XML 태그에서 텍스트 추출 */
function extractTag(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
  const results: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function stripCdata(str: string): string {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim();
}

async function fetchRssFeed(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseRssItems(
  xml: string,
  source: { category: string; name: string }
): NewsItem[] {
  // <item>...</item> 블록 추출
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items: NewsItem[] = [];
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const rawTitle = stripCdata(extractTag(block, "title")[0] || "");
    const link = stripCdata(extractTag(block, "link")[0] || "");
    const pubDate = stripCdata(extractTag(block, "pubDate")[0] || "");
    const rawDesc = stripCdata(extractTag(block, "description")[0] || "");

    // Google News: "제목 - 매체명" 형식
    let title = rawTitle;
    let sourceName = source.name;
    const titleParts = rawTitle.split(" - ");
    if (titleParts.length > 1) {
      sourceName = titleParts[titleParts.length - 1].trim();
      title = titleParts.slice(0, -1).join(" - ").trim();
    }

    // ">" 이스케이프 처리
    title = title.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");

    if (!title) continue;

    items.push({
      id: `rss-${Buffer.from(link || title).toString("base64url")}`,
      title,
      link,
      description: stripHtml(rawDesc).slice(0, 200),
      source: sourceName,
      category: source.category,
      pubDate: pubDate || new Date().toISOString(),
      provider: "rss",
    });
  }

  return items;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "전체";
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

  try {
    const sources =
      category === "전체"
        ? RSS_SOURCES
        : RSS_SOURCES.filter(
            (s) => s.category === category || s.category === "전체"
          );

    const results = await Promise.allSettled(
      sources.map(async (source) => {
        const xml = await fetchRssFeed(source.url);
        return parseRssItems(xml, source);
      })
    );

    const allNews: NewsItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allNews.push(...result.value);
      }
    }

    // 중복 제거 + 날짜순 정렬
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

    return NextResponse.json({
      success: true,
      count: Math.min(uniqueNews.length, limit),
      data: uniqueNews.slice(0, limit),
    });
  } catch (error) {
    console.error("RSS fetch error:", error);
    return NextResponse.json(
      { success: false, error: "RSS news fetch failed" },
      { status: 500 }
    );
  }
}
