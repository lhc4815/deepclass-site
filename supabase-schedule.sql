-- =============================================
-- 입시 일정 테이블
-- Supabase SQL Editor에서 실행해주세요
-- =============================================

CREATE TABLE IF NOT EXISTS schedules (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  end_date DATE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '기타' CHECK (type IN ('수능', '원서접수', '전형', '합격발표', '등록', '발표', '모집', '기타')),
  category TEXT NOT NULL DEFAULT '공통' CHECK (category IN ('공통', '수시', '정시')),
  important BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schedules_date ON schedules(date ASC);

-- RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기
CREATE POLICY "schedules_read" ON schedules FOR SELECT USING (true);

-- 관리자만 쓰기 (service_role 키 사용 또는 프로필 user_type 확인)
CREATE POLICY "schedules_insert" ON schedules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = '관리자')
);
CREATE POLICY "schedules_update" ON schedules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = '관리자')
);
CREATE POLICY "schedules_delete" ON schedules FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = '관리자')
);

-- 기본 데이터 삽입 (2027학년도)
INSERT INTO schedules (date, end_date, title, type, category, important, description) VALUES
  ('2026-04-30', NULL, '2027학년도 대입전형 시행계획 발표', '발표', '공통', true, '교육부 및 한국대학교육협의회 발표'),
  ('2026-05-31', NULL, '대학별 모집요강 발표', '발표', '공통', true, NULL),
  ('2026-06-05', NULL, '6월 수능 모의평가', '수능', '공통', true, '한국교육과정평가원 주관'),
  ('2026-07-06', '2026-07-10', '재외국민·외국인 특별전형 원서접수', '원서접수', '수시', false, NULL),
  ('2026-09-03', NULL, '9월 수능 모의평가', '수능', '공통', true, '한국교육과정평가원 주관'),
  ('2026-09-07', '2026-09-11', '수시 모집 입학원서 접수', '원서접수', '수시', true, '전국 대학 수시 원서접수 기간'),
  ('2026-09-12', '2026-12-17', '논술·면접 등 대학별고사 및 서류평가', '전형', '수시', true, NULL),
  ('2026-11-19', NULL, '2027학년도 대학수학능력시험', '수능', '공통', true, '수능 당일'),
  ('2026-12-11', NULL, '수능 성적 통지', '발표', '공통', true, NULL),
  ('2026-12-18', NULL, '수시 최초 합격자 발표', '합격발표', '수시', true, NULL),
  ('2026-12-21', '2026-12-23', '수시 합격자 등록', '등록', '수시', true, NULL),
  ('2026-12-29', NULL, '수시 미등록 결원 충원 마감 (18시)', '합격발표', '수시', false, NULL),
  ('2027-01-04', '2027-01-07', '정시 입학원서 접수', '원서접수', '정시', true, '전국 대학 정시 원서접수 기간'),
  ('2027-01-11', '2027-01-17', '정시 가군 학생선발', '전형', '정시', true, NULL),
  ('2027-01-18', '2027-01-24', '정시 나군 학생선발', '전형', '정시', true, NULL),
  ('2027-01-25', '2027-01-31', '정시 다군 학생선발', '전형', '정시', false, NULL),
  ('2027-02-10', '2027-02-12', '정시 최초 합격자 등록', '등록', '정시', true, NULL),
  ('2027-02-13', '2027-02-17', '정시 미등록 결원 충원', '합격발표', '정시', false, NULL),
  ('2027-02-19', '2027-02-26', '추가 모집', '모집', '정시', false, NULL);
