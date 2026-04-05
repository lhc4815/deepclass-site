"use client";

import { ArrowLeft, ThumbsUp, MessageSquare, Clock, Eye, Trash2, Send, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

const boardLabels: Record<string, string> = {
  susi: "수시", jeongsi: "정시", nonseul: "논술", hakjong: "학종",
  student: "학생", parent: "학부모", free: "자유", qna: "Q&A",
};

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전"; if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

interface Post {
  id: number; title: string; content: string; board: string;
  views: number; likes_count: number; comments_count: number;
  created_at: string; author_id: string; liked: boolean;
  profiles: { name: string; avatar_url: string | null; user_type: string };
}
interface Comment {
  id: number; content: string; created_at: string; author_id: string;
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

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null)); }, []);

  const fetchPost = useCallback(async () => {
    const res = await fetch(`/api/community/${id}`); const data = await res.json();
    if (data.success) { setPost(data.data); setLiked(data.data.liked); setLikesCount(data.data.likes_count); }
    setLoading(false);
  }, [id]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/community/${id}/comments`); const data = await res.json();
    if (data.success) setComments(data.data);
  }, [id]);

  useEffect(() => { fetchPost(); fetchComments(); }, [fetchPost, fetchComments]);

  const handleLike = async () => {
    if (!currentUserId) { router.push("/login"); return; }
    const res = await fetch(`/api/community/${id}/like`, { method: "POST" }); const data = await res.json();
    if (data.success) { setLiked(data.liked); setLikesCount((p) => p + (data.liked ? 1 : -1)); }
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    if (!currentUserId) { router.push("/login"); return; }
    const res = await fetch(`/api/community/${id}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: commentInput }) });
    const data = await res.json();
    if (data.success) { setComments((p) => [...p, data.data]); setCommentInput(""); }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/community/${id}`, { method: "DELETE" }); const data = await res.json();
    if (data.success) router.push("/community");
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return <div className="text-center py-12 text-muted">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[800px] mx-auto space-y-3 animate-fade-in">
      <Link href="/community" className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" />목록으로
      </Link>

      {/* Post */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="px-4 py-2.5 border-b-2 border-foreground bg-surface-secondary flex items-center gap-2">
          <span className="text-[11px] font-semibold text-primary-600">[{boardLabels[post.board] || post.board}]</span>
          <h1 className="text-[14px] font-bold flex-1">{post.title}</h1>
        </div>
        {/* Meta */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border-light text-[11px] text-muted-light">
          <span><b className="text-muted">{post.profiles.name}</b> ({post.profiles.user_type})</span>
          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />조회 {post.views}</span>
          <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />추천 {likesCount}</span>
          {currentUserId === post.author_id && (
            <button onClick={handleDelete} className="ml-auto text-rose-400 hover:text-rose-600">삭제</button>
          )}
        </div>
        {/* Content */}
        <div className="px-4 py-4 text-[13px] leading-relaxed whitespace-pre-wrap min-h-[120px] border-b border-border">
          {post.content}
        </div>
        {/* Like */}
        <div className="flex items-center justify-center py-3">
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded border text-[12px] font-medium transition-colors ${
              liked ? "bg-primary-50 border-primary-300 text-primary-600" : "bg-surface border-border text-muted hover:border-primary-300"
            }`}>
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-primary-600" : ""}`} />
            추천 {likesCount > 0 && likesCount}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="px-4 py-2 border-b-2 border-foreground bg-surface-secondary">
          <h2 className="text-[12px] font-bold">댓글 {comments.length}개</h2>
        </div>
        {comments.length > 0 && (
          <div className="divide-y divide-border-light">
            {comments.map((c) => (
              <div key={c.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold">{c.profiles.name}</span>
                  <span className="text-[10px] text-muted-light">{c.profiles.user_type}</span>
                  <span className="text-[10px] text-muted-light">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-[13px] leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        )}
        {/* Input */}
        <div className="px-4 py-3 border-t border-border bg-surface-secondary">
          <div className="flex items-center gap-2">
            <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder={currentUserId ? "댓글을 입력하세요" : "로그인 후 댓글 작성 가능"}
              className="flex-1 px-3 py-[6px] bg-surface border border-border rounded text-[13px] placeholder:text-muted-light focus:outline-none focus:border-primary-400" />
            <button onClick={handleComment} disabled={!commentInput.trim()}
              className="px-3 py-[6px] bg-primary-600 text-white rounded text-[12px] font-medium hover:bg-primary-700 disabled:opacity-40">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
