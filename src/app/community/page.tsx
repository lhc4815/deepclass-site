"use client";

import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Flame,
  PenSquare,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Search,
  Loader2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const boards = [
  { id: "all", label: "전체", icon: MessageSquare },
  { id: "susi", label: "수시", icon: BookOpen },
  { id: "jeongsi", label: "정시", icon: BookOpen },
  { id: "nonseul", label: "논술", icon: BookOpen },
  { id: "hakjong", label: "학종", icon: BookOpen },
  { id: "student", label: "학생게시판", icon: GraduationCap },
  { id: "parent", label: "학부모게시판", icon: Users },
  { id: "free", label: "자유게시판", icon: MessageCircle },
  { id: "qna", label: "질문&답변", icon: MessageSquare },
];

const sortOptions = [
  { id: "latest", label: "최신순" },
  { id: "popular", label: "인기순" },
  { id: "comments", label: "댓글순" },
];

const boardLabels: Record<string, string> = {
  susi: "수시", jeongsi: "정시", nonseul: "논술", hakjong: "학종",
  student: "학생게시판", parent: "학부모게시판", free: "자유게시판", qna: "질문&답변",
};

const boardColors: Record<string, string> = {
  susi: "bg-blue-50 text-blue-600 border-blue-100",
  jeongsi: "bg-rose-50 text-rose-600 border-rose-100",
  nonseul: "bg-purple-50 text-purple-600 border-purple-100",
  hakjong: "bg-teal-50 text-teal-600 border-teal-100",
  student: "bg-indigo-50 text-indigo-600 border-indigo-100",
  parent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  free: "bg-gray-50 text-gray-600 border-gray-100",
  qna: "bg-orange-50 text-orange-600 border-orange-100",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

interface Post {
  id: number; title: string; content: string; board: string;
  views: number; likes_count: number; comments_count: number;
  is_pinned: boolean; created_at: string;
  profiles: { name: string; avatar_url: string | null; user_type: string };
}

interface HotPost {
  id: number; title: string; board: string; likes_count: number; comments_count: number;
}

export default function CommunityPage() {
  const [activeBoard, setActiveBoard] = useState("all");
  const [activeSort, setActiveSort] = useState("latest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [hotPosts, setHotPosts] = useState<HotPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/community?board=${activeBoard}&sort=${activeSort}&limit=20`);
    const data = await res.json();
    if (data.success) {
      setPosts(data.data);
      setTotal(data.total);
    }
    setLoading(false);
  }, [activeBoard, activeSort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetch("/api/community/hot")
      .then((r) => r.json())
      .then((d) => { if (d.success) setHotPosts(d.data); });
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">커뮤니티</h1>
          <p className="text-sm text-muted mt-0.5">입시에 대한 이야기를 나눠보세요</p>
        </div>
        <Link
          href="/community/write"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20"
        >
          <PenSquare className="w-4 h-4" />글쓰기
        </Link>
      </div>

      {/* Hot Posts */}
      {hotPosts.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
            <div className="w-7 h-7 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-semibold">실시간 인기글</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border-light">
            {hotPosts.map((post, i) => (
              <Link key={post.id} href={`/community/${post.id}`} className="px-4 py-3 hover:bg-surface-hover transition-colors group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-extrabold ${i < 3 ? "text-rose-500" : "text-muted-light"}`}>{i + 1}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded border ${boardColors[post.board] || boardColors.free}`}>
                    {boardLabels[post.board] || post.board}
                  </span>
                </div>
                <p className="text-[12px] font-medium line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">{post.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-light">
                  <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{post.likes_count}</span>
                  <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.comments_count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Board Nav */}
        <div className="lg:col-span-3 xl:col-span-2">
          <div className="bg-surface rounded-2xl border border-border p-3 space-y-0.5 lg:sticky lg:top-20">
            <p className="px-3 pt-1 pb-2 text-[10px] font-semibold text-muted-light uppercase tracking-widest">게시판</p>
            {boards.map((board) => {
              const active = activeBoard === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => setActiveBoard(board.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    active ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <board.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary-500" : ""}`} />
                  {board.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post List */}
        <div className="lg:col-span-9 xl:col-span-10 space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveSort(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeSort === opt.id ? "bg-foreground text-white" : "bg-surface border border-border text-muted hover:border-primary-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-light">총 {total}개</span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
            </div>
          )}

          {/* Posts */}
          {!loading && (
            <div className="space-y-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="block bg-surface rounded-2xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${boardColors[post.board] || boardColors.free}`}>
                          {boardLabels[post.board] || post.board}
                        </span>
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-surface-secondary text-muted">
                          {post.profiles?.user_type || "학생"}
                        </span>
                        {post.likes_count >= 5 && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded border border-rose-100">
                            <Flame className="w-2.5 h-2.5" /> HOT
                          </span>
                        )}
                      </div>
                      <h3 className="text-[14px] font-semibold leading-snug group-hover:text-primary-600 transition-colors mb-1">{post.title}</h3>
                      <p className="text-[12px] text-muted leading-relaxed line-clamp-1">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-light">
                        <span className="font-medium text-muted">{post.profiles?.name}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-center gap-3 pl-4 border-l border-border-light min-w-[60px]">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-rose-500">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{post.likes_count}</span>
                        </div>
                        <span className="text-[9px] text-muted-light">좋아요</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-primary-500">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{post.comments_count}</span>
                        </div>
                        <span className="text-[9px] text-muted-light">댓글</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Empty */}
              {posts.length === 0 && (
                <div className="text-center py-16 bg-surface rounded-2xl border border-border">
                  <MessageSquare className="w-12 h-12 text-muted-light mx-auto mb-3" />
                  <p className="text-sm text-muted mb-4">아직 게시글이 없습니다.</p>
                  <Link href="/community/write" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                    <PenSquare className="w-4 h-4" />첫 글 작성하기
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
