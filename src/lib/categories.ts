/**
 * 딥클래스 통합 카테고리 시스템
 * 뉴스, 영상, 커뮤니티에서 공통 사용
 */

// === 커뮤니티 게시판 ===
export const COMMUNITY_BOARDS = [
  // 전형별
  { id: "susi", label: "수시", group: "전형별" },
  { id: "jeongsi", label: "정시", group: "전형별" },
  { id: "nonseul", label: "논술", group: "전형별" },
  { id: "hakjong", label: "학종", group: "전형별" },
  // 계열별
  { id: "science", label: "이과", group: "계열별" },
  { id: "liberal", label: "문과", group: "계열별" },
  { id: "medical", label: "의약계열", group: "계열별" },  // 의대,치대,한의대,약대,수의대
  { id: "engineering", label: "공학/컴공", group: "계열별" },
  { id: "education", label: "교대/사범대", group: "계열별" },
  { id: "arts", label: "예체능", group: "계열별" },         // 미대,음대,체대
  { id: "nursing", label: "간호/보건", group: "계열별" },
  // 사용자별
  { id: "student", label: "수험생 자유", group: "사용자별" },
  { id: "parent", label: "학부모", group: "사용자별" },
  { id: "jaesoo", label: "재수/반수/N수", group: "사용자별" },
  // 대학별
  { id: "sky", label: "SKY", group: "대학별" },              // 서울대,고려대,연세대
  { id: "inseoul", label: "인서울 주요대", group: "대학별" }, // 서성한,중경외시 등
  { id: "medical-univ", label: "의치한약수", group: "대학별" },
  // 일반
  { id: "free", label: "자유게시판", group: "일반" },
  { id: "qna", label: "질문&답변", group: "일반" },
  { id: "review", label: "합격후기/수기", group: "일반" },
  { id: "study", label: "공부법/자료", group: "일반" },
];

// === 뉴스 카테고리 ===
export const NEWS_CATEGORIES = [
  { id: "전체", label: "전체" },
  { id: "수시", label: "수시" },
  { id: "정시", label: "정시" },
  { id: "논술", label: "논술" },
  { id: "학종", label: "학종" },
  { id: "내신", label: "내신" },
  { id: "의대", label: "의약계열" },
  { id: "교대", label: "교대/사범" },
  { id: "예체능", label: "예체능" },
];

// === 영상 카테고리 ===
export const VIDEO_CATEGORIES = [
  { id: "전체", label: "전체" },
  { id: "수시전략", label: "수시전략" },
  { id: "정시전략", label: "정시전략" },
  { id: "면접준비", label: "면접준비" },
  { id: "논술", label: "논술" },
  { id: "학습법", label: "학습법" },
  { id: "의약계열", label: "의약계열" },
  { id: "대학탐방", label: "대학탐방" },
];

// === 게시판 색상 ===
export const BOARD_COLORS: Record<string, string> = {
  // 전형별
  susi: "bg-blue-100 text-blue-700",
  jeongsi: "bg-rose-100 text-rose-700",
  nonseul: "bg-purple-100 text-purple-700",
  hakjong: "bg-teal-100 text-teal-700",
  // 계열별
  science: "bg-indigo-100 text-indigo-700",
  liberal: "bg-amber-100 text-amber-700",
  medical: "bg-red-100 text-red-700",
  engineering: "bg-cyan-100 text-cyan-700",
  education: "bg-lime-100 text-lime-700",
  arts: "bg-pink-100 text-pink-700",
  nursing: "bg-emerald-100 text-emerald-700",
  // 사용자별
  student: "bg-sky-100 text-sky-700",
  parent: "bg-green-100 text-green-700",
  jaesoo: "bg-orange-100 text-orange-700",
  // 대학별
  sky: "bg-violet-100 text-violet-700",
  "inseoul": "bg-fuchsia-100 text-fuchsia-700",
  "medical-univ": "bg-red-100 text-red-700",
  // 일반
  free: "bg-gray-100 text-gray-700",
  qna: "bg-yellow-100 text-yellow-700",
  review: "bg-emerald-100 text-emerald-700",
  study: "bg-blue-100 text-blue-700",
};

// === 게시판 라벨 맵 ===
export const BOARD_LABELS: Record<string, string> = Object.fromEntries(
  COMMUNITY_BOARDS.map((b) => [b.id, b.label])
);

// === 뉴스 카테고리 색상 ===
export const NEWS_CATEGORY_COLORS: Record<string, string> = {
  "전체": "bg-gray-100 text-gray-600",
  "수시": "bg-blue-100 text-blue-700",
  "정시": "bg-rose-100 text-rose-700",
  "논술": "bg-purple-100 text-purple-700",
  "학종": "bg-teal-100 text-teal-700",
  "내신": "bg-amber-100 text-amber-700",
  "의대": "bg-red-100 text-red-700",
  "교대": "bg-lime-100 text-lime-700",
  "예체능": "bg-pink-100 text-pink-700",
};
