"use client";

import {
  Newspaper, BookOpen, MessageCircle, MessageSquare, School,
  Play, Clock, Eye, Flame, ArrowRight, ExternalLink, Loader2, ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/news-sources";
import { getDday } from "@/lib/schedule-data";

interface YouTubeVideo {
  id: string; title: string; thumbnail: string; channelTitle: string; publishedAt: string; videoUrl: string;
}
interface ScheduleRow {
  id: number; date: string; title: string; type: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

const categoryColors: Record<string, string> = {
  "수시": "text-blue-600", "정시": "text-rose-600", "논술": "text-purple-600",
  "학종": "text-teal-600", "내신": "text-amber-600", "의대": "text-emerald-600",
};

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [schedules, setSchedules] = useState<{ month: string; day: string; title: string; type: string; dday: string }[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    fetch("/api/news/naver?category=%EC%A0%84%EC%B2%B4&limit=8")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNews(d.data || []); })
      .catch(() => {}).finally(() => setNewsLoading(false));

    fetch("/api/youtube?category=%EC%A0%84%EC%B2%B4&limit=4")
      .then((r) => r.json())
      .then((d) => { if (d.success) setVideos(d.data || []); })
      .catch(() => {}).finally(() => setVideosLoading(false));

    fetch("/api/schedules?upcoming=true&limit=5")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSchedules(d.data.map((s: ScheduleRow) => {
          const dd = new Date(s.date);
          return { month: String(dd.getMonth() + 1), day: String(dd.getDate()).padStart(2, "0"), title: s.title, type: s.type, dday: getDday(s.date) };
        }));
      }).catch(() => {});
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-4 animate-fade-in">
      {/* 상단 배너 */}
      <div className="bg-primary-600 rounded-lg p-5 text-white">
        <h1 className="text-lg font-bold">딥클래스 - 입시정보 종합 허브</h1>
        <p className="text-primary-200 text-[13px] mt-1">입시의 모든 정보를 한 곳에서. 뉴스, 영상, AI 상담, 커뮤니티까지.</p>
        <div className="flex gap-2 mt-3">
          <Link href="/news" className="px-3 py-1.5 bg-white text-primary-700 rounded text-[12px] font-semibold hover:bg-primary-50 transition-colors">뉴스 보기</Link>
          <Link href="/chat" className="px-3 py-1.5 bg-primary-500 text-white rounded text-[12px] font-semibold hover:bg-primary-400 transition-colors border border-primary-400">AI 상담</Link>
        </div>
      </div>

      {/* 메인 2단 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 좌측: 뉴스 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 최신뉴스 */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-secondary">
              <h2 className="text-[13px] font-bold flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-primary-600" />최신 입시뉴스
              </h2>
              <Link href="/news" className="text-[11px] text-primary-600 hover:underline flex items-center gap-0.5">더보기<ArrowRight className="w-3 h-3" /></Link>
            </div>
            {newsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
            ) : (
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="w-16">분류</th>
                    <th className="td-title">제목</th>
                    <th className="w-20">매체</th>
                    <th className="w-20">시간</th>
                  </tr>
                </thead>
                <tbody>
                  {news.slice(0, 8).map((item) => (
                    <tr key={item.id}>
                      <td className="td-center">
                        <span className={`text-[11px] font-semibold ${categoryColors[item.category] || "text-gray-600"}`}>{item.category}</span>
                      </td>
                      <td className="td-title">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline transition-colors line-clamp-1">
                          {item.title}
                        </a>
                      </td>
                      <td className="td-center text-[11px] text-muted-light">{item.source}</td>
                      <td className="td-center text-[11px] text-muted-light">{timeAgo(item.pubDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 인기영상 */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-secondary">
              <h2 className="text-[13px] font-bold flex items-center gap-1.5">
                <Play className="w-4 h-4 text-red-500" />인기 입시영상
              </h2>
              <Link href="/info" className="text-[11px] text-primary-600 hover:underline flex items-center gap-0.5">더보기<ArrowRight className="w-3 h-3" /></Link>
            </div>
            {videosLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3">
                {videos.map((v) => (
                  <div key={v.id} onClick={() => setPlayingVideo(v)} className="cursor-pointer group">
                    <div className="aspect-video rounded overflow-hidden relative mb-1.5">
                      <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:brightness-90 transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[12px] font-medium line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">{v.title}</p>
                    <p className="text-[10px] text-muted-light mt-0.5">{v.channelTitle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측 사이드 */}
        <div className="space-y-4">
          {/* 입시일정 */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-surface-secondary">
              <h2 className="text-[13px] font-bold">📅 다가오는 입시일정</h2>
            </div>
            <div className="divide-y divide-border-light">
              {schedules.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors">
                  <div className="w-10 h-10 bg-primary-50 rounded flex flex-col items-center justify-center flex-shrink-0 border border-primary-100">
                    <span className="text-[9px] font-bold text-primary-500 leading-none">{s.month}월</span>
                    <span className="text-[13px] font-extrabold text-primary-700 leading-tight">{s.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate">{s.title}</p>
                    <span className="text-[10px] text-muted-light">{s.type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded flex-shrink-0">{s.dday}</span>
                </div>
              ))}
              {schedules.length === 0 && <p className="text-center py-4 text-[12px] text-muted-light">일정을 불러오는 중...</p>}
            </div>
          </div>

          {/* 커뮤니티 인기글 */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-secondary">
              <h2 className="text-[13px] font-bold">🔥 커뮤니티 인기글</h2>
              <Link href="/community" className="text-[11px] text-primary-600 hover:underline">더보기</Link>
            </div>
            <div className="divide-y divide-border-light">
              {[
                { title: "내신 2.3인데 서울 상위권 가능할까요?", board: "수시", comments: 89 },
                { title: "올해 수능 국어 체감 난이도 공유", board: "정시", comments: 124 },
                { title: "학종 세특 어떻게 채우셨나요?", board: "학종", comments: 67 },
                { title: "재수 결심, 학부모 경험담 부탁드려요", board: "학부모", comments: 93 },
                { title: "의대 논술 준비 타임라인 공유", board: "논술", comments: 45 },
              ].map((p, i) => (
                <Link key={i} href="/community" className="flex items-center gap-2 px-4 py-2 hover:bg-surface-hover transition-colors">
                  <span className={`text-[11px] font-bold w-4 text-center ${i < 3 ? "text-rose-500" : "text-muted-light"}`}>{i + 1}</span>
                  <span className="text-[12px] truncate flex-1 hover:text-primary-600">{p.title}</span>
                  <span className="text-[10px] text-muted-light flex items-center gap-0.5">
                    <MessageSquare className="w-3 h-3" />{p.comments}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 바로가기 */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-surface-secondary">
              <h2 className="text-[13px] font-bold">바로가기</h2>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-border-light">
              {[
                { label: "입시뉴스", href: "/news", icon: Newspaper },
                { label: "입시영상", href: "/info", icon: Play },
                { label: "입시Chat", href: "/chat", icon: MessageCircle },
                { label: "커뮤니티", href: "/community", icon: MessageSquare },
                { label: "입시정보", href: "/sites", icon: BookOpen },
                { label: "학원정보", href: "/academy", icon: School },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 px-3 py-2.5 hover:bg-surface-hover transition-colors">
                  <link.icon className="w-4 h-4 text-primary-600" />
                  <span className="text-[12px] font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative w-full max-w-3xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPlayingVideo(null)} className="absolute -top-8 right-0 text-white/80 hover:text-white text-sm">닫기 ✕</button>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0`} title={playingVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
            <div className="mt-2 bg-surface rounded-lg border border-border p-3">
              <h3 className="text-[13px] font-semibold">{playingVideo.title}</h3>
              <p className="text-[11px] text-muted mt-1">{playingVideo.channelTitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
