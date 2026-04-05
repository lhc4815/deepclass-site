"use client";

import { Globe, ExternalLink, Search, Landmark, MessageSquare, BookOpen, GraduationCap, MonitorPlay, Building } from "lucide-react";
import { useState } from "react";

interface SiteItem { name: string; url: string; description: string; tags: string[]; }
interface SiteCategory { id: string; label: string; icon: typeof Globe; sites: SiteItem[]; }

const siteCategories: SiteCategory[] = [
  { id: "public", label: "공공·공식", icon: Landmark, sites: [
    { name: "대입정보포털 (어디가)", url: "https://www.adiga.kr", description: "한국대학교육협의회 운영, 대입 전형/합격예측 공식 정보", tags: ["공식", "합격예측"] },
    { name: "EBSi", url: "https://www.ebsi.co.kr", description: "EBS 수능 강의, 교재, 모의고사, 대입정보", tags: ["수능", "무료강의"] },
    { name: "한국교육과정평가원", url: "https://www.kice.re.kr", description: "수능 출제기관, 기출문제, 성적 관련 공식 정보", tags: ["수능", "기출"] },
    { name: "대학알리미", url: "https://www.academyinfo.go.kr", description: "대학 정보 공시, 취업률·등록금·장학금 비교", tags: ["대학정보", "취업률"] },
    { name: "커리어넷", url: "https://www.career.go.kr", description: "교육부 진로정보망, 적성검사, 학과정보", tags: ["진로", "적성검사"] },
  ]},
  { id: "community", label: "입시 커뮤니티", icon: MessageSquare, sites: [
    { name: "오르비", url: "https://orbi.kr", description: "대한민국 대표 입시 커뮤니티", tags: ["커뮤니티", "수능"] },
    { name: "수만휘", url: "https://www.sumanhui.kr", description: "수능 커뮤니티 기반, 기숙/스파르타 학원", tags: ["수능", "커뮤니티"] },
    { name: "네이버 카페 수만휘", url: "https://cafe.naver.com/suhui", description: "수능 관련 네이버 대표 카페", tags: ["카페", "수능"] },
    { name: "대치동 학부모 카페", url: "https://cafe.naver.com/daechidong1", description: "대치동 학부모 커뮤니티, 학원/입시 정보", tags: ["학부모", "대치동"] },
    { name: "맘스홀릭", url: "https://cafe.naver.com/momsholick", description: "학부모 대표 카페, 입시·교육 정보", tags: ["학부모", "교육"] },
  ]},
  { id: "media", label: "입시 전문 매체", icon: BookOpen, sites: [
    { name: "베리타스알파", url: "https://www.veritas-a.com", description: "대입 전문 뉴스, 입시 분석 기사", tags: ["뉴스", "입시분석"] },
    { name: "조선에듀", url: "https://edu.chosun.com", description: "조선일보 교육 섹션, 입시 뉴스·칼럼", tags: ["뉴스", "칼럼"] },
    { name: "한국대학신문", url: "https://news.unn.net", description: "대학·입시 전문 뉴스", tags: ["뉴스", "대학"] },
    { name: "대학저널", url: "https://www.dhnews.co.kr", description: "대학·입시 뉴스, 대학 랭킹", tags: ["뉴스", "랭킹"] },
    { name: "에듀동아", url: "https://edu.donga.com", description: "동아일보 교육 섹션", tags: ["뉴스", "교육"] },
  ]},
  { id: "lecture", label: "인터넷 강의", icon: MonitorPlay, sites: [
    { name: "EBSi", url: "https://www.ebsi.co.kr", description: "무료 수능 강의 (전과목)", tags: ["무료", "수능"] },
    { name: "메가스터디", url: "https://www.megastudy.net", description: "국내 최대 수능 인강", tags: ["수능", "유료"] },
    { name: "대성마이맥", url: "https://www.mimacstudy.com", description: "대성학원 계열 온라인 인강", tags: ["수능", "유료"] },
    { name: "이투스", url: "https://www.etoos.com", description: "수능·내신 인강, 모의고사", tags: ["수능", "모의고사"] },
    { name: "스카이에듀", url: "https://www.skyedu.com", description: "하늘교육 온라인 강의", tags: ["수능", "유료"] },
  ]},
  { id: "consulting", label: "입시 컨설팅", icon: GraduationCap, sites: [
    { name: "진학사", url: "https://www.jinhak.com", description: "합격예측, 대학별 입시 분석", tags: ["합격예측", "배치표"] },
    { name: "유웨이", url: "https://www.uway.com", description: "성적 분석, 합격 예측 서비스", tags: ["합격예측", "성적분석"] },
    { name: "종로학원", url: "https://www.jongro.co.kr", description: "입시 분석, 배치표, 모의지원", tags: ["배치표", "모의지원"] },
    { name: "새이솔", url: "https://www.saeisol.com", description: "입시 리포트, 전형 분석", tags: ["리포트", "분석"] },
  ]},
  { id: "university", label: "주요 대학 입학처", icon: Building, sites: [
    { name: "서울대학교", url: "https://admission.snu.ac.kr", description: "서울대 입시 정보", tags: ["서울대"] },
    { name: "연세대학교", url: "https://admission.yonsei.ac.kr", description: "연세대 입시 정보", tags: ["연세대"] },
    { name: "고려대학교", url: "https://oku.korea.ac.kr", description: "고려대 입시 정보", tags: ["고려대"] },
    { name: "성균관대학교", url: "https://admission.skku.edu", description: "성균관대 입시 정보", tags: ["성균관대"] },
    { name: "한양대학교", url: "https://go.hanyang.ac.kr", description: "한양대 입시 정보", tags: ["한양대"] },
    { name: "중앙대학교", url: "https://admission.cau.ac.kr", description: "중앙대 입시 정보", tags: ["중앙대"] },
  ]},
];

export default function SitesPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = activeCat === "all" ? siteCategories : siteCategories.filter((c) => c.id === activeCat);
  const searched = searchQuery
    ? filtered.map((c) => ({ ...c, sites: c.sites.filter((s) => s.name.includes(searchQuery) || s.description.includes(searchQuery)) })).filter((c) => c.sites.length > 0)
    : filtered;

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-bold">입시정보</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
          <input type="text" placeholder="사이트 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-48" />
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border pb-2">
        <button onClick={() => setActiveCat("all")} className={`px-3 py-1 rounded text-[12px] font-medium ${activeCat === "all" ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>전체</button>
        {siteCategories.map((c) => (
          <button key={c.id} onClick={() => setActiveCat(c.id)}
            className={`px-3 py-1 rounded text-[12px] font-medium ${activeCat === c.id ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {searched.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center gap-1.5 mb-2">
            <cat.icon className="w-4 h-4 text-primary-600" />
            <h2 className="text-[13px] font-bold">{cat.label}</h2>
            <span className="text-[10px] text-muted-light">{cat.sites.length}개</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {cat.sites.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                className="bg-surface border border-border rounded-lg p-3 hover:border-primary-300 transition-colors group">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-[13px] font-semibold group-hover:text-primary-600 transition-colors">{s.name}</h3>
                  <ExternalLink className="w-3 h-3 text-muted-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-[11px] text-muted leading-relaxed mb-2">{s.description}</p>
                <div className="flex flex-wrap gap-1">
                  {s.tags.map((t) => <span key={t} className="px-1.5 py-0.5 bg-surface-secondary text-[9px] text-muted-light rounded">{t}</span>)}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
