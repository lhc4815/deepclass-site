"use client";

import { Newspaper, Clock, Search, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { NewsItem } from "@/lib/news-sources";
import NewsImage from "@/components/NewsImage";

const categories = [
  { id: "전체", label: "전체" }, { id: "수시", label: "수시" }, { id: "정시", label: "정시" },
  { id: "논술", label: "논술" }, { id: "학종", label: "학종" }, { id: "내신", label: "내신" }, { id: "의대", label: "의대" },
];

const categoryColors: Record<string, string> = {
  "전체": "bg-gray-100 text-gray-600", "수시": "bg-blue-100 text-blue-700", "정시": "bg-rose-100 text-rose-700",
  "논술": "bg-purple-100 text-purple-700", "학종": "bg-teal-100 text-teal-700", "내신": "bg-amber-100 text-amber-700", "의대": "bg-emerald-100 text-emerald-700",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전"; if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const [rssRes, naverRes] = await Promise.allSettled([
        fetch(`/api/news/rss?category=${encodeURIComponent(category)}&limit=30`),
        fetch(`/api/news/naver?category=${encodeURIComponent(category)}&limit=30`),
      ]);
      const allItems: NewsItem[] = [];
      for (const res of [rssRes, naverRes]) {
        if (res.status === "fulfilled" && res.value.ok) {
          const json = await res.value.json();
          if (json.success && json.data) allItems.push(...json.data);
        }
      }
      const seen = new Set<string>();
      const unique = allItems.filter((item) => {
        const key = item.title.toLowerCase().trim();
        if (seen.has(key) || !key) return false;
        seen.add(key); return true;
      });
      unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setNews(unique.slice(0, 40));
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNews(activeCategory); }, [activeCategory, fetchNews]);

  const filteredNews = searchQuery
    ? news.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : news;

  return (
    <div className="max-w-[1200px] mx-auto space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-bold flex items-center gap-1.5">
          입시뉴스
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">LIVE</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
            <input type="text" placeholder="뉴스 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-[5px] bg-surface border border-border rounded text-[12px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 w-48" />
          </div>
          <button onClick={() => fetchNews(activeCategory)} className="p-1.5 rounded border border-border text-muted-light hover:text-foreground hover:bg-surface-hover transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border pb-2">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded text-[12px] font-medium transition-colors ${
              activeCategory === cat.id ? "bg-primary-600 text-white" : "text-muted hover:bg-surface-secondary"
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-primary-600 animate-spin" /></div>
      ) : (
        <>
          <p className="text-[11px] text-muted-light">총 {filteredNews.length}건</p>
          <div className="space-y-2">
            {filteredNews.map((item) => (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
                className="flex gap-3 bg-surface border border-border rounded-lg p-3 hover:border-primary-300 transition-colors group">
                {/* Thumbnail */}
                <div className="hidden sm:block w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-surface-secondary">
                  <NewsImage articleUrl={item.link} alt={item.title} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${categoryColors[item.category] || categoryColors["전체"]}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-muted-light">{item.source}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded ${item.provider === "naver" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                      {item.provider === "naver" ? "네이버" : "구글"}
                    </span>
                  </div>
                  <h3 className="text-[13px] font-semibold leading-snug group-hover:text-primary-600 transition-colors mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  <span className="text-[10px] text-muted-light flex items-center gap-0.5 mt-1.5">
                    <Clock className="w-3 h-3" />{timeAgo(item.pubDate)}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </a>
            ))}
          </div>
          {filteredNews.length === 0 && (
            <div className="text-center py-8 text-[13px] text-muted">{searchQuery ? "검색 결과가 없습니다." : "뉴스가 없습니다."}</div>
          )}
        </>
      )}
    </div>
  );
}
