"use client";

import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Flame,
  PenSquare,
  ChevronRight,
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  ArrowUpRight,
  MessageCircle,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";

/* ── 게시판 카테고리 (카테고리별 + 사용자유형별 혼합) ── */
const boards = [
  { id: "all", label: "전체", icon: MessageSquare },
  { id: "susi", label: "수시", icon: BookOpen },
  { id: "jeongsi", label: "정시", icon: BookOpen },
  { id: "nonseul", label: "논술", icon: BookOpen },
  { id: "hakjong", label: "학종", icon: BookOpen },
  { id: "pyeonip", label: "편입", icon: BookOpen },
  { id: "student", label: "학생게시판", icon: GraduationCap },
  { id: "parent", label: "학부모게시판", icon: Users },
  { id: "free", label: "자유게시판", icon: MessageCircle },
  { id: "qna", label: "질문&답변", icon: MessageSquare },
];

const sortOptions = ["최신순", "인기순", "댓글순"];

/* ── 실시간 인기글 ── */
const hotPosts = [
  { id: 1, title: "내신 2.3인데 서울 상위권 가능할까요?", likes: 342, comments: 89, board: "수시" },
  { id: 2, title: "올해 수능 국어 체감 난이도 공유", likes: 287, comments: 124, board: "정시" },
  { id: 3, title: "학종 세특 어떻게 채우셨나요? (이과)", likes: 256, comments: 67, board: "학종" },
  { id: 4, title: "재수 결심했는데 학부모님들 경험담 부탁드려요", likes: 198, comments: 93, board: "학부모게시판" },
  { id: 5, title: "의대 논술 준비 타임라인 공유합니다", likes: 176, comments: 45, board: "논술" },
];

/* ── 게시글 목록 ── */
const mockPosts = [
  {
    id: 1,
    board: "susi",
    boardLabel: "수시",
    title: "내신 2.3인데 서울 상위권 가능할까요? 선배님들 조언 부탁드립니다",
    preview: "현재 고2이고 내신 2.3입니다. 학종으로 서울 상위권 대학을 목표로 하고 있는데, 비교과 활동은 꽤 탄탄하게 준비하고 있습니다...",
    author: "입시고민중",
    authorType: "학생",
    date: "30분 전",
    views: 1234,
    likes: 342,
    comments: 89,
    hot: true,
    pinned: false,
  },
  {
    id: 2,
    board: "jeongsi",
    boardLabel: "정시",
    title: "올해 수능 국어 체감 난이도 공유해요",
    preview: "6월 모의고사 국어 풀어보신 분들 체감 난이도 어떠셨나요? 작년보다 비문학이 까다로웠다는 의견이 많은데...",
    author: "수능전사",
    authorType: "학생",
    date: "1시간 전",
    views: 987,
    likes: 287,
    comments: 124,
    hot: true,
    pinned: false,
  },
  {
    id: 3,
    board: "hakjong",
    boardLabel: "학종",
    title: "학종 세특 어떻게 채우셨나요? 이과 경험담 구합니다",
    preview: "고1 이과인데 세특을 어떻게 채워야 할지 막막합니다. 선배님들 경험을 공유해주시면 감사하겠습니다...",
    author: "세특고민",
    authorType: "학생",
    date: "2시간 전",
    views: 756,
    likes: 256,
    comments: 67,
    hot: false,
    pinned: false,
  },
  {
    id: 4,
    board: "parent",
    boardLabel: "학부모게시판",
    title: "재수 결심한 아이, 학부모로서 어떻게 지원해야 할까요?",
    preview: "아이가 재수를 결심했습니다. 처음 겪는 일이라 어떻게 도와줘야 할지... 경험 있으신 학부모님들의 조언이 절실합니다.",
    author: "응원하는엄마",
    authorType: "학부모",
    date: "3시간 전",
    views: 654,
    likes: 198,
    comments: 93,
    hot: false,
    pinned: false,
  },
  {
    id: 5,
    board: "nonseul",
    boardLabel: "논술",
    title: "의대 논술 준비 타임라인 공유합니다 (합격 후기)",
    preview: "작년에 논술로 의대 합격한 학생입니다. 4월부터 11월까지의 준비 과정을 타임라인으로 정리해봤어요...",
    author: "논술합격생",
    authorType: "학생",
    date: "5시간 전",
    views: 2341,
    likes: 176,
    comments: 45,
    hot: false,
    pinned: false,
  },
  {
    id: 6,
    board: "qna",
    boardLabel: "질문&답변",
    title: "수시 6장 어떻게 조합하는게 좋을까요? (성적표 첨부)",
    preview: "내신 1.8 / 모의고사 2등급대입니다. 수시 6장을 어떻게 조합하면 좋을지 고민이 됩니다...",
    author: "입시초보",
    authorType: "학생",
    date: "6시간 전",
    views: 432,
    likes: 87,
    comments: 34,
    hot: false,
    pinned: false,
  },
  {
    id: 7,
    board: "free",
    boardLabel: "자유게시판",
    title: "입시 스트레스 해소법 공유해요 🙌",
    preview: "매일 공부만 하다 보면 지치잖아요. 저는 주말에 30분씩 산책하는게 도움이 되더라고요. 다른 분들은 어떻게 스트레스를 푸시나요?",
    author: "힐링타임",
    authorType: "학생",
    date: "8시간 전",
    views: 321,
    likes: 145,
    comments: 56,
    hot: false,
    pinned: false,
  },
];

