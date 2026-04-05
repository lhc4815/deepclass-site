"use client";

import {
  Newspaper,
  ArrowUpRight,
  Clock,
  Flame,
  SlidersHorizontal,
  Search,
  X,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { NewsItem } from "@/lib/news-sources";
import NewsImage from "@/components/NewsImage";

const categories = [
  { id: "전체", label: "전체" },
  { id: "수시", label: "수시" },
  { id: "정시", label: "정시" },
  { id: "논술", label: "논술" },
  { id: "학종", label: "학종" },
  { id: "내신", label: "내신" },
  { id: "의대", label: "의대" },
];

const categoryColors: Record<string, string> = {
  "전체": "bg-gray-50 text-gray-600 border-gray-100",
  "수시": "bg-blue-50 text-blue-600 border-blue-100",
  "정시": "bg-rose-50 text-rose-600 border-rose-100",
  "논술": "bg-purple-50 text-purple-600 border-purple-100",
  "학종": "bg-teal-50 text-teal-600 border-teal-100",
  "내신": "bg-amber-50 text-amber-600 border-amber-100",
  "의대": "bg-emerald-50 text-emerald-600 border-emerald-100",
};

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

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      // RSS + 네이버 병렬 호출 후 합치기
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

      // 중복 제거 + 최신순 정렬
      const seen = new Set<string>();
      const unique = allItems.filter((item) => {
        const key = item.title.toLowerCase().trim();
        if (seen.has(key) || !key) return false;
        seen.add(key);
        return true;
      });
      unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      setNews(unique.slice(0, 30));
      setLoading(false);
      return;
      // (통합 호출 위에서 처리됨)
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory, fetchNews]);

  const filteredNews = searchQuery
    ? news.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            입시뉴스
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md border border-emerald-100">
              LIVE
            </span>
          </h1>
          <p className="text-sm text-muted mt-0.5">
            실시간 입시 관련 뉴스를 자동으로 수집합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              type="text"
              placeholder="뉴스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 w-56 transition-all"
            />
          </div>
          <button
            onClick={() => fetchNews(activeCategory)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-surface border border-border text-muted hover:bg-surface-hover transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeCategory === cat.id
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                : "bg-surface border border-border text-muted hover:border-primary-200 hover:text-primary-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            <p className="text-sm text-muted">뉴스를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-rose-600">{error}</p>
          <button
            onClick={() => fetchNews(activeCategory)}
            className="mt-3 px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-medium hover:bg-rose-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* News List */}
      {!loading && !error && (
        <>
          <p className="text-xs text-muted-light">
            총 {filteredNews.length}개의 뉴스
          </p>
          <div className="space-y-2">
            {filteredNews.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-surface rounded-2xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="hidden sm:block w-40 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <NewsImage articleUrl={item.link} alt={item.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                          categoryColors[item.category] || categoryColors["전체"]
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-[11px] text-muted-light">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-muted-light px-1.5 py-0.5 bg-surface-secondary rounded">
                        {item.provider === "naver" ? "네이버" : "RSS"}
                      </span>
                    </div>
                    {/* Title */}
                    <h2 className="text-[15px] font-semibold leading-snug group-hover:text-primary-600 transition-colors mb-1.5">
                      {item.title}
                    </h2>
                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {/* Meta */}
                    <div className="flex items-center gap-2 mt-2.5 text-[11px] text-muted-light">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {timeAgo(item.pubDate)}
                      </span>
                    </div>
                  </div>
                  {/* External link icon */}
                  <div className="hidden sm:flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary-50">
                      <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary-600" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Empty */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <Newspaper className="w-12 h-12 text-muted-light mx-auto mb-3" />
              <p className="text-sm text-muted">
                {searchQuery ? "검색 결과가 없습니다." : "해당 카테고리의 뉴스가 없습니다."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
