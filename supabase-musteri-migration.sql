-- Müşteri Notları Tablosu
-- (Müşteri listesi orders tablosundan türetilir, notlar ayrı tutulur)
CREATE TABLE IF NOT EXISTS customer_notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi notlarını görebilir"
  ON customer_notes FOR ALL
  USING (auth.uid() = user_id);
