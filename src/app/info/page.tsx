"use client";

import { Play, Calendar, FileText, Eye, Clock, Loader2, Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getDday } from "@/lib/schedule-data";

interface YouTubeVideo { id: string; title: string; description: string; thumbnail: string; channelTitle: string; publishedAt: string; videoUrl: string; }
interface ScheduleItem { id: number; date: string; end_date: string | null; title: string; type: string; category: string; important: boolean; description: string | null; }

const tabs = [
  { id: "videos", label: "입시영상" },
  { id: "schedule", label: "입시일정" },
];

const videoCategories = [
  { id: "전체", label: "전체" }, { id: "수시전략", label: "수시전략" }, { id: "정시전략", label: "정시전략" },
  { id: "면접준비", label: "면접준비" }, { id: "논술", label: "논술" }, { id: "학습법", label: "학습법" },
];

const typeColors: Record<string, string> = {
  "수능": "text-rose-600", "원서접수": "text-emerald-600", "전형": "text-purple-600",
  "합격발표": "text-amber-600", "등록": "text-blue-600", "발표": "text-sky-600", "모집": "text-orange-600",
};

const catColors: Record<string, string> = { "공통": "bg-gray-100 text-gray-700", "수시": "bg-blue-100 text-blue-700", "정시": "bg-rose-100 text-rose-700" };

function videoTimeAgo(d: string): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days < 1) return "오늘"; if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`; return `${Math.floor(days / 30)}개월 전`;
}

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [activeCat, setActiveCat] = useState("전체");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const fetchVideos = useCallback(async (category: string, query?: string) => {
    setLoading(true); setError(null);
    try {
      let url = `/api/youtube?category=${encodeURIComponent(category)}&limit=12`;
      if (query) url += `&q=${encodeURIComponent(query + " 입시")}`;
      const res = await fetch(url); const data = await res.json();
      if (data.success) setVideos(data.data || []); else setError(data.error);
    } catch { setError("오류 발생"); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "videos") fetchVideos(activeCat);
    if (activeTab === "schedule" && scheduleData.length === 0) {
      setScheduleLoading(true);
      fetch("/api/schedules").then((r) => r.json()).then((d) => { if (d.success) setScheduleData(d.data); }).finally(() => setScheduleLoading(false));
    }
  }, [activeCat, activeTab, fetchVideos]);

  const handleSearch = () => { if (searchQuery.trim()) fetchVideos("전체", searchQuery); };

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <h1 className="text-[15px] font-bold">입시영상</h1>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
              activeTab === t.id ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-foreground"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Videos */}
      {activeTab === "videos" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {videoCategories.map((c) => (
                <button key={c.id} onClick={() => { setActiveCat(c.id); setSearchQuery(""); }}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium ${activeCat === c.id && !searchQuery ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <input type="text" placeholder="영상 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="px-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-40" />
              <button onClick={handleSearch} className="px-2.5 py-[5px] bg-primary-600 text-white rounded text-[11px] font-medium">검색</button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-8 text-[13px] text-rose-500">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {videos.map((v) => (
                <div key={v.id} onClick={() => setSelectedVideo(v)} className="bg-surface border border-border rounded-lg overflow-hidden cursor-pointer group hover:border-primary-300 transition-colors">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:brightness-90 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"><Play className="w-4 h-4 text-white ml-0.5" fill="white" /></div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[12px] font-medium line-clamp-2 leading-tight group-hover:text-primary-600">{v.title}</p>
                    <p className="text-[10px] text-muted-light mt-1">{v.channelTitle} · {videoTimeAgo(v.publishedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule */}
      {activeTab === "schedule" && (
        scheduleLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
        ) : (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-1.5 bg-surface-secondary border-b border-border flex items-center gap-3 text-[11px] text-muted-light">
              <span>2027학년도 대입 일정</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" />공통</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />수시</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />정시</span>
            </div>
            <table className="board-table">
              <thead>
                <tr>
                  <th className="w-20">날짜</th>
                  <th className="w-14">분류</th>
                  <th className="td-title">일정</th>
                  <th className="w-16">유형</th>
                  <th className="w-16">D-day</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((s) => {
                  const d = new Date(s.date);
                  const isPast = d < new Date();
                  const dday = getDday(s.date);
                  return (
                    <tr key={s.id} className={isPast ? "opacity-40" : ""}>
                      <td className="td-center text-[11px]">
                        {`${d.getMonth() + 1}/${d.getDate()}`}{s.end_date ? `~${new Date(s.end_date).getMonth() + 1}/${new Date(s.end_date).getDate()}` : ""}
                      </td>
                      <td className="td-center"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${catColors[s.category] || ""}`}>{s.category}</span></td>
                      <td className="td-title">
                        {s.important && <span className="text-rose-500 mr-1">●</span>}
                        {s.title}
                        {s.description && <span className="text-[11px] text-muted-light ml-1">({s.description})</span>}
                      </td>
                      <td className="td-center"><span className={`text-[11px] font-semibold ${typeColors[s.type] || "text-gray-600"}`}>{s.type}</span></td>
                      <td className="td-center">{!isPast && <span className="text-[11px] font-bold text-primary-600">{dday}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative w-full max-w-3xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedVideo(null)} className="absolute -top-8 right-0 text-white/80 hover:text-white text-sm">닫기 ✕</button>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`} title={selectedVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
            <div className="mt-2 bg-surface rounded-lg border border-border p-3">
              <h3 className="text-[13px] font-semibold">{selectedVideo.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[11px] text-muted">{selectedVideo.channelTitle}</p>
                <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-red-500 hover:underline flex items-center gap-0.5">
                  <Play className="w-3 h-3" />YouTube에서 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
