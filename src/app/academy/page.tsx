"use client";

import { School, MapPin, ExternalLink, Search, BookOpen, MonitorPlay, Building, GraduationCap, Star, TrendingUp, Loader2, Trophy, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Academy { name: string; url: string; description: string; location: string; specialties: string[]; type: string; }
interface AcademyCategory { id: string; label: string; icon: typeof School; academies: Academy[]; }

const academyCategories: AcademyCategory[] = [
  { id: "major", label: "대형 입시학원", icon: Building, academies: [
    { name: "대성학원", url: "https://www.dshw.co.kr", description: "재수종합반 명문, 전국 단위 대형 입시학원", location: "대치동 외 전국", specialties: ["재수종합반", "수능", "정시"], type: "종합" },
    { name: "종로학원", url: "https://www.jongro.co.kr", description: "70년 전통 입시 명문, 재수·수능 전문", location: "종로 외 전국", specialties: ["재수종합반", "수능"], type: "종합" },
    { name: "이투스247", url: "https://247.etoos.com", description: "이투스 재수종합반, 체계적 관리형", location: "노량진·강남 외", specialties: ["재수종합반", "관리형"], type: "종합" },
    { name: "메가스터디학원", url: "https://campus.megastudy.net", description: "메가스터디 오프라인 재수학원 (러셀)", location: "강남·목동 외", specialties: ["재수종합반", "단과"], type: "종합" },
  ]},
  { id: "daechi", label: "대치동 유명학원", icon: Star, academies: [
    { name: "시대인재", url: "https://www.sdij.com", description: "대치동 대표 입시학원, 수능·수시 전문", location: "대치동", specialties: ["수능", "수시", "논술"], type: "입시전문" },
    { name: "강남대성학원", url: "https://kangnam.dshw.co.kr", description: "강남 대성학원 재수종합반", location: "대치동", specialties: ["재수종합반", "수능"], type: "종합" },
    { name: "청솔학원", url: "https://cheongsol.etoos.com", description: "이투스 직영, 재수·반수 전문", location: "강남", specialties: ["재수", "반수"], type: "재수전문" },
  ]},
  { id: "online", label: "온라인 인강", icon: MonitorPlay, academies: [
    { name: "메가스터디", url: "https://www.megastudy.net", description: "국내 최대 온라인 수능 인강", location: "온라인", specialties: ["수능", "내신", "전과목"], type: "인강" },
    { name: "대성마이맥", url: "https://www.mimacstudy.com", description: "대성학원 계열 온라인 인강", location: "온라인", specialties: ["수능", "내신"], type: "인강" },
    { name: "이투스", url: "https://www.etoos.com", description: "수능·내신 인강, 모의고사", location: "온라인", specialties: ["수능", "모의고사"], type: "인강" },
    { name: "EBSi", url: "https://www.ebsi.co.kr", description: "교육부 무료 수능 강의", location: "온라인", specialties: ["무료", "수능"], type: "무료인강" },
    { name: "스카이에듀", url: "https://www.skyedu.com", description: "하늘교육 온라인 인강", location: "온라인", specialties: ["수능", "내신"], type: "인강" },
  ]},
  { id: "consulting", label: "입시 컨설팅", icon: GraduationCap, academies: [
    { name: "진학사", url: "https://www.jinhak.com", description: "대표 입시 정보·컨설팅 기업", location: "온라인·오프라인", specialties: ["합격예측", "배치표"], type: "컨설팅" },
    { name: "유웨이", url: "https://www.uway.com", description: "입시 정보, 성적 분석, 합격 예측", location: "온라인·오프라인", specialties: ["합격예측", "성적분석"], type: "컨설팅" },
    { name: "새이솔", url: "https://www.saeisol.com", description: "입시 리포트, 전형 분석 전문", location: "온라인", specialties: ["리포트", "전형분석"], type: "분석" },
  ]},
  { id: "subject", label: "과목별 전문", icon: BookOpen, academies: [
    { name: "수만휘", url: "https://www.sumanhui.kr", description: "수능 커뮤니티 기반 기숙/스파르타 학원 (전국 50개 지점)", location: "전국", specialties: ["재수", "기숙", "스파르타"], type: "기숙학원" },
    { name: "CMS에듀", url: "https://www.cmsedu.co.kr", description: "수학 사고력 전문 학원", location: "전국", specialties: ["수학", "사고력"], type: "과목전문" },
  ]},
];

interface RankItem { name: string; searchVolume: number; }

export default function AcademyPage() {
  const [mainTab, setMainTab] = useState<"recommend" | "search">("recommend");
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rankings, setRankings] = useState<RankItem[]>([]);
  const [rankLoading, setRankLoading] = useState(true);

  useEffect(() => {
    fetch("/api/academy-rank")
      .then((r) => r.json())
      .then((d) => { if (d.success) setRankings(d.data); })
      .catch(() => {})
      .finally(() => setRankLoading(false));
  }, []);

  const filtered = activeCat === "all" ? academyCategories : academyCategories.filter((c) => c.id === activeCat);
  const searched = searchQuery
    ? filtered.map((c) => ({ ...c, academies: c.academies.filter((a) => a.name.includes(searchQuery) || a.description.includes(searchQuery)) })).filter((c) => c.academies.length > 0)
    : filtered;

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <h1 className="text-[15px] font-bold">학원정보</h1>

      {/* Main Tabs */}
      <div className="flex items-center gap-0 border-b border-border">
        <button onClick={() => setMainTab("recommend")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${mainTab === "recommend" ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-foreground"}`}>
          추천 학원
        </button>
        <button onClick={() => setMainTab("search")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${mainTab === "search" ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-foreground"}`}>
          전국 학원 검색 <span className="text-[10px] text-muted-light ml-0.5">(95,000+)</span>
        </button>
      </div>

      {mainTab === "search" && <AcademySearch />}

      {mainTab === "recommend" && <>
      <div className="flex items-center justify-between">
        <div />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
          <input type="text" placeholder="학원 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-48" />
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border pb-2">
        <button onClick={() => setActiveCat("all")} className={`px-3 py-1 rounded text-[12px] font-medium ${activeCat === "all" ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>전체</button>
        {academyCategories.map((c) => (
          <button key={c.id} onClick={() => setActiveCat(c.id)}
            className={`px-3 py-1 rounded text-[12px] font-medium ${activeCat === c.id ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 좌측: 학원 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {searched.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-1.5 mb-2">
                <cat.icon className="w-4 h-4 text-primary-600" />
                <h2 className="text-[13px] font-bold">{cat.label}</h2>
                <span className="text-[10px] text-muted-light">{cat.academies.length}개</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {cat.academies.map((a) => (
                  <a key={a.name + a.url} href={a.url} target="_blank" rel="noopener noreferrer"
                    className="bg-surface border border-border rounded-lg p-3 hover:border-primary-300 transition-colors group">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="text-[13px] font-semibold group-hover:text-primary-600 transition-colors">{a.name}</h3>
                        <span className="text-[10px] text-muted-light">{a.type}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-light opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed mb-2">{a.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-light mb-1.5">
                      <MapPin className="w-3 h-3" />{a.location}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {a.specialties.map((s) => <span key={s} className="px-1.5 py-0.5 bg-surface-secondary text-[9px] text-muted-light rounded">{s}</span>)}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 우측: 인기 랭킹 */}
        <div>
          <div className="bg-surface border border-border rounded-lg overflow-hidden sticky top-16">
            <div className="px-4 py-2.5 border-b-2 border-foreground bg-surface-secondary flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h2 className="text-[13px] font-bold">입시학원 인기 랭킹</h2>
            </div>
            <div className="px-3 py-1.5 bg-surface-secondary/50 border-b border-border-light">
              <p className="text-[10px] text-muted-light">네이버 검색량 기준 · 1시간마다 업데이트</p>
            </div>
            {rankLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-4 h-4 text-primary-600 animate-spin" /></div>
            ) : (
              <div className="divide-y divide-border-light">
                {rankings.map((r, i) => {
                  const maxVol = rankings[0]?.searchVolume || 1;
                  const pct = Math.round((r.searchVolume / maxVol) * 100);
                  return (
                    <div key={r.name} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-surface-hover transition-colors">
                      <span className={`text-[12px] font-extrabold w-5 text-center ${
                        i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-light"
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium truncate">{r.name}</p>
                        <div className="w-full h-1 bg-surface-secondary rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-primary-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-light flex-shrink-0">
                        {r.searchVolume >= 10000 ? `${(r.searchVolume / 10000).toFixed(1)}만` : r.searchVolume >= 1000 ? `${(r.searchVolume / 1000).toFixed(1)}천` : r.searchVolume}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      </>}
    </div>
  );
}

/* ── 전국 학원 검색 ── */
const REGIONS = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const FIELDS = ["전체", "입시", "예능", "국제화", "직업기술"];

interface SearchResult {
  name: string; region: string; district: string; field: string;
  subject: string; course: string; address: string; phone: string;
}

function AcademySearch() {
  const [region, setRegion] = useState("서울");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [field, setField] = useState("입시");
  const [results, setResults] = useState<SearchResult[]>([]);
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
      {/* Filters */}
      <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-muted w-10">지역</span>
          {REGIONS.map((r) => (
            <button key={r} onClick={() => { setRegion(r); setDistrict(""); setPage(1); }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${region === r ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
              {r}
            </button>
          ))}
        </div>
        {districts.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[12px] font-semibold text-muted w-10">구군</span>
            <button onClick={() => { setDistrict(""); setPage(1); }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${!district ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>전체</button>
            {districts.slice(0, 30).map((d) => (
              <button key={d} onClick={() => { setDistrict(d); setPage(1); }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${district === d ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
                {d}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-muted w-10">분야</span>
          {FIELDS.map((f) => (
            <button key={f} onClick={() => { setField(f); setPage(1); }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${field === f ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
              {f}
            </button>
          ))}
          <div className="ml-auto relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
            <input type="text" placeholder="학원명 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
              className="pl-8 pr-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-40" />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-light">{region} {district} {field !== "전체" ? field : ""} 학원 총 <b className="text-foreground">{total.toLocaleString()}</b>개</p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
      ) : results.length > 0 ? (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="board-table">
            <thead>
              <tr>
                <th className="td-title">학원명</th>
                <th className="w-14">구군</th>
                <th className="w-20">분야</th>
                <th className="w-20 hidden md:table-cell">교습과정</th>
                <th className="hidden lg:table-cell td-title">주소</th>
                <th className="w-24 hidden md:table-cell">전화</th>
              </tr>
            </thead>
            <tbody>
              {results.map((a, i) => (
                <tr key={`${a.name}-${i}`}>
                  <td className="td-title font-semibold text-[12px]">{a.name}</td>
                  <td className="td-center text-[11px] text-muted">{a.district}</td>
                  <td className="td-center text-[10px] text-muted">{a.field.slice(0, 8)}</td>
                  <td className="hidden md:table-cell td-center text-[10px] text-muted">{a.course}</td>
                  <td className="hidden lg:table-cell text-[11px] text-muted">{a.address}</td>
                  <td className="hidden md:table-cell td-center text-[11px] text-muted">{a.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-surface border border-border rounded-lg text-[13px] text-muted">검색 결과가 없습니다.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="p-1.5 rounded border border-border text-muted-light hover:text-foreground disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 5, totalPages - 9));
            const p = start + i;
            if (p > totalPages) return null;
            return (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-[12px] font-medium ${p === page ? "bg-primary-600 text-white" : "border border-border text-muted hover:bg-surface-hover"}`}>
                {p}
              </button>
            );
          })}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
            className="p-1.5 rounded border border-border text-muted-light hover:text-foreground disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-[10px] text-muted-light text-center">데이터 출처: 공공데이터포털 전국학원교습소정보 (2026.02 기준)</p>
    </div>
  );
}
