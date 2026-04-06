"use client";

import {
  MessageSquare, ThumbsUp, Eye, Clock, Flame, PenSquare,
  BookOpen, GraduationCap, MessageCircle, Search, Loader2, Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { COMMUNITY_BOARDS, BOARD_LABELS, BOARD_COLORS } from "@/lib/categories";

const boardGroups = [
  { group: "전형별", boards: COMMUNITY_BOARDS.filter((b) => b.group === "전형별") },
  { group: "계열별", boards: COMMUNITY_BOARDS.filter((b) => b.group === "계열별") },
  { group: "사용자별", boards: COMMUNITY_BOARDS.filter((b) => b.group === "사용자별") },
  { group: "대학별", boards: COMMUNITY_BOARDS.filter((b) => b.group === "대학별") },
  { group: "일반", boards: COMMUNITY_BOARDS.filter((b) => b.group === "일반") },
];

const sortOptions = [
  { id: "latest", label: "최신순" },
  { id: "popular", label: "인기순" },
  { id: "comments", label: "댓글순" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
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
    if (data.success) { setPosts(data.data); setTotal(data.total); }
    setLoading(false);
  }, [activeBoard, activeSort]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => {
    fetch("/api/community/hot").then((r) => r.json()).then((d) => { if (d.success) setHotPosts(d.data); });
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-bold">커뮤니티</h1>
        <Link href="/community/write" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded text-[12px] font-semibold hover:bg-primary-700 transition-colors">
          <PenSquare className="w-3.5 h-3.5" />글쓰기
        </Link>
      </div>

      {/* 인기글 */}
      {hotPosts.length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-surface-secondary">
            <h2 className="text-[12px] font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-rose-500" />실시간 인기글</h2>
          </div>
          <div className="divide-y divide-border-light">
            {hotPosts.map((p, i) => (
              <Link key={p.id} href={`/community/${p.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-surface-hover transition-colors">
                <span className={`text-[11px] font-bold w-4 text-center ${i < 3 ? "text-rose-500" : "text-muted-light"}`}>{i + 1}</span>
                <span className="text-[11px] font-semibold text-primary-600">[{BOARD_LABELS[p.board] || p.board}]</span>
                <span className="text-[12px] truncate flex-1">{p.title}</span>
                <span className="text-[10px] text-muted-light flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />{p.likes_count}
                  <MessageSquare className="w-3 h-3 ml-1" />{p.comments_count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 좌측: 게시판 목록 */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg overflow-hidden lg:sticky lg:top-16">
            <div className="px-4 py-2 border-b-2 border-foreground bg-surface-secondary">
              <h2 className="text-[12px] font-bold">게시판</h2>
            </div>
            <div>
              <button onClick={() => setActiveBoard("all")}
                className={`w-full text-left px-4 py-2 text-[12px] font-medium border-b border-border-light ${activeBoard === "all" ? "bg-primary-50 text-primary-700 font-semibold" : "text-muted hover:bg-surface-hover"}`}>
                전체
              </button>
              {boardGroups.map((g) => (
                <div key={g.group}>
                  <div className="px-4 py-1.5 bg-surface-secondary text-[10px] font-bold text-muted-light uppercase tracking-wider">{g.group}</div>
                  {g.boards.map((b) => (
                    <button key={b.id} onClick={() => setActiveBoard(b.id)}
                      className={`w-full text-left px-4 py-1.5 text-[12px] transition-colors ${activeBoard === b.id ? "bg-primary-50 text-primary-700 font-semibold" : "text-muted hover:bg-surface-hover"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우측: 게시글 */}
        <div className="lg:col-span-3">
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {/* 정렬 + 검색 */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-secondary">
              <div className="flex items-center gap-1">
                {sortOptions.map((s) => (
                  <button key={s.id} onClick={() => setActiveSort(s.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${activeSort === s.id ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-hover"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-muted-light">총 {total}개</span>
            </div>

            {/* 게시글 테이블 */}
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
            ) : posts.length > 0 ? (
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="w-16">분류</th>
                    <th className="td-title">제목</th>
                    <th className="w-20">글쓴이</th>
                    <th className="w-16">날짜</th>
                    <th className="w-12">조회</th>
                    <th className="w-12">추천</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td className="td-center">
                        <span className="text-[11px] font-semibold text-primary-600">{BOARD_LABELS[p.board] || p.board}</span>
                      </td>
                      <td className="td-title">
                        <Link href={`/community/${p.id}`} className="hover:text-primary-600 hover:underline transition-colors">
                          {p.title}
                          {p.comments_count > 0 && <span className="text-[11px] text-primary-500 ml-1">[{p.comments_count}]</span>}
                          {p.likes_count >= 5 && <span className="text-[10px] text-rose-500 ml-1">🔥</span>}
                        </Link>
                      </td>
                      <td className="td-center text-[11px] text-muted">{p.profiles?.name}</td>
                      <td className="td-center text-[11px] text-muted-light">{timeAgo(p.created_at)}</td>
                      <td className="td-center text-[11px] text-muted-light">{p.views}</td>
                      <td className="td-center text-[11px] text-rose-500 font-semibold">{p.likes_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-8 h-8 text-muted-light mx-auto mb-2" />
                <p className="text-[13px] text-muted mb-3">아직 게시글이 없습니다.</p>
                <Link href="/community/write" className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded text-[12px] font-medium">
                  <PenSquare className="w-3.5 h-3.5" />첫 글 작성하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
