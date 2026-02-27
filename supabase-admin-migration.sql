-- ============================================================
-- Admin & Error Logging Migration
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. Uygulama hata logu tablosu
CREATE TABLE IF NOT EXISTS app_errors (
  id          BIGSERIAL PRIMARY KEY,
  message     TEXT,
  path        TEXT,
  stack       TEXT,
  user_email  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- app_errors için RLS — sadece service role okuyabilir
ALTER TABLE app_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON app_errors USING (false);

-- ============================================================
-- 2. Orders tablosuna user_id ekle (eğer yoksa)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Orders tablosu RLS aktif et
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Mevcut eski politikaları temizle
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON orders;

-- Yeni RLS politikaları — kullanıcı sadece kendi siparişlerini görsün
CREATE POLICY "Users can view own orders"   ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own orders" ON orders FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. Analysis history tablosu RLS (zaten varsa güncelle)
-- ============================================================
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own analyses" ON analysis_history;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analysis_history;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analysis_history;

CREATE POLICY "Users can view own analyses"   ON analysis_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON analysis_history FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- NOT: Bu migration çalıştıktan sonra mevcut test/demo verileri
-- user_id NULL olacağından hiçbir kullanıcıya görünmeyecektir.
-- Bu istenen davranıştır — yeni kayıt olan sıfırdan başlar.
-- ============================================================
