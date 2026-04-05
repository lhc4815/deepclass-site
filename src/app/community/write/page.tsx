"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const boards = [
  { id: "susi", label: "수시" }, { id: "jeongsi", label: "정시" }, { id: "nonseul", label: "논술" },
  { id: "hakjong", label: "학종" }, { id: "student", label: "학생게시판" }, { id: "parent", label: "학부모게시판" },
  { id: "free", label: "자유게시판" }, { id: "qna", label: "질문&답변" },
];

export default function WritePage() {
  const router = useRouter();
  const [board, setBoard] = useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true); setError("");
    const res = await fetch("/api/community", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, board }),
    });
    const data = await res.json();
    if (data.success) router.push(`/community/${data.data.id}`);
    else { setError(data.error || "글 작성 실패"); if (data.error?.includes("로그인")) router.push("/login"); }
    setLoading(false);
  };

  return (
    <div className="max-w-[800px] mx-auto animate-fade-in">
      <Link href="/community" className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-foreground mb-3">
        <ArrowLeft className="w-3.5 h-3.5" />목록으로
      </Link>

      <div className="bg-surface border border-border rounded-lg">
        <div className="px-4 py-2.5 border-b-2 border-foreground bg-surface-secondary">
          <h1 className="text-[14px] font-bold">글쓰기</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-[12px] font-semibold text-muted w-16">게시판</label>
            <select value={board} onChange={(e) => setBoard(e.target.value)}
              className="flex-1 px-3 py-[6px] bg-surface border border-border rounded text-[13px] focus:outline-none focus:border-primary-400">
              {boards.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] font-semibold text-muted w-16">제목</label>
            <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="flex-1 px-3 py-[6px] bg-surface border border-border rounded text-[13px] placeholder:text-muted-light focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-muted mb-1 block">내용</label>
            <textarea placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} required rows={14}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-[13px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 resize-none leading-relaxed" />
          </div>
          {error && <p className="text-[12px] text-rose-500 bg-rose-50 border border-rose-200 rounded px-3 py-1.5">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Link href="/community" className="px-4 py-[6px] bg-surface-secondary border border-border rounded text-[12px] font-medium text-muted">취소</Link>
            <button type="submit" disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center gap-1.5 px-4 py-[6px] bg-primary-600 text-white rounded text-[12px] font-semibold hover:bg-primary-700 disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />{loading ? "게시 중..." : "게시하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
