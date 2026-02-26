-- Stok Yönetimi Ürünler Tablosu
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  purchase_price NUMERIC DEFAULT 0,
  sale_price NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  unit TEXT DEFAULT 'adet',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi ürünlerini görebilir"
  ON products FOR ALL
  USING (auth.uid() = user_id);

-- Stok hareketi geçmişi (isteğe bağlı)
CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'in' | 'out' | 'adjustment'
  quantity INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi hareketlerini görebilir"
  ON stock_movements FOR ALL
  USING (auth.uid() = user_id);
