import {
  School,
  MapPin,
  Clock,
  Phone,
  BookOpen,
  Users,
  Star,
  ChevronRight,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const programs = [
  {
    title: "수시 종합반",
    description: "학생부교과/학종 대비 통합 프로그램",
    duration: "6개월",
    target: "고2 ~ 고3",
    features: ["생기부 관리", "자소서 첨삭", "면접 대비", "포트폴리오 구성"],
    color: "from-blue-500 to-blue-600",
    popular: true,
  },
  {
    title: "정시 올인원",
    description: "수능 전과목 집중 관리 프로그램",
    duration: "12개월",
    target: "고3, 재수생",
    features: ["전과목 강의", "주간 모의고사", "1:1 약점 분석", "성적 관리"],
    color: "from-emerald-500 to-emerald-600",
    popular: false,
  },
  {
    title: "논술 특강",
    description: "주요대 논술 유형별 집중 훈련",
    duration: "3개월",
    target: "고3",
    features: ["대학별 유형 분석", "실전 모의논술", "첨삭 지도", "기출 풀이"],
    color: "from-violet-500 to-purple-600",
    popular: false,
  },
  {
    title: "입시 컨설팅",
    description: "1:1 맞춤형 입시 전략 수립",
    duration: "상시",
    target: "고1 ~ 고3, 학부모",
    features: ["성적 분석", "지원 전략", "학과 추천", "로드맵 설계"],
    color: "from-amber-500 to-orange-600",
    popular: true,
  },
];

const instructors = [
  {
    name: "김입시",
    role: "수시전형 전문",
    experience: "15년",
    subject: "학종/교과",
    desc: "서울대 출신, 수시 합격자 500+명 배출",
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "이수능",
    role: "수능 국어 강사",
    experience: "12년",
    subject: "국어",
    desc: "매년 수능 국어 만점자 다수 배출",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    name: "박논술",
    role: "논술 전문 강사",
    experience: "10년",
    subject: "인문논술",
    desc: "연세대, 성균관대 논술 출제위원 경력",
    color: "from-violet-400 to-violet-500",
  },
  {
    name: "최컨설",
    role: "입시 컨설턴트",
    experience: "20년",
    subject: "진학상담",
    desc: "전 대학입학처 입학사정관 출신",
    color: "from-amber-400 to-amber-500",
  },
];

const achievements = [
  { label: "누적 합격생", value: "2,500+", suffix: "명" },
  { label: "SKY 합격률", value: "32", suffix: "%" },
  { label: "강사 경력", value: "15", suffix: "년+" },
  { label: "학부모 만족도", value: "98", suffix: "%" },
];

export default function AcademyPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-full text-xs font-medium backdrop-blur-sm">
              <Award className="w-3 h-3" />
              Since 2010
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">딥클래스 입시학원</h1>
          <p className="text-primary-200 text-sm max-w-xl leading-relaxed">
            체계적인 입시 전략과 개인 맞춤형 컨설팅으로 학생의 꿈을 실현합니다.
            수시·정시 전문 강사진과 함께 최적의 입시 로드맵을 설계하세요.
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-sm">
            <div className="flex items-center gap-2 text-primary-200">
              <MapPin className="w-4 h-4" />
              서울시 강남구 테헤란로 123
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <Phone className="w-4 h-4" />
              02-1234-5678
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <Clock className="w-4 h-4" />
              평일 09:00~22:00 / 토 09:00~18:00
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((a) => (
          <div key={a.label} className="bg-surface rounded-2xl border border-border p-5 text-center">
            <p className="text-3xl font-extrabold text-gradient">
              {a.value}<span className="text-lg">{a.suffix}</span>
            </p>
            <p className="text-xs text-muted mt-1 font-medium">{a.label}</p>
          </div>
        ))}
      </div>

      {/* Programs */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">프로그램 안내</h2>
            <p className="text-[11px] text-muted-light">목표에 맞는 프로그램을 선택하세요</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program) => (
            <div
              key={program.title}
              className="relative bg-surface rounded-2xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group cursor-pointer"
            >
              {program.popular && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] font-bold text-white rounded-full shadow-lg">
                  인기
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center shadow-lg shadow-black/10`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm group-hover:text-primary-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-[11px] text-muted">{program.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-light group-hover:text-primary-600 transition-colors" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-md border border-primary-100">
                  {program.duration}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md border border-emerald-100">
                  {program.target}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {program.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 px-2 py-0.5 bg-surface-secondary text-[11px] text-muted rounded-md"
                  >
                    <CheckCircle className="w-3 h-3 text-primary-400" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructors */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">전문 강사진</h2>
            <p className="text-[11px] text-muted-light">경력과 실력을 겸비한 입시 전문가</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="bg-surface rounded-2xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group"
            >
              <div className="text-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${inst.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-xl font-bold text-white">{inst.name[0]}</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-sm">{inst.name}</h3>
                <p className="text-[11px] text-primary-600 font-semibold mt-0.5">{inst.role}</p>
                <p className="text-[11px] text-muted mt-1.5 leading-relaxed">{inst.desc}</p>
                <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border-light">
                  <div className="text-center">
                    <p className="text-xs font-bold">{inst.experience}</p>
                    <p className="text-[9px] text-muted-light">경력</p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="text-center">
                    <p className="text-xs font-bold">{inst.subject}</p>
                    <p className="text-[9px] text-muted-light">담당</p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="text-center flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                    <p className="text-xs font-bold">4.9</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-50 to-violet-50 rounded-2xl border border-primary-100 p-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-100/30 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold">무료 입시 상담</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              입시 전문가와 1:1 상담을 통해 맞춤형 입시 전략을 수립하세요.
              학생의 현재 성적과 목표에 맞는 최적의 진학 경로를 안내합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20">
              <MessageCircle className="w-4 h-4" />
              상담 신청하기
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border text-foreground rounded-xl text-sm font-semibold hover:border-primary-300 transition-all">
              <Phone className="w-4 h-4" />
              전화 문의
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
