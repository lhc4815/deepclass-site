/**
 * 2027학년도 대학입시 주요 일정
 * 출처: 한국대학교육협의회, 교육부 대입전형시행계획
 */

export interface ScheduleItem {
  id: string;
  date: string;        // YYYY-MM-DD (시작일)
  endDate?: string;    // YYYY-MM-DD (종료일, 기간인 경우)
  title: string;
  type: "수능" | "원서접수" | "전형" | "합격발표" | "등록" | "발표" | "모집" | "기타";
  category: "공통" | "수시" | "정시";
  important: boolean;
  description?: string;
}

export const SCHEDULE_2027: ScheduleItem[] = [
  // === 공통 ===
  {
    id: "s1",
    date: "2026-04-30",
    title: "2027학년도 대입전형 시행계획 발표",
    type: "발표",
    category: "공통",
    important: true,
    description: "교육부 및 한국대학교육협의회 발표",
  },
  {
    id: "s2",
    date: "2026-05-31",
    title: "대학별 모집요강 발표",
    type: "발표",
    category: "공통",
    important: true,
  },
  {
    id: "s3",
    date: "2026-06-05",
    title: "6월 수능 모의평가",
    type: "수능",
    category: "공통",
    important: true,
    description: "한국교육과정평가원 주관",
  },
  {
    id: "s4",
    date: "2026-09-03",
    title: "9월 수능 모의평가",
    type: "수능",
    category: "공통",
    important: true,
    description: "한국교육과정평가원 주관",
  },
  {
    id: "s5",
    date: "2026-11-19",
    title: "2027학년도 대학수학능력시험",
    type: "수능",
    category: "공통",
    important: true,
    description: "수능 당일",
  },
  {
    id: "s6",
    date: "2026-12-11",
    title: "수능 성적 통지",
    type: "발표",
    category: "공통",
    important: true,
  },

  // === 수시 ===
  {
    id: "su1",
    date: "2026-07-06",
    endDate: "2026-07-10",
    title: "재외국민·외국인 특별전형 원서접수",
    type: "원서접수",
    category: "수시",
    important: false,
  },
  {
    id: "su2",
    date: "2026-09-07",
    endDate: "2026-09-11",
    title: "수시 모집 입학원서 접수",
    type: "원서접수",
    category: "수시",
    important: true,
    description: "전국 대학 수시 원서접수 기간",
  },
  {
    id: "su3",
    date: "2026-09-12",
    endDate: "2026-12-17",
    title: "논술·면접 등 대학별고사 및 서류평가",
    type: "전형",
    category: "수시",
    important: true,
  },
  {
    id: "su4",
    date: "2026-12-18",
    title: "수시 최초 합격자 발표",
    type: "합격발표",
    category: "수시",
    important: true,
  },
  {
    id: "su5",
    date: "2026-12-21",
    endDate: "2026-12-23",
    title: "수시 합격자 등록",
    type: "등록",
    category: "수시",
    important: true,
  },
  {
    id: "su6",
    date: "2026-12-29",
    title: "수시 미등록 결원 충원 마감 (18시)",
    type: "합격발표",
    category: "수시",
    important: false,
  },

  // === 정시 ===
  {
    id: "js1",
    date: "2027-01-04",
    endDate: "2027-01-07",
    title: "정시 입학원서 접수",
    type: "원서접수",
    category: "정시",
    important: true,
    description: "전국 대학 정시 원서접수 기간",
  },
  {
    id: "js2",
    date: "2027-01-11",
    endDate: "2027-01-17",
    title: "정시 '가'군 학생선발",
    type: "전형",
    category: "정시",
    important: true,
  },
  {
    id: "js3",
    date: "2027-01-18",
    endDate: "2027-01-24",
    title: "정시 '나'군 학생선발",
    type: "전형",
    category: "정시",
    important: true,
  },
  {
    id: "js4",
    date: "2027-01-25",
    endDate: "2027-01-31",
    title: "정시 '다'군 학생선발",
    type: "전형",
    category: "정시",
    important: false,
  },
  {
    id: "js5",
    date: "2027-02-10",
    endDate: "2027-02-12",
    title: "정시 최초 합격자 등록",
    type: "등록",
    category: "정시",
    important: true,
  },
  {
    id: "js6",
    date: "2027-02-13",
    endDate: "2027-02-17",
    title: "정시 미등록 결원 충원",
    type: "합격발표",
    category: "정시",
    important: false,
  },
  {
    id: "js7",
    date: "2027-02-19",
    endDate: "2027-02-26",
    title: "추가 모집",
    type: "모집",
    category: "정시",
    important: false,
  },
];

/** D-day 계산 */
export function getDday(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

/** 다가오는 일정 (오늘 이후) 가져오기 */
export function getUpcomingSchedules(limit = 10): ScheduleItem[] {
  const today = new Date().toISOString().split("T")[0];
  return SCHEDULE_2027
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/** 전체 일정 */
export function getAllSchedules(): ScheduleItem[] {
  return [...SCHEDULE_2027].sort((a, b) => a.date.localeCompare(b.date));
}