const boardColors: Record<string, string> = {
  "수시": "bg-blue-50 text-blue-600 border-blue-100",
  "정시": "bg-rose-50 text-rose-600 border-rose-100",
  "논술": "bg-purple-50 text-purple-600 border-purple-100",
  "학종": "bg-teal-50 text-teal-600 border-teal-100",
  "편입": "bg-amber-50 text-amber-600 border-amber-100",
  "학생게시판": "bg-indigo-50 text-indigo-600 border-indigo-100",
  "학부모게시판": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "자유게시판": "bg-gray-50 text-gray-600 border-gray-100",
  "질문&답변": "bg-orange-50 text-orange-600 border-orange-100",
};

const authorTypeColors: Record<string, string> = {
  "학생": "bg-indigo-50 text-indigo-600",
  "학부모": "bg-emerald-50 text-emerald-600",
  "선생님": "bg-amber-50 text-amber-600",
};

function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "만";
  if (n >= 1000) return (n / 1000).toFixed(1) + "천";
  return String(n);
}

export default function CommunityPage() {
  const [activeBoard, setActiveBoard] = useState("all");
  const [activeSort, setActiveSort] = useState("최신순");

  const filteredPosts =
    activeBoard === "all"
      ? mockPosts
      : mockPosts.filter((p) => p.board === activeBoard);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">커뮤니티</h1>
          <p className="text-sm text-muted mt-0.5">
            입시에 대한 이야기를 나눠보세요
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20">
          <PenSquare className="w-4 h-4" />
          글쓰기
        </button>
      </div>

      {/* Top: 실시간 인기글 */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
          <div className="w-7 h-7 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-semibold">실시간 인기글</h2>
          <span className="text-[10px] text-muted-light ml-1">지금 가장 뜨거운 글</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border-light">
          {hotPosts.map((post, i) => (
            <div
              key={post.id}
              className="px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-extrabold ${i < 3 ? "text-rose-500" : "text-muted-light"}`}>
                  {i + 1}
                </span>
                <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded border ${boardColors[post.board] || ""}`}>
                  {post.board}
                </span>
              </div>
              <p className="text-[12px] font-medium line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-light">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp className="w-3 h-3" />{post.likes}
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="w-3 h-3" />{post.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Board Nav (sidebar style) */}
        <div className="lg:col-span-3 xl:col-span-2">
          <div className="bg-surface rounded-2xl border border-border p-3 space-y-0.5 lg:sticky lg:top-20">
            <p className="px-3 pt-1 pb-2 text-[10px] font-semibold text-muted-light uppercase tracking-widest">
              게시판
            </p>
            {boards.map((board) => {
              const active = activeBoard === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => setActiveBoard(board.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <board.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary-500" : ""}`} />
                  {board.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Post List */}
        <div className="lg:col-span-9 xl:col-span-10 space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveSort(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeSort === opt
                      ? "bg-foreground text-white"
                      : "bg-surface border border-border text-muted hover:border-primary-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
              <input
                type="text"
                placeholder="게시글 검색..."
                className="pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 w-48 transition-all"
              />
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-surface rounded-2xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-primary-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${boardColors[post.boardLabel] || ""}`}>
                        {post.boardLabel}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${authorTypeColors[post.authorType] || ""}`}>
                        {post.authorType}
                      </span>
                      {post.hot && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded border border-rose-100">
                          <Flame className="w-2.5 h-2.5" /> HOT
                        </span>
                      )}
                    </div>
                    {/* Title */}
                    <h3 className="text-[14px] font-semibold leading-snug group-hover:text-primary-600 transition-colors mb-1">
                      {post.title}
                    </h3>
                    {/* Preview */}
                    <p className="text-[12px] text-muted leading-relaxed line-clamp-1">
                      {post.preview}
                    </p>
                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-light">
                      <span className="font-medium text-muted">{post.author}</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />{post.date}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />{formatNumber(post.views)}
                      </span>
                    </div>
                  </div>

                  {/* Right stats */}
                  <div className="hidden sm:flex flex-col items-center gap-3 pl-4 border-l border-border-light min-w-[60px]">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-rose-500">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{post.likes}</span>
                      </div>
                      <span className="text-[9px] text-muted-light">좋아요</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-primary-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{post.comments}</span>
                      </div>
                      <span className="text-[9px] text-muted-light">댓글</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-2">
            <button className="px-6 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium text-muted hover:bg-surface-hover hover:border-primary-200 transition-all duration-200">
              더 많은 글 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
