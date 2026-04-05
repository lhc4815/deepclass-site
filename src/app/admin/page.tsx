"use client";

import {
  Settings,
  Newspaper,
  Play,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

const adminTabs = [
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "news", label: "뉴스 관리", icon: Newspaper },
  { id: "videos", label: "영상 관리", icon: Play },
  { id: "users", label: "회원 관리", icon: Users },
];

const mockStats = [
  {
    label: "총 회원수",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    iconBg: "bg-blue-500",
    period: "지난달 대비",
  },
  {
    label: "오늘 방문자",
    value: "567",
    change: "+8.2%",
    trend: "up",
    icon: Eye,
    iconBg: "bg-emerald-500",
    period: "어제 대비",
  },
  {
    label: "등록 뉴스",
    value: "89",
    change: "+5",
    trend: "up",
    icon: Newspaper,
    iconBg: "bg-violet-500",
    period: "이번 주",
  },
  {
    label: "등록 영상",
    value: "42",
    change: "-2",
    trend: "down",
    icon: Play,
    iconBg: "bg-amber-500",
    period: "이번 주",
  },
];

const mockNewsList = [
  {
    id: 1,
    title: "2027학년도 수시 주요 변경사항 총정리",
    status: "published",
    category: "수시",
    date: "2026.04.05",
    views: 3421,
    author: "관리자",
  },
  {
    id: 2,
    title: "수능 영어 절대평가 기조 유지... 변별력은?",
    status: "published",
    category: "정시",
    date: "2026.04.04",
    views: 2187,
    author: "관리자",
  },
  {
    id: 3,
    title: "주요대 논술전형 핵심 포인트 분석",
    status: "draft",
    category: "논술",
    date: "2026.04.04",
    views: 0,
    author: "관리자",
  },
  {
    id: 4,
    title: "의대 정원 확대에 따른 입시 변화",
    status: "published",
    category: "의대",
    date: "2026.04.03",
    views: 5234,
    author: "관리자",
  },
  {
    id: 5,
    title: "학생부종합전형 평가기준 변화 (검토중)",
    status: "review",
    category: "학종",
    date: "2026.04.03",
    views: 0,
    author: "에디터",
  },
];

const recentActivities = [
  { time: "09:30", action: "뉴스 등록", detail: "\"수시 변경사항\" 게시됨", type: "create" },
  { time: "09:15", action: "회원 가입", detail: "새 회원 3명 가입", type: "user" },
  { time: "08:45", action: "영상 등록", detail: "\"정시 전략\" 영상 추가", type: "create" },
  { time: "08:30", action: "뉴스 수정", detail: "\"논술 분석\" 초안 저장", type: "edit" },
  { time: "08:00", action: "댓글 신고", detail: "부적절 댓글 1건 접수", type: "alert" },
];

const activityTypeColors: Record<string, string> = {
  create: "bg-emerald-400",
  user: "bg-blue-400",
  edit: "bg-amber-400",
  alert: "bg-rose-400",
};

const statusConfig: Record<string, { label: string; class: string }> = {
  published: { label: "게시됨", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  draft: { label: "초안", class: "bg-amber-50 text-amber-600 border-amber-100" },
  review: { label: "검토중", class: "bg-blue-50 text-blue-600 border-blue-100" },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">관리자</h1>
          <p className="text-sm text-muted mt-0.5">콘텐츠와 사이트를 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-surface border border-border text-muted hover:bg-surface-hover transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            새로고침
          </button>
          <span className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-[11px] font-semibold rounded-lg border border-amber-200">
            관리자 모드
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-foreground text-white shadow-lg"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface rounded-2xl border border-border p-4 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg shadow-black/10`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-light mt-0.5">
                  {stat.label} · {stat.period}
                </p>
              </div>
            ))}
          </div>

          {/* Charts + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Traffic Chart placeholder */}
            <div className="lg:col-span-7 bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="text-sm font-semibold">방문자 추이</h3>
                  <p className="text-[11px] text-muted-light">최근 7일간 일별 방문자</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:bg-background transition-colors">
                  <Download className="w-3 h-3" />
                  내보내기
                </button>
              </div>
              <div className="p-5">
                {/* Simple bar chart visualization */}
                <div className="flex items-end gap-3 h-40 px-2">
                  {[65, 45, 78, 52, 90, 68, 82].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-muted-light">{Math.round(h * 6.3)}</span>
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-lg transition-all hover:from-primary-600 hover:to-primary-500"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] text-muted-light">
                        {["월", "화", "수", "목", "금", "토", "일"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-5 bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="text-sm font-semibold">최근 활동</h3>
                  <p className="text-[11px] text-muted-light">오늘</p>
                </div>
              </div>
              <div className="p-4 space-y-1">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-hover transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityTypeColors[act.type]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold">{act.action}</span>
                        <span className="text-[10px] text-muted-light">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-muted truncate">{act.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Management Tab */}
      {activeTab === "news" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
                <input
                  type="text"
                  placeholder="뉴스 검색..."
                  className="pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 w-56 transition-all"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface border border-border text-muted hover:bg-surface-hover transition-all">
                <Filter className="w-3.5 h-3.5" />
                필터
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20">
              <Plus className="w-4 h-4" />
              뉴스 추가
            </button>
          </div>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-light uppercase tracking-wider">제목</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-20">카테고리</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-20">상태</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-24">날짜</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-20">조회</th>
                  <th className="text-right p-4 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-24">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {mockNewsList.map((news) => {
                  const status = statusConfig[news.status];
                  return (
                    <tr key={news.id} className="hover:bg-surface-hover transition-colors group">
                      <td className="p-4">
                        <div>
                          <p className="text-[13px] font-medium group-hover:text-primary-600 transition-colors">{news.title}</p>
                          <p className="text-[10px] text-muted-light mt-0.5">작성: {news.author}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-medium text-muted">{news.category}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold border ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-muted">{news.date}</td>
                      <td className="p-4 text-[11px] text-muted font-medium">{news.views.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-0.5">
                          <button className="p-2 rounded-lg hover:bg-surface-secondary transition-colors text-muted-light hover:text-foreground">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-surface-secondary transition-colors text-muted-light hover:text-foreground">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-muted-light hover:text-rose-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Videos Management Tab */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">영상 목록</h2>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20">
              <Plus className="w-4 h-4" />
              영상 추가
            </button>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-surface-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-muted-light" />
            </div>
            <h3 className="font-semibold mb-1">YouTube API 연동 필요</h3>
            <p className="text-sm text-muted max-w-sm mx-auto">
              YouTube API 키를 설정하면 영상을 검색하고 관리할 수 있습니다.
            </p>
            <button className="mt-4 px-4 py-2 bg-surface-secondary rounded-xl text-xs font-medium text-muted hover:bg-background transition-colors">
              API 설정하기
            </button>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">회원 관리</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface border border-border text-muted hover:bg-surface-hover transition-all">
              <Download className="w-3.5 h-3.5" />
              회원 목록 내보내기
            </button>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-surface-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-light" />
            </div>
            <h3 className="font-semibold mb-1">로그인 시스템 연동 필요</h3>
            <p className="text-sm text-muted max-w-sm mx-auto">
              Supabase 인증을 설정하면 회원을 관리할 수 있습니다.
            </p>
            <button className="mt-4 px-4 py-2 bg-surface-secondary rounded-xl text-xs font-medium text-muted hover:bg-background transition-colors">
              인증 설정하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
