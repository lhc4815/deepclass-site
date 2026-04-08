-- =============================================
-- 학원 브랜드 정리 테이블 (AI 처리 결과)
-- Supabase SQL Editor에서 실행해주세요
-- =============================================

CREATE TABLE IF NOT EXISTS academy_brands (
  id BIGSERIAL PRIMARY KEY,
  area TEXT NOT NULL,
  original_name TEXT NOT NULL,
  common_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(area, original_name)
);

CREATE INDEX idx_brands_area ON academy_brands(area, brand);

ALTER TABLE academy_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_read" ON academy_brands FOR SELECT USING (true);
CREATE POLICY "brands_write" ON academy_brands FOR ALL USING (true);
