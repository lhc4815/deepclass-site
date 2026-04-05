import { NextRequest, NextResponse } from "next/server";

/**
 * URL에서 og:image 메타 태그를 추출하는 API
 * GET /api/og-image?url=https://example.com/article
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ image: null });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DeepClassBot/1.0; +https://deepclass.site)",
        Accept: "text/html",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) return NextResponse.json({ image: null });

    // HTML의 처음 부분만 읽기 (og:image는 <head> 안에 있으므로)
    const text = await res.text();
    const head = text.slice(0, 15000);

    // og:image 추출
    const ogMatch = head.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    head.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );

    // twitter:image 폴백
    const twMatch = head.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    head.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );

    const image = ogMatch?.[1] || twMatch?.[1] || null;

    return NextResponse.json(
      { image },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  } catch {
    return NextResponse.json({ image: null });
  }
}
