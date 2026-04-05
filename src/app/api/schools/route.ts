import { NextRequest, NextResponse } from "next/server";

const NEIS_API_KEY = process.env.NEIS_API_KEY;

// 교육청 코드
const OFFICE_CODES: Record<string, string> = {
  "서울": "B10", "부산": "C10", "대구": "D10", "인천": "E10", "광주": "F10",
  "대전": "G10", "울산": "H10", "세종": "I10", "경기": "J10", "강원": "K10",
  "충북": "M10", "충남": "N10", "전북": "P10", "전남": "Q10", "경북": "R10",
  "경남": "S10", "제주": "T10",
};

interface SchoolInfo {
  code: string; name: string; engName: string; kind: string; region: string;
  address: string; phone: string; homepage: string; coedu: string; founded: string;
  type: string; dayNight: string; publicPrivate: string;
}

export async function GET(request: NextRequest) {
  if (!NEIS_API_KEY) {
    return NextResponse.json({ success: false, error: "NEIS API 키가 설정되지 않았습니다." });
  }

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "서울";
  const kind = searchParams.get("kind") || "고등학교";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const size = Math.min(Number(searchParams.get("size")) || 20, 100);

  const officeCode = OFFICE_CODES[region];
  if (!officeCode) {
    return NextResponse.json({ success: false, error: "올바른 지역을 선택해주세요." });
  }

  try {
    const url = new URL("https://open.neis.go.kr/hub/schoolInfo");
    url.searchParams.set("KEY", NEIS_API_KEY);
    url.searchParams.set("Type", "json");
    url.searchParams.set("ATPT_OFCDC_SC_CODE", officeCode);
    url.searchParams.set("SCHUL_KND_SC_NM", kind);
    url.searchParams.set("pIndex", String(page));
    url.searchParams.set("pSize", String(size));
    if (search) {
      url.searchParams.set("SCHUL_NM", search);
    }

    // Vercel 호환: agent 없이 fetch 사용
    const res = await fetch(url.toString(), {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();

    if (data.RESULT?.CODE === "INFO-200") {
      return NextResponse.json({ success: true, data: [], total: 0, page, size });
    }

    const info = data.schoolInfo;
    if (!info || !info[1]?.row) {
      return NextResponse.json({ success: true, data: [], total: 0, page, size });
    }

    const total = info[0]?.head?.[0]?.list_total_count || 0;
    const schools: SchoolInfo[] = info[1].row.map((r: any) => ({
      code: r.SD_SCHUL_CODE,
      name: r.SCHUL_NM,
      engName: r.ENG_SCHUL_NM || "",
      kind: r.SCHUL_KND_SC_NM,
      region: r.LCTN_SC_NM,
      address: `${r.ORG_RDNMA || ""} ${r.ORG_RDNDA || ""}`.trim(),
      phone: r.ORG_TELNO || "",
      homepage: r.HMPG_ADRES || "",
      coedu: r.COEDU_SC_NM || "",
      founded: r.FOND_YMD || "",
      type: r.HS_SC_NM || r.SCHUL_KND_SC_NM || "",
      dayNight: r.DGHT_SC_NM || "",
      publicPrivate: r.FOND_SC_NM || "",
    }));

    return NextResponse.json({
      success: true, data: schools, total, page, size,
    }, {
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
