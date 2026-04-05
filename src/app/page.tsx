"use client";

import {
  Newspaper,
  BookOpen,
  MessageCircle,
  MessageSquare,
  School,
  TrendingUp,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Play,
  Clock,
  Eye,
  Flame,
  Sparkles,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/news-sources";
import NewsImage from "@/components/NewsImage";
import { getUpcomingSchedules, getDday } from "@/lib/schedule-data";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
}

const categoryColors: Record<string, string> = {
  "전체": "bg-gray-50 text-gray-600 border-gray-100",
  "수시": "bg-blue-50 text-blue-600 border-blue-100",
  "정시": "bg-rose-50 text-rose-600 border-rose-100",
  "논술": "bg-purple-50 text-purple-600 border-purple-100",
  "학종": "bg-teal-50 text-teal-600 border-teal-100",
  "내신": "bg-amber-50 text-amber-600 border-amber-100",
  "의대": "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const upcomingSchedule = getUpcomingSchedules(5).map((s) => {
  const d = new Date(s.date);
  return {
    month: String(d.getMonth() + 1),
    day: String(d.getDate()).padStart(2, "0"),
    title: s.title,
    type: s.type,
    dday: getDday(s.date),
  };
});

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

function videoTimeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days < 1) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    // 뉴스 로드
    fetch("/api/news/naver?category=%EC%A0%84%EC%B2%B4&limit=6")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNews(d.data || []); })
      .catch(() => {})
      .finally(() => setNewsLoading(false));

    // 유튜브 로드
    fetch("/api/youtube?category=%EC%A0%84%EC%B2%B4&limit=4")
      .then((r) => r.json())
      .then((d) => { if (d.success) setVideos(d.data || []); })
      .catch(() => {})
      .finally(() => setVideosLoading(false));
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-2xl p-7 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-full text-xs font-medium backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              입시정보 종합 허브
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1.5">딥클래스에 오신 것을 환영합니다</h1>
          <p className="text-primary-200 text-sm max-w-xl">
            입시의 모든 정보를 한 곳에서 확인하세요. 최신 뉴스, 영상, AI 상담까지 딥클래스가 함께합니다.
          </p>
          <div className="flex gap-3 mt-5">
            <Link href="/news" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-black/10">
              <Newspaper className="w-4 h-4" />뉴스 보기
            </Link>
            <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition-all duration-200 backdrop-blur-sm border border-white/20">
              <MessageCircle className="w-4 h-4" />AI 상담 시작
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { icon: Newspaper, title: "입시뉴스", href: "/news", gradient: "from-blue-500 to-blue-600" },
          { icon: BookOpen, title: "입시정보", href: "/info", gradient: "from-emerald-500 to-emerald-600" },
          { icon: MessageCircle, title: "입시Chat", href: "/chat", gradient: "from-violet-500 to-purple-600" },
          { icon: MessageSquare, title: "커뮤니티", href: "/community", gradient: "from-rose-500 to-pink-600" },
          { icon: School, title: "학원정보", href: "/academy", gradient: "from-amber-500 to-orange-600" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="bg-surface rounded-xl border border-border p-4 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group flex items-center gap-3">
            <div className={`w-9 h-9 bg-gradient-to-br ${link.gradient} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <link.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold group-hover:text-primary-600 transition-colors">{link.title}</span>
          </Link>
        ))}
      </div>

      {/* Main Grid: News + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest News */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">최신 입시뉴스</h2>
                <p className="text-[11px] text-muted-light">실시간 업데이트</p>
              </div>
            </div>
            <Link href="/news" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
              전체보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {newsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {news.slice(0, 6).map((item, i) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 px-5 py-3.5 hover:bg-surface-hover transition-all duration-200 group"
                >
                  {/* Thumbnail */}
                  <div className="hidden sm:block w-28 h-[72px] flex-shrink-0 rounded-lg overflow-hidden">
                    <NewsImage articleUrl={item.link} alt={item.title} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded border ${categoryColors[item.category] || categoryColors["전체"]}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted-light">{item.source}</span>
                    </div>
                    <h3 className="text-[13px] font-medium leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-muted-light flex items-center gap-0.5 mt-1">
                      <Clock className="w-3 h-3" />{timeAgo(item.pubDate)}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-light opacity-0 group-hover:opacity-100 transition-all mt-1 flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Schedule */}
        <div className="lg:col-span-4 space-y-6">
          {/* Schedule */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">다가오는 일정</h2>
                <p className="text-[11px] text-muted-light">주요 입시 일정</p>
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              {upcomingSchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-all duration-200">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-primary-100">
                    <span className="text-[9px] font-bold text-primary-400 leading-none">{item.month}월</span>
                    <span className="text-sm font-extrabold text-primary-700 leading-tight">{item.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate">{item.title}</p>
                    <span className="text-[10px] text-muted-light">{item.type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md flex-shrink-0">
                    {item.dday}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Preview */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">커뮤니티</h2>
                  <p className="text-[11px] text-muted-light">인기 게시글</p>
                </div>
              </div>
              <Link href="/community" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                더보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-3 space-y-1">
              {[
                { title: "내신 2.3인데 서울 상위권 가능할까요?", board: "수시", hot: true },
                { title: "올해 수능 국어 체감 난이도 공유", board: "정시", hot: true },
                { title: "학종 세특 어떻게 채우셨나요?", board: "학종", hot: false },
                { title: "재수 결심, 학부모 경험담 부탁드려요", board: "학부모", hot: false },
              ].map((post, i) => (
                <Link key={i} href="/community" className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-hover transition-colors group">
                  <span className={`text-[10px] font-extrabold w-4 text-center ${i < 2 ? "text-rose-500" : "text-muted-light"}`}>{i + 1}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded border ${categoryColors[post.board] || "bg-gray-50 text-gray-600 border-gray-100"}`}>{post.board}</span>
                  <span className="text-[12px] font-medium truncate flex-1 group-hover:text-primary-600 transition-colors">{post.title}</span>
                  {post.hot && <Flame className="w-3 h-3 text-rose-400 flex-shrink-0" />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Videos */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">입시 영상</h2>
              <p className="text-[11px] text-muted-light">최신 입시 유튜브 영상</p>
            </div>
          </div>
          <Link href="/info" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
            전체보기 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {videosLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setPlayingVideo(video)}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-xl overflow-hidden relative mb-2.5">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm">
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-[12px] font-semibold leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <p className="text-[10px] text-muted">{video.channelTitle}</p>
                  <span className="text-[10px] text-muted-light">·</span>
                  <p className="text-[10px] text-muted-light">{videoTimeAgo(video.publishedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPlayingVideo(null)} className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm transition-colors">
              닫기 ✕
            </button>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-4 bg-surface rounded-2xl border border-border p-4">
              <h3 className="text-sm font-semibold">{playingVideo.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-muted">{playingVideo.channelTitle}</p>
                <a href={playingVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors">
                  <Play className="w-3 h-3" fill="white" />YouTube에서 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
