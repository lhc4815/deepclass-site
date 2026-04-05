/**
 * 입시 뉴스 RSS 소스 목록
 * Google News RSS를 활용하여 키워드별로 입시 뉴스를 수집
 */

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
}

// Google News RSS는 키워드 기반으로 뉴스를 제공 (API 키 불필요)
export const RSS_SOURCES: NewsSource[] = [
  {
    id: "google-ipsi",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=대학입시&hl=ko&gl=KR&ceid=KR:ko",
    category: "전체",
  },
  {
    id: "google-susi",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=수시+입시&hl=ko&gl=KR&ceid=KR:ko",
    category: "수시",
  },
  {
    id: "google-jeongsi",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=정시+수능&hl=ko&gl=KR&ceid=KR:ko",
    category: "정시",
  },
  {
    id: "google-nonseul",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=논술전형&hl=ko&gl=KR&ceid=KR:ko",
    category: "논술",
  },
  {
    id: "google-hakjong",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=학생부종합전형&hl=ko&gl=KR&ceid=KR:ko",
    category: "학종",
  },
  {
    id: "google-naesin",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=내신+등급+입시&hl=ko&gl=KR&ceid=KR:ko",
    category: "내신",
  },
  {
    id: "google-uidae",
    name: "Google 뉴스",
    url: "https://news.google.com/rss/search?q=의대+입시&hl=ko&gl=KR&ceid=KR:ko",
    category: "의대",
  },
];

/** 네이버 뉴스 검색 API 키워드 */
export const NAVER_KEYWORDS = [
  { keyword: "대학입시", category: "전체" },
  { keyword: "수시 전형", category: "수시" },
  { keyword: "정시 수능", category: "정시" },
  { keyword: "논술전형", category: "논술" },
  { keyword: "학생부종합전형", category: "학종" },
  { keyword: "내신 등급 입시", category: "내신" },
  { keyword: "의대 입시", category: "의대" },
];

/** 공통 뉴스 아이템 타입 */
export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  source: string;
  category: string;
  pubDate: string;
  imageUrl?: string;
  provider: "rss" | "naver";
}
