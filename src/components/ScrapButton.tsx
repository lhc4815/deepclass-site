"use client";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useState } from "react";

interface ScrapButtonProps {
  itemType: "news" | "video" | "post";
  itemId: string;
  title: string;
  url?: string;
  thumbnail?: string;
  summary?: string;
  source?: string;
  size?: "sm" | "md";
}

export default function ScrapButton({ itemType, itemId, title, url, thumbnail, summary, source, size = "sm" }: ScrapButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScrap = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_type: itemType, item_id: itemId, title, url, thumbnail, summary, source }),
      });
      const data = await res.json();
      if (data.success) setSaved(true);
      else if (data.error?.includes("로그인")) alert("로그인 후 스크랩할 수 있습니다.");
    } catch {} finally { setLoading(false); }
  };

  if (saved) {
    return (
      <span className={`flex items-center gap-0.5 text-primary-600 ${size === "sm" ? "text-[10px]" : "text-[12px]"}`}>
        <BookmarkCheck className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
        저장됨
      </span>
    );
  }

  return (
    <button onClick={handleScrap} disabled={loading}
      className={`flex items-center gap-0.5 text-muted-light hover:text-primary-600 transition-colors ${size === "sm" ? "text-[10px]" : "text-[12px]"}`}
      title="스크랩">
      {loading ? (
        <Loader2 className={`animate-spin ${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
      ) : (
        <Bookmark className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      )}
      <span className="hidden sm:inline">스크랩</span>
    </button>
  );
}
