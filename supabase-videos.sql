-- =============================================
-- 유튜브 영상 캐시 테이블
-- Supabase SQL Editor에서 실행해주세요
-- =============================================

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY, -- YouTube video ID
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  channel_title TEXT,
  published_at TIMESTAMPTZ,
  video_url TEXT NOT NULL,
  category TEXT DEFAULT '전체',
  search_query TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_category ON videos(category, created_at DESC);
CREATE INDEX idx_videos_created ON videos(created_at DESC);

-- RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기
CREATE POLICY "videos_read" ON videos FOR SELECT USING (true);

-- 관리자만 쓰기
CREATE POLICY "videos_insert" ON videos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = '관리자')
);
CREATE POLICY "videos_delete" ON videos FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = '관리자')
);
