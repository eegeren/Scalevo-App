-- Pazaryeri Siparişleri Tablosu
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'trendyol' | 'hepsiburada'
  external_id TEXT NOT NULL,
  status TEXT,
  customer_name TEXT,
  total_price NUMERIC,
  currency TEXT DEFAULT 'TRY',
  items JSONB,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, external_id)
);

-- Pazaryeri Ürünleri Tablosu
CREATE TABLE IF NOT EXISTS marketplace_products (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_id TEXT NOT NULL,
  barcode TEXT,
  title TEXT,
  price NUMERIC,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, external_id)
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi siparişlerini görebilir"
  ON marketplace_orders FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi ürünlerini görebilir"
  ON marketplace_products FOR ALL
  USING (auth.uid() = user_id);
