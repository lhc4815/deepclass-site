-- =============================================
-- 학원 랭킹 후보풀 테이블
-- Supabase SQL Editor에서 실행해주세요
-- =============================================

CREATE TABLE IF NOT EXISTS academy_rankings (
  id BIGSERIAL PRIMARY KEY,
  area TEXT NOT NULL,           -- 지역 (강남구, 목동 등)
  name TEXT NOT NULL,           -- 학원 원래 이름
  short_name TEXT NOT NULL,     -- 축약 이름 (검색용)
  district TEXT,
  phone TEXT,
  established TEXT,
  trend_score REAL DEFAULT 0,   -- 최근 트렌드 점수
  prev_score REAL DEFAULT 0,    -- 이전 트렌드 점수
  weeks_in_pool INT DEFAULT 0,  -- 후보풀 체류 주수
  weeks_ranked INT DEFAULT 0,   -- TOP 30 진입 횟수
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(area, name)
);

CREATE INDEX idx_rankings_area ON academy_rankings(area, trend_score DESC);

ALTER TABLE academy_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rankings_read" ON academy_rankings FOR SELECT USING (true);
CREATE POLICY "rankings_write" ON academy_rankings FOR ALL USING (true);
