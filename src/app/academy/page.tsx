"use client";

import {
  School,
  MapPin,
  ExternalLink,
  Star,
  BookOpen,
  Users,
  Search,
  MonitorPlay,
  Building,
  GraduationCap,
  Phone,
} from "lucide-react";
import { useState } from "react";

interface Academy {
  name: string;
  url: string;
  description: string;
  location: string;
  specialties: string[];
  type: string;
  rating?: number;
}

interface AcademyCategory {
  id: string;
  label: string;
  icon: typeof School;
  color: string;
  academies: Academy[];
}

const academyCategories: AcademyCategory[] = [
  {
    id: "major",
    label: "대형 입시학원",
    icon: Building,
    color: "from-blue-500 to-blue-600",
    academies: [
      { name: "대성학원", url: "https://www.daesung.com", description: "재수종합반 명문, 전국 단위 대형 입시학원", location: "대치동 본원 외 전국", specialties: ["재수종합반", "수능", "정시"], type: "종합", rating: 4.5 },
      { name: "종로학원", url: "https://www.jongro.co.kr", description: "70년 전통의 입시 명문, 재수·수능 전문", location: "종로 본원 외 전국", specialties: ["재수종합반", "수능", "입시분석"], type: "종합", rating: 4.4 },
      { name: "이투스247", url: "https://www.etoos247.com", description: "이투스 재수종합반, 체계적 관리형 학원", location: "노량진·강남 외 전국", specialties: ["재수종합반", "관리형", "수능"], type: "종합", rating: 4.3 },
      { name: "메가스터디학원", url: "https://academy.megastudy.net", description: "메가스터디 오프라인 학원, 재수·수능 전문", location: "강남·목동 외 전국", specialties: ["재수종합반", "수능", "단과"], type: "종합", rating: 4.3 },
      { name: "비상에듀학원", url: "https://www.visangedu.com", description: "비상교육 계열 입시학원", location: "대치동 외", specialties: ["수능", "내신", "종합반"], type: "종합", rating: 4.2 },
    ],
  },
  {
    id: "daechi",
    label: "대치동 유명학원",
    icon: Star,
    color: "from-amber-500 to-orange-600",
    academies: [
      { name: "시대인재", url: "https://www.sdij.co.kr", description: "대치동 대표 입시학원, 수능·수시 전문", location: "대치동", specialties: ["수능", "수시", "논술", "면접"], type: "입시전문", rating: 4.6 },
      { name: "유웨이학원", url: "https://www.uway.com", description: "입시 컨설팅 전문, 수시·정시 전략 수립", location: "대치동", specialties: ["입시컨설팅", "수시", "정시"], type: "컨설팅", rating: 4.4 },
      { name: "강남대성학원", url: "https://www.gnds.co.kr", description: "강남 대성학원, 재수종합반", location: "대치동", specialties: ["재수종합반", "수능", "정시"], type: "종합", rating: 4.5 },
      { name: "청솔학원", url: "https://www.chungsol.co.kr", description: "재수·반수 전문, 강남권 대표 학원", location: "대치동·강남", specialties: ["재수", "반수", "수능"], type: "재수전문", rating: 4.3 },
    ],
  },
  {
    id: "online",
    label: "온라인 인강",
    icon: MonitorPlay,
    color: "from-violet-500 to-purple-600",
    academies: [
      { name: "메가스터디", url: "https://www.megastudy.net", description: "국내 최대 온라인 수능 인강 플랫폼", location: "온라인", specialties: ["수능", "내신", "전과목"], type: "인강", rating: 4.5 },
      { name: "대성마이맥", url: "https://www.mimacstudy.com", description: "대성학원 계열 온라인 인강", location: "온라인", specialties: ["수능", "내신", "전과목"], type: "인강", rating: 4.4 },
      { name: "이투스", url: "https://www.etoos.com", description: "수능·내신 인강, 모의고사 서비스", location: "온라인", specialties: ["수능", "내신", "모의고사"], type: "인강", rating: 4.3 },
      { name: "EBSi", url: "https://www.ebsi.co.kr", description: "교육부 운영 무료 수능 강의", location: "온라인", specialties: ["수능", "무료", "전과목"], type: "무료인강", rating: 4.6 },
      { name: "스카이에듀", url: "https://www.skyedu.com", description: "하늘교육 온라인 수능 인강", location: "온라인", specialties: ["수능", "내신"], type: "인강", rating: 4.2 },
    ],
  },
  {
    id: "consulting",
    label: "입시 컨설팅",
    icon: GraduationCap,
    color: "from-emerald-500 to-emerald-600",
    academies: [
      { name: "진학사", url: "https://www.jinhak.com", description: "대한민국 대표 입시 정보·컨설팅 기업", location: "온라인·오프라인", specialties: ["합격예측", "배치표", "컨설팅"], type: "컨설팅", rating: 4.5 },
      { name: "유웨이", url: "https://www.uway.com", description: "입시 정보, 성적 분석, 합격 예측", location: "온라인·오프라인", specialties: ["합격예측", "성적분석", "전형"], type: "컨설팅", rating: 4.4 },
      { name: "새이솔", url: "https://www.saeisol.com", description: "입시 리포트, 전형 분석 전문", location: "온라인", specialties: ["입시리포트", "전형분석", "데이터"], type: "분석", rating: 4.3 },
      { name: "하이스트", url: "https://www.hiest.co.kr", description: "1:1 맞춤 입시 컨설팅, 학종 전문", location: "강남·대치", specialties: ["학종", "자소서", "면접"], type: "컨설팅", rating: 4.4 },
    ],
  },
  {
    id: "subject",
    label: "과목별 전문학원",
    icon: BookOpen,
    color: "from-rose-500 to-pink-600",
    academies: [
      { name: "현우진 수학 (메가)", url: "https://www.megastudy.net", description: "수능 수학 대표 강사, 메가스터디 소속", location: "온라인", specialties: ["수학", "수능"], type: "과목전문" },
      { name: "박광일 영어 (메가)", url: "https://www.megastudy.net", description: "수능 영어 강사, 체계적 독해 강의", location: "온라인", specialties: ["영어", "수능"], type: "과목전문" },
      { name: "최서희 국어 (대성)", url: "https://www.mimacstudy.com", description: "수능 국어 강사, 문학·비문학 전문", location: "온라인", specialties: ["국어", "수능"], type: "과목전문" },
      { name: "CMS에듀", url: "https://www.cmsedu.co.kr", description: "수학 사고력 전문 학원 프랜차이즈", location: "전국", specialties: ["수학", "사고력", "영재"], type: "과목전문", rating: 4.3 },
    ],
  },
];

