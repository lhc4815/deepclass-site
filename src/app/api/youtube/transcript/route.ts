import { NextRequest, NextResponse } from "next/server";
import https from "https";

export const runtime = "nodejs";

/** YouTube 비디오 페이지에서 자막 URL 추출 후 자막 텍스트 반환 */

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

function extractText(xml: string): string {
  // <text> 태그에서 텍스트 추출
  const texts: string[] = [];
  const regex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    let t = match[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, " ")
      .trim();
    if (t) texts.push(t);
  }
  return texts.join(" ");
}

// GET: 유튜브 영상 자막(스크립트) 추출
export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("v");
  if (!videoId) {
    return NextResponse.json({ success: false, error: "videoId 필요" }, { status: 400 });
  }

  try {
    // 1. 비디오 페이지에서 자막 URL 추출
    const html = await httpsGet(`https://www.youtube.com/watch?v=${videoId}`);

    const captionMatch = html.match(/"captionTracks":\[(.*?)\]/);
    if (!captionMatch) {
      return NextResponse.json({ success: false, error: "자막이 없는 영상입니다." });
    }

    // 자막 URL 추출 (한국어 우선, 없으면 첫번째)
    const captionData = captionMatch[1];
    let captionUrl = "";

    // 한국어 자막 찾기
    const koMatch = captionData.match(/"baseUrl":"(.*?)"/);
    if (koMatch) {
      captionUrl = koMatch[1].replace(/\\u0026/g, "&");
    }

    if (!captionUrl) {
      return NextResponse.json({ success: false, error: "자막 URL을 찾을 수 없습니다." });
    }

    // 2. 자막 XML 다운로드
    const xml = await httpsGet(captionUrl);
    const transcript = extractText(xml);

    if (!transcript) {
      return NextResponse.json({ success: false, error: "자막 내용이 비어있습니다." });
    }

    // 3. 요약 생성 (앞부분 2000자 기반 간단 요약)
    const summary = transcript.length > 500
      ? transcript.slice(0, 2000).replace(/\s+/g, " ").trim() + "..."
      : transcript;

    return NextResponse.json({
      success: true,
      videoId,
      transcript: transcript.slice(0, 5000), // 최대 5000자
      summary,
      length: transcript.length,
    }, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
