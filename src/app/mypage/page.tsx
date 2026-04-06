"use client";

import { Bookmark, Newspaper, Play, MessageSquare, Trash2, ExternalLink, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BookmarkItem {
  id: number;
  item_type: "news" | "video" | "post";
  item_id: string;
  title: string;
  url: string;
  thumbnail: string;
  summary: string;
  source: string;
  created_at: string;
}

const tabs = [
  { id: "all", label: "전체", icon: Bookmark },
  { id: "news", label: "뉴스 스크랩", icon: Newspaper },
  { id: "video", label: "영상 저장", icon: Play },
  { id: "post", label: "게시글 스크랩", icon: MessageSquare },
];

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전"; if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = (type?: string) => {
    setLoading(true);
    const url = type && type !== "all" ? `/api/bookmarks?type=${type}` : "/api/bookmarks";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBookmarks(d.data || []);
        else if (d.error?.includes("로그인")) router.push("/login");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookmarks(activeTab); }, [activeTab]);

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/bookmarks", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const typeIcon = (type: string) => {
    if (type === "news") return <Newspaper className="w-3.5 h-3.5 text-blue-600" />;
    if (type === "video") return <Play className="w-3.5 h-3.5 text-red-500" />;
    return <MessageSquare className="w-3.5 h-3.5 text-primary-600" />;
  };

  const typeLabel = (type: string) => {
    if (type === "news") return "뉴스";
    if (type === "video") return "영상";
    return "게시글";
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <h1 className="text-[15px] font-bold flex items-center gap-1.5">
        <Bookmark className="w-4 h-4 text-primary-600" />나의 입시정보
      </h1>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
              activeTab === t.id ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-foreground"
            }`}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {activeTab === t.id && !loading && <span className="text-[10px] text-muted-light ml-0.5">({bookmarks.length})</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
      ) : bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((b) => (
            <div key={b.id} className="bg-surface border border-border rounded-lg p-3 flex gap-3 group hover:border-primary-300 transition-colors">
              {/* Thumbnail */}
              {b.thumbnail && (
                <div className="hidden sm:block w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-surface-secondary">
                  <img src={b.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {typeIcon(b.item_type)}
                  <span className="text-[10px] font-semibold text-muted-light">{typeLabel(b.item_type)}</span>
                  {b.source && <span className="text-[10px] text-muted-light">· {b.source}</span>}
                </div>
                <h3 className="text-[13px] font-semibold leading-snug mb-1">
                  {b.url ? (
                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                      {b.title}
                    </a>
                  ) : b.item_type === "post" ? (
                    <Link href={`/community/${b.item_id}`} className="hover:text-primary-600 transition-colors">
                      {b.title}
                    </Link>
                  ) : b.title}
                </h3>
                {b.summary && (
                  <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">{b.summary}</p>
                )}
                <span className="text-[10px] text-muted-light flex items-center gap-0.5 mt-1">
                  <Clock className="w-3 h-3" />{timeAgo(b.created_at)}
                </span>
              </div>
              {/* Actions */}
              <div className="flex flex-col items-center gap-1">
                {b.url && (
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-muted-light hover:text-primary-600 hover:bg-primary-50 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded text-muted-light hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface border border-border rounded-lg">
          <Bookmark className="w-10 h-10 text-muted-light mx-auto mb-3" />
          <h3 className="text-[14px] font-semibold mb-1">스크랩한 항목이 없습니다</h3>
          <p className="text-[12px] text-muted">뉴스, 영상, 게시글에서 스크랩 버튼을 눌러 저장하세요.</p>
        </div>
      )}
    </div>
  );
}
