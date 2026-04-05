"use client";

import { GraduationCap, Search, MapPin, Phone, ExternalLink, Globe } from "lucide-react";
import { useState, useMemo } from "react";
import { UNIVERSITIES, type UniversityInfo } from "@/lib/university-data";

const regions = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const typeColors: Record<string, string> = {
  "국립": "bg-blue-100 text-blue-700",
  "공립": "bg-teal-100 text-teal-700",
  "사립": "bg-amber-100 text-amber-700",
};

const catColors: Record<string, string> = {
  "종합대학": "bg-gray-100 text-gray-700",
  "특수대학": "bg-purple-100 text-purple-700",
  "교육대학": "bg-emerald-100 text-emerald-700",
};

export default function UniversitiesPage() {
  const [region, setRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const filtered = useMemo(() => {
    let list = region === "전체" ? UNIVERSITIES : UNIVERSITIES.filter((u) => u.region === region);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.address.includes(q));
    }
    return list;
  }, [region, searchQuery]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { "전체": UNIVERSITIES.length };
    UNIVERSITIES.forEach((u) => { counts[u.region] = (counts[u.region] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-bold flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-primary-600" />대학정보
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
            <input type="text" placeholder="대학명 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-48" />
          </div>
          <div className="flex border border-border rounded overflow-hidden">
            <button onClick={() => setViewMode("table")} className={`px-2 py-1 text-[11px] ${viewMode === "table" ? "bg-primary-600 text-white" : "bg-surface text-muted"}`}>목록</button>
            <button onClick={() => setViewMode("card")} className={`px-2 py-1 text-[11px] ${viewMode === "card" ? "bg-primary-600 text-white" : "bg-surface text-muted"}`}>카드</button>
          </div>
        </div>
      </div>

      {/* 지역 필터 */}
      <div className="flex items-center gap-1 flex-wrap border-b border-border pb-2">
        {regions.map((r) => (
          <button key={r} onClick={() => setRegion(r)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium ${region === r ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
            {r}
            {regionCounts[r] ? <span className="ml-0.5 opacity-70">({regionCounts[r]})</span> : ""}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-muted-light">총 <b className="text-foreground">{filtered.length}</b>개 대학</p>

      {/* 테이블 뷰 */}
      {viewMode === "table" && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="board-table">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th className="td-title">대학명</th>
                <th className="w-14">지역</th>
                <th className="w-14">설립</th>
                <th className="hidden lg:table-cell td-title">주소</th>
                <th className="hidden md:table-cell w-24">전화</th>
                <th className="w-10">홈</th>
                <th className="w-14">입학처</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.name}>
                  <td className="td-center text-[11px] text-muted-light">{i + 1}</td>
                  <td className="td-title font-semibold">{u.name}</td>
                  <td className="td-center text-[11px] text-muted">{u.region}</td>
                  <td className="td-center">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColors[u.type] || ""}`}>{u.type}</span>
                  </td>
                  <td className="hidden lg:table-cell text-[11px] text-muted">{u.address}</td>
                  <td className="hidden md:table-cell td-center text-[11px] text-muted">{u.phone}</td>
                  <td className="td-center">
                    <a href={u.homepage} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      <Globe className="w-3.5 h-3.5 inline" />
                    </a>
                  </td>
                  <td className="td-center">
                    <a href={u.admissionUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-primary-600 hover:underline">
                      입학처
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 카드 뷰 */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((u) => (
            <div key={u.name} className="bg-surface border border-border rounded-lg p-3 hover:border-primary-300 transition-colors group">
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <h3 className="text-[13px] font-semibold">{u.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${typeColors[u.type] || ""}`}>{u.type}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${catColors[u.category] || catColors["종합대학"]}`}>{u.category}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-light">{u.region}</span>
              </div>
              <div className="text-[10px] text-muted space-y-0.5 mb-2">
                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{u.address}</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone}</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border-light">
                <a href={u.homepage} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary-600 hover:underline flex items-center gap-0.5">
                  <Globe className="w-3 h-3" />홈페이지
                </a>
                <a href={u.admissionUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary-600 hover:underline flex items-center gap-0.5">
                  <ExternalLink className="w-3 h-3" />입학처
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-surface border border-border rounded-lg">
          <GraduationCap className="w-8 h-8 text-muted-light mx-auto mb-2" />
          <p className="text-[13px] text-muted">검색 결과가 없습니다.</p>
        </div>
      )}

      <p className="text-[10px] text-muted-light text-center">추후 공공데이터 API 연동으로 전체 대학 목록이 확장됩니다.</p>
    </div>
  );
}