export default function AcademyPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = activeCategory === "all"
    ? academyCategories
    : academyCategories.filter((c) => c.id === activeCategory);

  const searchFiltered = searchQuery
    ? filtered.map((c) => ({
        ...c,
        academies: c.academies.filter(
          (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.includes(searchQuery) ||
            a.specialties.some((s) => s.includes(searchQuery))
        ),
      })).filter((c) => c.academies.length > 0)
    : filtered;

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">학원정보</h1>
          <p className="text-sm text-muted mt-0.5">입시 학원·인강·컨설팅 정보를 모았습니다</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
          <input
            type="text"
            placeholder="학원 검색..."
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
        {academyCategories.map((cat) => (
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

      {/* Academy Cards */}
      {searchFiltered.map((cat) => (
        <div key={cat.id} className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center shadow-sm`}>
              <cat.icon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold">{cat.label}</h2>
            <span className="text-[11px] text-muted-light">{cat.academies.length}개</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.academies.map((academy) => (
              <a
                key={academy.name + academy.url}
                href={academy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface rounded-2xl border border-border p-4 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[13px] font-semibold group-hover:text-primary-600 transition-colors">{academy.name}</h3>
                    <span className="text-[10px] text-muted-light">{academy.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {academy.rating && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                        <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                        {academy.rating}
                      </span>
                    )}
                    <ExternalLink className="w-3.5 h-3.5 text-muted-light opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-[11px] text-muted leading-relaxed mb-2.5">{academy.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-light mb-2">
                  <MapPin className="w-3 h-3" />{academy.location}
                </div>
                <div className="flex flex-wrap gap-1">
                  {academy.specialties.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-surface-secondary text-[9px] font-medium text-muted-light rounded">{s}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {searchFiltered.length === 0 && (
        <div className="text-center py-16">
          <School className="w-12 h-12 text-muted-light mx-auto mb-3" />
          <p className="text-sm text-muted">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
