"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const boards = [
  { id: "susi", label: "수시" },
  { id: "jeongsi", label: "정시" },
  { id: "nonseul", label: "논술" },
  { id: "hakjong", label: "학종" },
  { id: "student", label: "학생게시판" },
  { id: "parent", label: "학부모게시판" },
  { id: "free", label: "자유게시판" },
  { id: "qna", label: "질문&답변" },
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

    setLoading(true);
    setError("");

    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, board }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/community/${data.data.id}`);
    } else {
      setError(data.error || "글 작성에 실패했습니다.");
      if (data.error?.includes("로그인")) {
        router.push("/login");
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />커뮤니티로 돌아가기
      </Link>

      <div className="bg-surface rounded-2xl border border-border p-6">
        <h1 className="text-lg font-bold mb-5">글쓰기</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Board select */}
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">게시판 선택</label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
            >
              {boards.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">내용</label>
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 resize-none leading-relaxed"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <Link href="/community" className="px-5 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm font-medium text-muted hover:bg-background transition-colors">
              취소
            </Link>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "게시 중..." : "게시하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
