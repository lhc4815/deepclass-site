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
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ScheduleItem {
  id: number; date: string; end_date: string | null; title: string;
  type: string; category: string; important: boolean; description: string | null;
}

const adminTabs = [
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "schedule", label: "일정 관리", icon: Calendar },
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
      {activeTab === "videos" && <VideoManager />}

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

      {/* Schedule Management Tab */}
      {activeTab === "schedule" && <ScheduleManager />}
    </div>
  );
}

/* ── 일정 관리 컴포넌트 ── */
const TYPES = ["수능", "원서접수", "전형", "합격발표", "등록", "발표", "모집", "기타"];
const CATEGORIES = ["공통", "수시", "정시"];

/* ── 영상 수집 관리 ── */
function VideoManager() {
  const [collecting, setCollecting] = useState(false);
  const [rssCollecting, setRssCollecting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = () => {
    setLoading(true);
    fetch("/api/youtube?limit=20")
      .then((r) => r.json())
      .then((d) => { if (d.success) setVideos(d.data || []); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVideos(); }, []);

  const collectAPI = async () => {
    setCollecting(true); setResult(null);
    const res = await fetch("/api/youtube/collect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const data = await res.json();
    setResult(data.message || data.error);
    setCollecting(false);
    fetchVideos();
  };

  const collectRSS = async () => {
    setRssCollecting(true); setResult(null);
    const res = await fetch("/api/youtube/rss", { method: "POST" });
    const data = await res.json();
    setResult(data.message || data.error);
    setRssCollecting(false);
    fetchVideos();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">영상 관리 ({videos.length}개)</h2>
        <div className="flex gap-2">
          <button onClick={collectRSS} disabled={rssCollecting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${rssCollecting ? "animate-spin" : ""}`} />
            전체 수집 (7개 카테고리)
          </button>
          <button onClick={collectAPI} disabled={collecting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-all">
            <Plus className={`w-3.5 h-3.5 ${collecting ? "animate-spin" : ""}`} />
            커스텀 검색 수집
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-surface-secondary border border-border rounded-lg px-4 py-2 text-[12px]">{result}</div>
      )}

      <div className="bg-surface border border-border rounded-lg p-3 text-[11px] text-muted space-y-1">
        <p><b>전체 수집</b>: 7개 카테고리 x 10개 = 약 70개 영상 수집 (하루 1회 권장, 할당량 700 사용)</p>
        <p><b>커스텀 검색</b>: 원하는 검색어로 추가 수집 (1회 100 유닛, 필요시만 사용)</p>
        <p>* 하루 총 10,000 유닛. 전체 수집 1회 = 700 유닛. 하루 14회까지 가능.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : videos.length > 0 ? (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="board-table">
            <thead>
              <tr>
                <th className="w-24">썸네일</th>
                <th className="td-title">제목</th>
                <th className="w-20">채널</th>
                <th className="w-16">카테고리</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v: any) => (
                <tr key={v.id}>
                  <td className="td-center"><img src={v.thumbnail} alt="" className="w-20 h-12 object-cover rounded" /></td>
                  <td className="td-title">
                    <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline text-[12px]">{v.title}</a>
                  </td>
                  <td className="td-center text-[11px] text-muted">{v.channelTitle}</td>
                  <td className="td-center text-[11px] text-muted">{v.category || "전체"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-surface border border-border rounded-lg">
          <Play className="w-8 h-8 text-muted-light mx-auto mb-2" />
          <p className="text-[13px] text-muted mb-2">아직 수집된 영상이 없습니다.</p>
          <p className="text-[11px] text-muted-light">위의 "RSS 수집" 버튼을 눌러 영상을 수집하세요.</p>
        </div>
      )}
    </div>
  );
}

function ScheduleManager() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", end_date: "", title: "", type: "기타", category: "공통", important: false, description: "" });
  const [saving, setSaving] = useState(false);

  const fetchSchedules = () => {
    setLoading(true);
    fetch("/api/schedules")
      .then((r) => r.json())
      .then((d) => { if (d.success) setItems(d.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleAdd = async () => {
    if (!form.date || !form.title) return;
    setSaving(true);
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, end_date: form.end_date || null, description: form.description || null }),
    });
    const data = await res.json();
    if (data.success) {
      setShowForm(false);
      setForm({ date: "", end_date: "", title: "", type: "기타", category: "공통", important: false, description: "" });
      fetchSchedules();
    } else {
      alert(data.error || "저장 실패");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch("/api/schedules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) fetchSchedules();
    else alert(data.error || "삭제 실패");
  };

  const typeColors: Record<string, string> = {
    "수능": "bg-rose-50 text-rose-600", "원서접수": "bg-emerald-50 text-emerald-600",
    "전형": "bg-purple-50 text-purple-600", "합격발표": "bg-amber-50 text-amber-600",
    "등록": "bg-blue-50 text-blue-600", "발표": "bg-sky-50 text-sky-600",
    "모집": "bg-orange-50 text-orange-600", "기타": "bg-gray-50 text-gray-600",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">입시 일정 ({items.length}개)</h2>
        <div className="flex gap-2">
          <button onClick={fetchSchedules} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface border border-border text-muted hover:bg-surface-hover transition-all">
            <RefreshCw className="w-3.5 h-3.5" />새로고침
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20">
            <Plus className="w-4 h-4" />일정 추가
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold">새 일정 추가</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-muted mb-1 block">시작일 *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted mb-1 block">종료일</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted mb-1 block">제목 *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="일정 제목" className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-muted mb-1 block">유형</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted mb-1 block">분류</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.important} onChange={(e) => setForm({ ...form, important: e.target.checked })} className="rounded" />
                중요 일정
              </label>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted mb-1 block">설명 (선택)</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="추가 설명" className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface-secondary border border-border rounded-xl text-xs font-medium text-muted">취소</button>
            <button onClick={handleAdd} disabled={saving || !form.date || !form.title} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-medium hover:bg-primary-700 disabled:opacity-50">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left p-3 text-[11px] font-semibold text-muted-light uppercase tracking-wider">날짜</th>
                <th className="text-left p-3 text-[11px] font-semibold text-muted-light uppercase tracking-wider">제목</th>
                <th className="text-left p-3 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-20">유형</th>
                <th className="text-left p-3 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-16">분류</th>
                <th className="text-right p-3 text-[11px] font-semibold text-muted-light uppercase tracking-wider w-16">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-hover transition-colors">
                  <td className="p-3 text-[12px] text-muted whitespace-nowrap">
                    {item.date}{item.end_date ? ` ~ ${item.end_date}` : ""}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {item.important && <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />}
                      <span className="text-[13px] font-medium">{item.title}</span>
                    </div>
                    {item.description && <p className="text-[10px] text-muted-light mt-0.5">{item.description}</p>}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${typeColors[item.type] || typeColors["기타"]}`}>{item.type}</span>
                  </td>
                  <td className="p-3 text-[11px] text-muted">{item.category}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-muted-light hover:text-rose-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
