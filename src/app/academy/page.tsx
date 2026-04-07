"use client";

import { School, MapPin, Search, Loader2, Trophy, Phone, ChevronLeft, ChevronRight, Building } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const REGIONS = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const FIELDS = ["전체", "입시", "예능", "국제화", "직업기술"];

interface AcademyItem {
  name: string; region: string; district: string; field?: string; subject: string;
  course: string; address: string; phone: string; capacity: number;
  dormitory: boolean; established: string;
}

interface RankItem { name: string; shortName: string; trend: number; district: string; phone: string; established: string; }

export default function AcademyPage() {
  const [mainTab, setMainTab] = useState<"top" | "search">("top");

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <h1 className="text-[15px] font-bold">학원정보</h1>

      <div className="flex items-center gap-0 border-b border-border">
        <button onClick={() => setMainTab("top")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${mainTab === "top" ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-foreground"}`}>
          지역별 입시학원
        </button>
        <button onClick={() => setMainTab("search")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${mainTab === "search" ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-foreground"}`}>
          전국 학원 검색 <span className="text-[10px] text-muted-light ml-0.5">(95,000+)</span>
        </button>
      </div>

      {mainTab === "top" && <TopAcademies />}
      {mainTab === "search" && <AcademySearch />}
    </div>
  );
}

/* ── 지역별 입시학원 TOP ── */
function TopAcademies() {
  const [region, setRegion] = useState("서울");
  const [district, setDistrict] = useState("");
  const [academies, setAcademies] = useState<AcademyItem[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // 랭킹
  const [rankings, setRankings] = useState<Record<string, RankItem[]>>({});
  const [rankAreas, setRankAreas] = useState<string[]>([]);
  const [activeRankCat, setActiveRankCat] = useState("");
  const [rankLoading, setRankLoading] = useState(true);
  const [rankGroup, setRankGroup] = useState<"서울" | "경기" | "기타">("서울");

  const fetchTop = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ region, limit: "30" });
    if (district) params.set("district", district);
    const res = await fetch(`/api/academy-top?${params}`);
    const data = await res.json();
    if (data.success) {
      setAcademies(data.data); setTotal(data.total);
      if (data.districts) setDistricts(data.districts);
    }
    setLoading(false);
  }, [region, district]);

  useEffect(() => { fetchTop(); }, [fetchTop]);

  useEffect(() => {
    fetch("/api/academy-rank")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setRankings(d.data);
          setRankAreas(d.areas || Object.keys(d.data));
          setActiveRankCat(d.areas?.[0] || Object.keys(d.data)[0] || "");
        }
      })
      .finally(() => setRankLoading(false));
  }, []);

  return (
    <div className="space-y-3">
      {/* 지역 필터 */}
      <div className="flex items-center gap-1 flex-wrap">
        {REGIONS.map((r) => (
          <button key={r} onClick={() => { setRegion(r); setDistrict(""); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium ${region === r ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
            {r}
          </button>
        ))}
      </div>

      {/* 구군 */}
      {districts.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] font-semibold text-muted mr-1">구군</span>
          <button onClick={() => setDistrict("")}
            className={`px-2 py-0.5 rounded text-[10px] font-medium ${!district ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>전체</button>
          {districts.map((d) => (
            <button key={d} onClick={() => setDistrict(d)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${district === d ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
              {d}
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-light">{region} {district} 입시학원 총 <b className="text-foreground">{total.toLocaleString()}</b>개 (정원 순)</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 좌측: 학원 리스트 */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
          ) : (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="w-8">#</th>
                    <th className="td-title">학원명</th>
                    <th className="w-14">구군</th>
                    <th className="w-24 hidden md:table-cell">교습과정</th>
                    <th className="w-24 hidden md:table-cell">전화</th>
                  </tr>
                </thead>
                <tbody>
                  {academies.map((a, i) => (
                    <tr key={`${a.name}-${i}`}>
                      <td className="td-center text-[11px] text-muted-light">{i + 1}</td>
                      <td className="td-title">
                        <span className="font-semibold text-[12px]">{a.name}</span>
                        {a.established && <span className="text-[9px] text-muted-light ml-1">({a.established.slice(0,4)}~)</span>}
                      </td>
                      <td className="td-center text-[11px] text-muted">{a.district}</td>
                      <td className="hidden md:table-cell td-center text-[10px] text-muted">{a.course}</td>
                      <td className="hidden md:table-cell td-center text-[11px] text-muted">{a.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 우측: 랭킹 */}
        <div>
          <div className="bg-surface border border-border rounded-lg overflow-hidden sticky top-16">
            <div className="px-4 py-2 border-b-2 border-foreground bg-surface-secondary flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h2 className="text-[12px] font-bold">지역별 학원 랭킹</h2>
              <span className="text-[9px] text-muted-light ml-auto">검색 트렌드</span>
            </div>
            {/* 시도 그룹 탭 */}
            <div className="flex gap-0 border-b border-border-light">
              {(["서울", "경기", "기타"] as const).map((g) => (
                <button key={g} onClick={() => { setRankGroup(g); setActiveRankCat(""); }}
                  className={`flex-1 py-1.5 text-[10px] font-medium text-center transition-colors ${rankGroup === g ? "bg-primary-50 text-primary-700 border-b-2 border-primary-600 -mb-px" : "text-muted hover:bg-surface-hover"}`}>
                  {g}
                </button>
              ))}
            </div>
            {/* 세부 지역 탭 */}
            <div className="flex flex-wrap gap-0.5 px-2 py-1.5 border-b border-border-light bg-surface-secondary/30 max-h-24 overflow-y-auto">
              {rankAreas
                .filter((a) => {
                  if (rankGroup === "서울") return a.startsWith("서울");
                  if (rankGroup === "경기") return a.startsWith("경기");
                  return !a.startsWith("서울") && !a.startsWith("경기");
                })
                .map((cat) => (
                  <button key={cat} onClick={() => setActiveRankCat(cat)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${activeRankCat === cat ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
                    {cat.replace("서울 ", "").replace("경기 ", "")}
                  </button>
                ))}
            </div>
            {rankLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-4 h-4 text-primary-600 animate-spin" /></div>
            ) : activeRankCat && rankings[activeRankCat] ? (
              <div className="divide-y divide-border-light">
                {rankings[activeRankCat].map((r, i) => {
                  const maxTrend = rankings[activeRankCat][0]?.trend || 1;
                  const pct = maxTrend > 0 ? Math.round((r.trend / maxTrend) * 100) : 0;
                  return (
                    <div key={`${r.name}-${i}`} className="px-3 py-2 hover:bg-surface-hover transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-extrabold w-4 text-center ${
                          i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-light"
                        }`}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold truncate">{r.shortName || r.name}</p>
                          <div className="flex items-center gap-1.5 text-[9px] text-muted-light mt-0.5">
                            {r.established && <span>{r.established.slice(0,4)}~</span>}
                            {r.phone && <span>{r.phone}</span>}
                            {r.trend > 0 && <span className="text-primary-600">트렌드 {r.trend.toFixed(1)}</span>}
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 전국 학원 검색 ── */
function AcademySearch() {
  const [region, setRegion] = useState("서울");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [field, setField] = useState("입시");
  const [results, setResults] = useState<AcademyItem[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const size = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ region, page: String(page), size: String(size) });
    if (district) params.set("district", district);
    if (search) params.set("search", search);
    if (field && field !== "전체") params.set("field", field);
    const res = await fetch(`/api/academy-search?${params}`);
    const data = await res.json();
    if (data.success) {
      setResults(data.data); setTotal(data.total);
      if (data.districts) setDistricts(data.districts);
    }
    setLoading(false);
  }, [region, district, search, field, page]);

  useEffect(() => { fetchData(); }, [fetchData]);
  const totalPages = Math.ceil(total / size);

  return (
    <div className="space-y-3">
      <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-muted w-8">지역</span>
          {REGIONS.map((r) => (
            <button key={r} onClick={() => { setRegion(r); setDistrict(""); setPage(1); }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${region === r ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>{r}</button>
          ))}
        </div>
        {districts.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-semibold text-muted w-8">구군</span>
            <button onClick={() => { setDistrict(""); setPage(1); }} className={`px-2 py-0.5 rounded text-[10px] font-medium ${!district ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>전체</button>
            {districts.slice(0, 30).map((d) => (
              <button key={d} onClick={() => { setDistrict(d); setPage(1); }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${district === d ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>{d}</button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted w-8">분야</span>
          {FIELDS.map((f) => (
            <button key={f} onClick={() => { setField(f); setPage(1); }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${field === f ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>{f}</button>
          ))}
          <div className="ml-auto relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-light" />
            <input type="text" placeholder="학원명" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
              className="pl-7 pr-2 py-[4px] bg-surface border border-border rounded text-[11px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-32" />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-light">{region} {district} 총 <b className="text-foreground">{total.toLocaleString()}</b>개</p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
      ) : results.length > 0 ? (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="board-table">
            <thead>
              <tr>
                <th className="td-title">학원명</th>
                <th className="w-14">구군</th>
                <th className="w-24 hidden md:table-cell">교습과정</th>
                <th className="w-24 hidden md:table-cell">전화</th>
              </tr>
            </thead>
            <tbody>
              {results.map((a: any, i: number) => (
                <tr key={`${a.name}-${i}`}>
                  <td className="td-title">
                    <span className="font-semibold text-[12px]">{a.name}</span>
                    {a.established && <span className="text-[9px] text-muted-light ml-1">({a.established.slice(0,4)}~)</span>}
                  </td>
                  <td className="td-center text-[11px] text-muted">{a.district}</td>
                  <td className="hidden md:table-cell td-center text-[10px] text-muted">{a.course}</td>
                  <td className="hidden md:table-cell td-center text-[11px] text-muted">{a.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-surface border border-border rounded-lg text-[13px] text-muted">검색 결과가 없습니다.</div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="p-1.5 rounded border border-border text-muted-light disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 5, totalPages - 9));
            const p = start + i;
            if (p > totalPages) return null;
            return <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-[11px] font-medium ${p === page ? "bg-primary-600 text-white" : "border border-border text-muted hover:bg-surface-hover"}`}>{p}</button>;
          })}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="p-1.5 rounded border border-border text-muted-light disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}

      <p className="text-[10px] text-muted-light text-center">데이터: 공공데이터포털 전국학원교습소정보 (2026.02)</p>
    </div>
  );
}
