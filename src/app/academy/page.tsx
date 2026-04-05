"use client";

import { School, MapPin, ExternalLink, Star, Search, BookOpen, MonitorPlay, Building, GraduationCap } from "lucide-react";
import { useState } from "react";

interface Academy { name: string; url: string; description: string; location: string; specialties: string[]; type: string; rating?: number; }
interface AcademyCategory { id: string; label: string; icon: typeof School; academies: Academy[]; }

const academyCategories: AcademyCategory[] = [
  { id: "major", label: "대형 입시학원", icon: Building, academies: [
    { name: "대성학원", url: "https://www.daesung.com", description: "재수종합반 명문, 전국 단위 대형 입시학원", location: "대치동 외 전국", specialties: ["재수종합반", "수능", "정시"], type: "종합", rating: 4.5 },
    { name: "종로학원", url: "https://www.jongro.co.kr", description: "70년 전통 입시 명문, 재수·수능 전문", location: "종로 외 전국", specialties: ["재수종합반", "수능"], type: "종합", rating: 4.4 },
    { name: "이투스247", url: "https://www.etoos247.com", description: "이투스 재수종합반, 체계적 관리형", location: "노량진·강남 외", specialties: ["재수종합반", "관리형"], type: "종합", rating: 4.3 },
    { name: "메가스터디학원", url: "https://academy.megastudy.net", description: "메가스터디 오프라인 학원", location: "강남·목동 외", specialties: ["재수종합반", "단과"], type: "종합", rating: 4.3 },
    { name: "비상에듀학원", url: "https://www.visangedu.com", description: "비상교육 계열 입시학원", location: "대치동 외", specialties: ["수능", "내신"], type: "종합", rating: 4.2 },
  ]},
  { id: "daechi", label: "대치동 유명학원", icon: Star, academies: [
    { name: "시대인재", url: "https://www.sdij.co.kr", description: "대치동 대표 입시학원, 수능·수시 전문", location: "대치동", specialties: ["수능", "수시", "논술"], type: "입시전문", rating: 4.6 },
    { name: "유웨이학원", url: "https://www.uway.com", description: "입시 컨설팅 전문", location: "대치동", specialties: ["컨설팅", "수시", "정시"], type: "컨설팅", rating: 4.4 },
    { name: "강남대성학원", url: "https://www.gnds.co.kr", description: "강남 대성학원 재수종합반", location: "대치동", specialties: ["재수종합반", "수능"], type: "종합", rating: 4.5 },
    { name: "청솔학원", url: "https://www.chungsol.co.kr", description: "재수·반수 전문", location: "강남", specialties: ["재수", "반수"], type: "재수전문", rating: 4.3 },
  ]},
  { id: "online", label: "온라인 인강", icon: MonitorPlay, academies: [
    { name: "메가스터디", url: "https://www.megastudy.net", description: "국내 최대 온라인 수능 인강", location: "온라인", specialties: ["수능", "내신", "전과목"], type: "인강", rating: 4.5 },
    { name: "대성마이맥", url: "https://www.mimacstudy.com", description: "대성학원 계열 온라인 인강", location: "온라인", specialties: ["수능", "내신"], type: "인강", rating: 4.4 },
    { name: "이투스", url: "https://www.etoos.com", description: "수능·내신 인강, 모의고사", location: "온라인", specialties: ["수능", "모의고사"], type: "인강", rating: 4.3 },
    { name: "EBSi", url: "https://www.ebsi.co.kr", description: "교육부 무료 수능 강의", location: "온라인", specialties: ["무료", "수능"], type: "무료인강", rating: 4.6 },
    { name: "스카이에듀", url: "https://www.skyedu.com", description: "하늘교육 온라인 인강", location: "온라인", specialties: ["수능", "내신"], type: "인강", rating: 4.2 },
  ]},
  { id: "consulting", label: "입시 컨설팅", icon: GraduationCap, academies: [
    { name: "진학사", url: "https://www.jinhak.com", description: "대표 입시 정보·컨설팅 기업", location: "온라인·오프라인", specialties: ["합격예측", "배치표"], type: "컨설팅", rating: 4.5 },
    { name: "유웨이", url: "https://www.uway.com", description: "입시 정보, 성적 분석, 합격 예측", location: "온라인·오프라인", specialties: ["합격예측", "성적분석"], type: "컨설팅", rating: 4.4 },
    { name: "새이솔", url: "https://www.saeisol.com", description: "입시 리포트, 전형 분석 전문", location: "온라인", specialties: ["리포트", "전형분석"], type: "분석", rating: 4.3 },
    { name: "하이스트", url: "https://www.hiest.co.kr", description: "1:1 맞춤 입시 컨설팅, 학종 전문", location: "강남·대치", specialties: ["학종", "자소서"], type: "컨설팅", rating: 4.4 },
  ]},
  { id: "subject", label: "과목별 전문", icon: BookOpen, academies: [
    { name: "현우진 수학 (메가)", url: "https://www.megastudy.net", description: "수능 수학 대표 강사", location: "온라인", specialties: ["수학", "수능"], type: "과목전문" },
    { name: "CMS에듀", url: "https://www.cmsedu.co.kr", description: "수학 사고력 전문 학원", location: "전국", specialties: ["수학", "사고력"], type: "과목전문", rating: 4.3 },
  ]},
];

export default function AcademyPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = activeCat === "all" ? academyCategories : academyCategories.filter((c) => c.id === activeCat);
  const searched = searchQuery
    ? filtered.map((c) => ({ ...c, academies: c.academies.filter((a) => a.name.includes(searchQuery) || a.description.includes(searchQuery)) })).filter((c) => c.academies.length > 0)
    : filtered;

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-bold">학원정보</h1>
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

      {searched.map((cat) => (
        <div key={cat.id} className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-surface-secondary flex items-center gap-1.5">
            <cat.icon className="w-3.5 h-3.5 text-primary-600" />
            <h2 className="text-[12px] font-bold">{cat.label}</h2>
            <span className="text-[10px] text-muted-light ml-1">{cat.academies.length}개</span>
          </div>
          <table className="board-table">
            <thead>
              <tr>
                <th className="td-title">학원명</th>
                <th className="td-title">설명</th>
                <th className="w-24">위치</th>
                <th className="w-16">평점</th>
                <th className="w-12">링크</th>
              </tr>
            </thead>
            <tbody>
              {cat.academies.map((a) => (
                <tr key={a.name + a.url}>
                  <td className="td-title">
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary-600 hover:underline">{a.name}</a>
                    <div className="flex gap-0.5 mt-0.5">
                      {a.specialties.map((s) => <span key={s} className="px-1 py-0.5 bg-surface-secondary text-[9px] text-muted-light rounded">{s}</span>)}
                    </div>
                  </td>
                  <td className="text-[12px] text-muted">{a.description}</td>
                  <td className="td-center text-[11px] text-muted-light">{a.location}</td>
                  <td className="td-center">
                    {a.rating && <span className="text-[11px] font-bold text-amber-600 flex items-center justify-center gap-0.5"><Star className="w-3 h-3" fill="currentColor" />{a.rating}</span>}
                  </td>
                  <td className="td-center">
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
