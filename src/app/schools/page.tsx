"use client";

import { School, Search, MapPin, Phone, ExternalLink, Loader2, ChevronLeft, ChevronRight, Building, GraduationCap, Trophy } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const regions = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

const schoolKinds = [
  { id: "고등학교", label: "고등학교" },
  { id: "중학교", label: "중학교" },
];

const typeColors: Record<string, string> = {
  "일반고": "bg-blue-100 text-blue-700",
  "특목고": "bg-purple-100 text-purple-700",
  "자율고": "bg-amber-100 text-amber-700",
  "특성화고": "bg-emerald-100 text-emerald-700",
  "외국어고": "bg-rose-100 text-rose-700",
  "과학고": "bg-indigo-100 text-indigo-700",
  "예술고": "bg-pink-100 text-pink-700",
  "체육고": "bg-orange-100 text-orange-700",
  "마이스터고": "bg-teal-100 text-teal-700",
  "중학교": "bg-gray-100 text-gray-700",
};

interface SchoolInfo {
  code: string; name: string; engName: string; kind: string; region: string;
  address: string; phone: string; homepage: string; coedu: string; founded: string;
  type: string; dayNight: string; publicPrivate: string;
}

export default function SchoolsPage() {
  const [region, setRegion] = useState("서울");
  const [kind, setKind] = useState("고등학교");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const size = 20;

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ region, kind, page: String(page), size: String(size) });
    if (search) params.set("search", search);
    const res = await fetch(`/api/schools?${params}`);
    const data = await res.json();
    if (data.success) { setSchools(data.data); setTotal(data.total); }
    else { setSchools([]); setTotal(0); }
    setLoading(false);
  }, [region, kind, search, page]);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const totalPages = Math.ceil(total / size);

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <h1 className="text-[15px] font-bold flex items-center gap-1.5">
        <School className="w-4 h-4 text-primary-600" />학교정보
      </h1>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-muted w-12">학교급</span>
          {schoolKinds.map((k) => (
            <button key={k.id} onClick={() => { setKind(k.id); setPage(1); }}
              className={`px-3 py-1 rounded text-[12px] font-medium ${kind === k.id ? "bg-primary-600 text-white" : "bg-surface-secondary text-muted hover:bg-background"}`}>
              {k.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-muted w-12">지역</span>
          {regions.map((r) => (
            <button key={r} onClick={() => { setRegion(r); setPage(1); }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${region === r ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-muted w-12">검색</span>
          <input type="text" placeholder="학교명 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 max-w-xs px-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400" />
          <button onClick={handleSearch} className="px-3 py-[5px] bg-primary-600 text-white rounded text-[11px] font-medium hover:bg-primary-700">검색</button>
          {search && <button onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="px-2 py-[5px] text-[11px] text-muted hover:text-foreground">초기화</button>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-light">
          {region} {kind} {search && `"${search}" `}총 <b className="text-foreground">{total.toLocaleString()}</b>개교
        </p>
        <p className="text-[11px] text-muted-light">{page} / {totalPages} 페이지</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 좌측: 학교 리스트 */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
          ) : schools.length > 0 ? (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="w-10">#</th>
                    <th className="td-title">학교명</th>
                    <th className="w-16">유형</th>
                    <th className="w-14">구분</th>
                    <th className="w-14">공학</th>
                    <th className="w-24 hidden md:table-cell">전화</th>
                    <th className="w-10">링크</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((s, i) => (
                    <tr key={s.code}>
                      <td className="td-center text-[11px] text-muted-light">{(page - 1) * size + i + 1}</td>
                      <td className="td-title">
                        <span className="font-semibold">{s.name}</span>
                      </td>
                      <td className="td-center">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColors[s.type] || typeColors["중학교"]}`}>{s.type}</span>
                      </td>
                      <td className="td-center text-[11px] text-muted">{s.publicPrivate}</td>
                      <td className="td-center text-[11px] text-muted">{s.coedu}</td>
                      <td className="hidden md:table-cell td-center text-[11px] text-muted">{s.phone}</td>
                      <td className="td-center">
                        {s.homepage && (
                          <a href={s.homepage.startsWith("http") ? s.homepage : `http://${s.homepage}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                            <ExternalLink className="w-3.5 h-3.5 inline" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-surface border border-border rounded-lg">
              <School className="w-8 h-8 text-muted-light mx-auto mb-2" />
              <p className="text-[13px] text-muted">검색 결과가 없습니다.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-3">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="p-1.5 rounded border border-border text-muted-light disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 5, totalPages - 9));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-[11px] font-medium ${p === page ? "bg-primary-600 text-white" : "border border-border text-muted hover:bg-surface-hover"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                className="p-1.5 rounded border border-border text-muted-light disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 우측: 학교 랭킹 */}
        <div>
          <SchoolRanking region={region} kind={kind} />
        </div>
      </div>

      <p className="text-[10px] text-muted-light text-center">데이터: 나이스(NEIS) 교육정보 개방 포털</p>
    </div>
  );
}

/* ── 학교 랭킹 사이드바 ── */
function SchoolRanking({ region, kind }: { region: string; kind: string }) {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/school-rank?region=${encodeURIComponent(region)}&kind=${encodeURIComponent(kind)}&limit=30`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setRanking(d.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [region, kind]);

  const withTrend = ranking.filter((r) => r.trend > 0);
  const withoutTrend = ranking.filter((r) => !r.trend);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden sticky top-16">
      <div className="px-4 py-2 border-b-2 border-foreground bg-surface-secondary flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-amber-500" />
        <h2 className="text-[12px] font-bold">{region} {kind} 랭킹</h2>
      </div>
      <div className="px-3 py-1 bg-surface-secondary/50 border-b border-border-light">
        <p className="text-[9px] text-muted-light">네이버 검색 트렌드 기반 · 주간 갱신</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-4 h-4 text-primary-600 animate-spin" /></div>
      ) : withTrend.length > 0 ? (
        <div className="divide-y divide-border-light max-h-[600px] overflow-y-auto">
          {withTrend.map((s: any, i: number) => {
            const maxTrend = withTrend[0]?.trend || 1;
            const pct = Math.round((s.trend / maxTrend) * 100);
            return (
              <div key={s.name} className="px-3 py-2 hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-extrabold w-4 text-center ${
                    i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-light"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] font-semibold truncate">{s.shortName || s.name}</p>
                      {s.type && <span className="text-[8px] text-muted-light">{s.type}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-muted-light">
                      <span>{s.publicPrivate}</span>
                      <span>{s.coedu}</span>
                      {s.trend > 0 && <span className="text-primary-600">트렌드 {s.trend.toFixed(1)}</span>}
                    </div>
                    {pct > 0 && (
                      <div className="w-full h-1 bg-surface-secondary rounded-full mt-0.5 overflow-hidden">
                        <div className="h-full bg-primary-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center py-6 text-[11px] text-muted-light">랭킹 데이터 수집 중...</p>
      )}
    </div>
  );
}
