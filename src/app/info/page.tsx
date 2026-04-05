"use client";

import {
  Play,
  Calendar,
  FileText,
  Eye,
  Clock,
  ChevronRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const tabs = [
  { id: "videos", label: "영상", icon: Play },
  { id: "schedule", label: "입시일정", icon: Calendar },
  { id: "resources", label: "자료실", icon: FileText },
];

const videoCategories = [
  { id: "전체", label: "전체" },
  { id: "수시전략", label: "수시전략" },
  { id: "정시전략", label: "정시전략" },
  { id: "면접준비", label: "면접준비" },
  { id: "논술", label: "논술" },
  { id: "학습법", label: "학습법" },
  { id: "대학탐방", label: "대학탐방" },
];

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
}

const mockSchedule = [
  { date: "2026.04.15", title: "2027학년도 대입전형 시행계획 발표", type: "발표", important: true },
  { date: "2026.05.01", title: "수시 원서접수 시작 (일부 대학)", type: "접수", important: false },
  { date: "2026.05.15", title: "대학별 수시 모집요강 발표", type: "발표", important: true },
  { date: "2026.06.01", title: "대학별 모의논술 일정 공개", type: "논술", important: false },
  { date: "2026.06.15", title: "6월 수능 모의평가", type: "수능", important: true },
  { date: "2026.09.01", title: "수시 원서접수 시작", type: "접수", important: true },
  { date: "2026.09.15", title: "수시 원서접수 마감", type: "접수", important: true },
  { date: "2026.09.20", title: "9월 수능 모의평가", type: "수능", important: true },
  { date: "2026.11.01", title: "논술시험 시작 (주요 대학)", type: "논술", important: false },
  { date: "2026.11.20", title: "대학수학능��시험", type: "수능", important: true },
  { date: "2026.12.09", title: "수능 성적 통지", type: "수능", important: true },
  { date: "2026.12.30", title: "정시 원서접수 시작", type: "접수", important: true },
];

const typeColors: Record<string, string> = {
  "발표": "bg-blue-50 text-blue-600 border-blue-100",
  "접수": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "논술": "bg-purple-50 text-purple-600 border-purple-100",
  "수능": "bg-rose-50 text-rose-600 border-rose-100",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [activeVideoCategory, setActiveVideoCategory] = useState("전체");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const fetchVideos = useCallback(async (category: string, query?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/youtube?category=${encodeURIComponent(category)}&limit=12`;
      if (query) url += `&q=${encodeURIComponent(query + " 입시")}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setVideos(data.data || []);
      } else {
        setError(data.error || "영상을 불러오지 못했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "videos") {
      fetchVideos(activeVideoCategory);
    }
  }, [activeVideoCategory, activeTab, fetchVideos]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchVideos("전체", searchQuery);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold">입시정보</h1>
        <p className="text-sm text-muted mt-0.5">
          입시 관련 영상, 일���, 자료를 확인하세요
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Videos Tab */}
      {activeTab === "videos" && (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {videoCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveVideoCategory(cat.id); setSearchQuery(""); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    activeVideoCategory === cat.id && !searchQuery
                      ? "bg-foreground text-white"
                      : "bg-surface border border-border text-muted hover:border-primary-200 hover:text-primary-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
                <input
                  type="text"
                  placeholder="영상 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 w-48 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-primary-600 text-white rounded-xl text-xs font-medium hover:bg-primary-700 transition-colors"
              >
                검색
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                <p className="text-sm text-muted">영상을 불러오는 중...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-rose-600">{error}</p>
              <button
                onClick={() => fetchVideos(activeVideoCategory)}
                className="mt-3 px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-medium hover:bg-rose-200 transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* Video Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="bg-surface rounded-2xl border border-border overflow-hidden group cursor-pointer hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-300 backdrop-blur-sm">
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-muted truncate">
                            {video.channelTitle}
                          </p>
                          <p className="text-[10px] text-muted-light">
                            {timeAgo(video.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {videos.length === 0 && (
                <div className="text-center py-16">
                  <Play className="w-12 h-12 text-muted-light mx-auto mb-3" />
                  <p className="text-sm text-muted">검색 결과가 없습니다.</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-border-light">
            {mockSchedule.map((item, i) => {
              const parts = item.date.split(".");
              return (
                <div
                  key={i}
                  className={`flex items-center gap-5 px-5 py-4 hover:bg-surface-hover transition-all duration-200 cursor-pointer group ${
                    item.important ? "" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${
                    item.important
                      ? "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-100"
                      : "bg-surface-secondary border-border"
                  }`}>
                    <span className={`text-[10px] font-bold leading-none ${item.important ? "text-primary-400" : "text-muted-light"}`}>
                      {parts[1]}월
                    </span>
                    <span className={`text-lg font-extrabold leading-tight ${item.important ? "text-primary-700" : "text-muted"}`}>
                      {parts[2]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {item.important && (
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                      )}
                      <h3 className="text-[13px] font-semibold truncate group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-muted-light">{item.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border flex-shrink-0 ${typeColors[item.type] || ""}`}>
                    {item.type}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-light opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <div className="w-20 h-20 bg-surface-secondary rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FileText className="w-10 h-10 text-muted-light" />
          </div>
          <h3 className="text-lg font-semibold mb-2">자료실 준비 중</h3>
          <p className="text-sm text-muted max-w-sm mx-auto">
            입시 관련 유용한 자료가 곧 업로드됩니다.<br />
            모의고사, 기출문제, 합격 사례 등을 제공할 예정입니다.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary rounded-xl text-xs font-medium text-muted">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-4xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
            >
              닫기 <X className="w-4 h-4" />
            </button>

            {/* Player */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Info */}
            <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
              <h3 className="text-base font-semibold leading-snug">
                {selectedVideo.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{selectedVideo.channelTitle}</p>
                  <p className="text-xs text-muted-light">{timeAgo(selectedVideo.publishedAt)}</p>
                </div>
                <a
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  <Play className="w-3 h-3" fill="white" />
                  YouTube에서 보기
                </a>
              </div>
              {selectedVideo.description && (
                <p className="text-xs text-muted mt-3 leading-relaxed">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
