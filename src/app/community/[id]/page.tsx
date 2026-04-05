"use client";

import { ArrowLeft, ThumbsUp, MessageSquare, Clock, Eye, Trash2, Send, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

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
  return `${d}일 전`;
}

interface Post {
  id: number; title: string; content: string; board: string;
  views: number; likes_count: number; comments_count: number;
  created_at: string; author_id: string; liked: boolean;
  profiles: { name: string; avatar_url: string | null; user_type: string };
}

interface Comment {
  id: number; content: string; likes_count: number; created_at: string; author_id: string;
  profiles: { name: string; avatar_url: string | null; user_type: string };
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);

  const fetchPost = useCallback(async () => {
    const res = await fetch(`/api/community/${id}`);
    const data = await res.json();
    if (data.success) {
      setPost(data.data);
      setLiked(data.data.liked);
      setLikesCount(data.data.likes_count);
    }
    setLoading(false);
  }, [id]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/community/${id}/comments`);
    const data = await res.json();
    if (data.success) setComments(data.data);
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleLike = async () => {
    if (!currentUserId) { router.push("/login"); return; }
    const res = await fetch(`/api/community/${id}/like`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setLiked(data.liked);
      setLikesCount((prev) => prev + (data.liked ? 1 : -1));
    }
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    if (!currentUserId) { router.push("/login"); return; }

    const res = await fetch(`/api/community/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentInput }),
    });
    const data = await res.json();
    if (data.success) {
      setComments((prev) => [...prev, data.data]);
      setCommentInput("");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/community/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) router.push("/community");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!post) {
    return <div className="text-center py-20 text-muted">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-4">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />목록으로
      </Link>

      {/* Post */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${boardColors[post.board] || boardColors.free}`}>
            {boardLabels[post.board] || post.board}
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-surface-secondary text-muted">
            {post.profiles.user_type}
          </span>
        </div>

        <h1 className="text-lg font-bold mb-3">{post.title}</h1>

        <div className="flex items-center gap-3 pb-4 border-b border-border-light mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            {post.profiles.avatar_url ? (
              <img src={post.profiles.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <span className="text-xs font-bold text-white">{post.profiles.name?.[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{post.profiles.name}</p>
            <div className="flex items-center gap-2 text-[11px] text-muted-light">
              <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
              <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views}</span>
            </div>
          </div>
          {currentUserId === post.author_id && (
            <button onClick={handleDelete} className="ml-auto p-2 rounded-lg text-muted-light hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</div>

        {/* Like button */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border-light">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              liked
                ? "bg-primary-50 text-primary-600 border border-primary-200"
                : "bg-surface-secondary border border-border text-muted hover:border-primary-200"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? "fill-primary-600" : ""}`} />
            좋아요 {likesCount > 0 && likesCount}
          </button>
          <span className="text-xs text-muted-light flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />댓글 {comments.length}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h2 className="text-sm font-semibold">댓글 {comments.length}개</h2>
        </div>

        {comments.length > 0 && (
          <div className="divide-y divide-border-light">
            {comments.map((c) => (
              <div key={c.id} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-gray-600">{c.profiles.name?.[0]}</span>
                  </div>
                  <span className="text-xs font-medium">{c.profiles.name}</span>
                  <span className="text-[10px] text-muted-light">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed pl-8">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comment input */}
        <div className="px-5 py-4 border-t border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleComment()}
              placeholder={currentUserId ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다"}
              className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
            />
            <button
              onClick={handleComment}
              disabled={!commentInput.trim()}
              className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
