"use client";

import {
  Globe,
  ExternalLink,
  Building,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Landmark,
  MonitorPlay,
  School,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";

interface SiteItem {
  name: string;
  url: string;
  description: string;
  tags: string[];
}

interface SiteCategory {
  id: string;
  label: string;
  icon: typeof Globe;
  color: string;
  sites: SiteItem[];
}

const siteCategories: SiteCategory[] = [
  {
    id: "public",
    label: "공공·공식",
    icon: Landmark,
    color: "from-blue-500 to-blue-600",
    sites: [
      { name: "대입정보포털 (어디가)", url: "https://www.adiga.kr", description: "한국대학교육협의회 운영, 대입 전형/성적/합격예측 공식 정보", tags: ["공식", "합격예측", "전형정보"] },
      { name: "EBSi", url: "https://www.ebsi.co.kr", description: "EBS 수능 강의, 교재, 모의고사, 대입정보 제공", tags: ["수능", "무료강의", "모의고사"] },
      { name: "한국교육과정평가원", url: "https://www.kice.re.kr", description: "수능 출제기관, 기출문제, 성적 관련 공식 정보", tags: ["수능", "기출", "공식"] },
      { name: "대학알리미", url: "https://www.academyinfo.go.kr", description: "대학 정보 공시 사이트, 취업률·등록금·장학금 비교", tags: ["대학정보", "취업률", "등록금"] },
      { name: "워크넷 진로정보", url: "https://www.work.go.kr/consltJobCarpa/srch/jobInfoSrch/srchJobInfo.do", description: "직업정보, 진로탐색, 학과-직업 연계 정보", tags: ["진로", "직업", "학과"] },
      { name: "커리어넷", url: "https://www.career.go.kr", description: "교육부 운영 진로정보망, 적성검사, 학과정보", tags: ["적성검사", "진로", "학과정보"] },
    ],
  },
  {
    id: "community",
    label: "입시 커뮤니티",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-600",
    sites: [
      { name: "오르비", url: "https://orbi.kr", description: "대한민국 대표 입시 커뮤니티, 수능/내신/입시 정보 교류", tags: ["커뮤니티", "수능", "입시정보"] },
      { name: "수만휘 (수능 만점자 모임)", url: "https://www.sumanwhi.com", description: "수능 커뮤니티, 성적 분석, 배치표, 입시 상담", tags: ["수능", "배치표", "커뮤니티"] },
      { name: "네이버 카페 수만휘", url: "https://cafe.naver.com/suhui", description: "수능 관련 네이버 대표 카페", tags: ["카페", "수능", "정보교류"] },
      { name: "네이버 카페 대치동 학부모", url: "https://cafe.naver.com/daechidong1", description: "대치동 학부모 커뮤니티, 학원/입시 정보 공유", tags: ["학부모", "대치동", "학원정보"] },
      { name: "맘스홀릭", url: "https://cafe.naver.com/momsholick", description: "학부모 대표 카페, 입시·교육 정보 공유", tags: ["학부모", "교육", "카페"] },
    ],
  },
  {
    id: "media",
    label: "입시 전문 매체",
    icon: BookOpen,
    color: "from-emerald-500 to-emerald-600",
    sites: [
      { name: "베리타스알파", url: "https://www.veritas-a.com", description: "대입 전문 뉴스 매체, 입시 분석 기사", tags: ["뉴스", "입시분석", "전문매체"] },
      { name: "조선에듀", url: "https://edu.chosun.com", description: "조선일보 교육 섹션, 입시 뉴스·칼럼", tags: ["뉴스", "칼럼", "교육"] },
      { name: "한국대학신문", url: "https://news.unn.net", description: "대학·입시 전문 뉴스", tags: ["뉴스", "대학", "전문매체"] },
      { name: "대학저널", url: "https://www.dhnews.co.kr", description: "대학·입시 뉴스, 대학 랭킹 정보", tags: ["뉴스", "랭킹", "대학"] },
      { name: "에듀동아", url: "https://edu.donga.com", description: "동아일보 교육 섹션, 입시·교육 뉴스", tags: ["뉴스", "교육", "동아일보"] },
    ],
  },
  {
    id: "lecture",
    label: "인터넷 강의",
    icon: MonitorPlay,
    color: "from-rose-500 to-pink-600",
    sites: [
      { name: "EBSi", url: "https://www.ebsi.co.kr", description: "무료 수능 강의 (국어·수학·영어·탐구)", tags: ["무료", "수능", "전과목"] },
      { name: "메가스터디", url: "https://www.megastudy.net", description: "대한민국 대표 인강, 수능·내신 강의", tags: ["수능", "내신", "유료"] },
      { name: "대성마이맥", url: "https://www.mimacstudy.com", description: "대성학원 온라인 강의, 수능 전과목", tags: ["수능", "내신", "유료"] },
      { name: "이투스", url: "https://www.etoos.com", description: "수능·내신 인강, 모의고사 서비스", tags: ["수능", "모의고사", "유료"] },
      { name: "스카이에듀", url: "https://www.skyedu.com", description: "하늘교육 온라인 강의", tags: ["수능", "내신", "유료"] },
    ],
  },
  {
    id: "consulting",
    label: "입시 컨설팅·연구소",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-600",
    sites: [
      { name: "진학사", url: "https://www.jinhak.com", description: "입시 정보, 합격예측, 대학별 입시 분석", tags: ["합격예측", "입시분석", "배치표"] },
      { name: "유웨이", url: "https://www.uway.com", description: "입시 정보, 성적 분석, 합격 예측 서비스", tags: ["합격예측", "성적분석", "전형"] },
      { name: "종로학원", url: "https://www.jongro.co.kr", description: "입시 분석 자료, 배치표, 모의지원", tags: ["배치표", "모의지원", "입시분석"] },
      { name: "이투스247", url: "https://www.etoos247.com", description: "입시 컨설팅, 재수종합반 정보", tags: ["컨설팅", "재수", "종합반"] },
      { name: "새이솔", url: "https://www.saeisol.com", description: "입시 리포트, 전형 분석, 대입 일정", tags: ["리포트", "전형분석", "일정"] },
    ],
  },
  {
    id: "university",
    label: "주요 대학 입학처",
    icon: Building,
    color: "from-indigo-500 to-indigo-600",
    sites: [
      { name: "서울대학교 입학본부", url: "https://admission.snu.ac.kr", description: "서울대 입시 정보, 전형 안내", tags: ["서울대", "입학처"] },
      { name: "연세대학교 입학처", url: "https://admission.yonsei.ac.kr", description: "연세대 입시 정보, 전형 안내", tags: ["연세대", "입학처"] },
      { name: "고려대학교 입학처", url: "https://admission.korea.ac.kr", description: "고려대 입시 정보, 전형 안내", tags: ["고려대", "입학처"] },
      { name: "성균관대학교 입학처", url: "https://admission.skku.edu", description: "성균관대 입시 정보, 전형 안내", tags: ["성균관대", "입학처"] },
      { name: "한양대학교 입학처", url: "https://admission.hanyang.ac.kr", description: "한양대 입시 정보, 전형 안내", tags: ["한양대", "입학처"] },
      { name: "중앙대학교 입학처", url: "https://admission.cau.ac.kr", description: "중앙대 입시 정보, 전형 안내", tags: ["중앙대", "입학처"] },
    ],
  },
];

const allTags = Array.from(new Set(siteCategories.flatMap((c) => c.sites.flatMap((s) => s.tags))));

export default function SitesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = activeCategory === "all"
    ? siteCategories
    : siteCategories.filter((c) => c.id === activeCategory);

  const searchFiltered = searchQuery
    ? filteredCategories.map((c) => ({
        ...c,
        sites: c.sites.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tags.some((t) => t.includes(searchQuery.toLowerCase()))
        ),
      })).filter((c) => c.sites.length > 0)
    : filteredCategories;

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">입시사이트</h1>
          <p className="text-sm text-muted mt-0.5">입시에 유용한 사이트를 한 곳에 모았습니다</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
          <input
            type="text"
            placeholder="사이트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 w-56 transition-all"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
            activeCategory === "all" ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "bg-surface border border-border text-muted hover:border-primary-200"
          }`}
        >
          전체
        </button>
        {siteCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.id ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "bg-surface border border-border text-muted hover:border-primary-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Site Cards */}
      {searchFiltered.map((cat) => (
        <div key={cat.id} className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center shadow-sm`}>
              <cat.icon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold">{cat.label}</h2>
            <span className="text-[11px] text-muted-light">{cat.sites.length}개</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.sites.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface rounded-2xl border border-border p-4 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[13px] font-semibold group-hover:text-primary-600 transition-colors">{site.name}</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-[11px] text-muted leading-relaxed mb-3">{site.description}</p>
                <div className="flex flex-wrap gap-1">
                  {site.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-surface-secondary text-[9px] font-medium text-muted-light rounded">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {searchFiltered.length === 0 && (
        <div className="text-center py-16">
          <Globe className="w-12 h-12 text-muted-light mx-auto mb-3" />
          <p className="text-sm text-muted">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
