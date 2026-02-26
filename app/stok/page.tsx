"use client";

import { useState, useEffect } from "react";
import {
  Package, Plus, Minus, Trash2, Edit3, Save, X, AlertTriangle,
  Search, RefreshCw, CheckCircle2, ChevronDown, BarChart3, ArrowUp, ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  purchase_price: number;
  sale_price: number;
  stock: number;
  min_stock: number;
  unit: string;
  notes: string;
  created_at: string;
}

const EMPTY_FORM = {
  name: "", sku: "", category: "", purchase_price: "",
  sale_price: "", stock: "", min_stock: "5", unit: "adet", notes: "",
};

const CATEGORIES = ["Elektronik", "Giyim", "Ev & Yaşam", "Kozmetik", "Spor", "Oyuncak", "Kitap", "Gıda", "Diğer"];

export default function StokPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tümü");
  const [filterStok, setFilterStok] = useState("Tümü");
  const [adjustId, setAdjustId] = useState<number | null>(null);
  const [adjustQty, setAdjustQty] = useState("1");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => { loadProducts(); }, []);

  const getSupabase = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    return createClient();
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts((data || []) as Product[]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name, sku: p.sku || "", category: p.category || "",
      purchase_price: String(p.purchase_price || ""),
      sale_price: String(p.sale_price || ""),
      stock: String(p.stock), min_stock: String(p.min_stock),
      unit: p.unit || "adet", notes: p.notes || "",
    });
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const supabase = await getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        user_id: user?.id,
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        purchase_price: Number(form.purchase_price) || 0,
        sale_price: Number(form.sale_price) || 0,
        stock: Number(form.stock) || 0,
        min_stock: Number(form.min_stock) || 5,
        unit: form.unit,
        notes: form.notes.trim(),
      };

      if (editId) {
        await supabase.from("products").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editId);
        showToast("Ürün güncellendi ✓");
      } else {
        await supabase.from("products").insert(payload);
        showToast("Ürün eklendi ✓");
      }

      setShowForm(false);
      await loadProducts();
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
    const supabase = await getSupabase();
    await supabase.from("products").delete().eq("id", id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Ürün silindi.");
  };

  const adjustStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    const supabase = await getSupabase();
    await supabase.from("products").update({ stock: newStock, updated_at: new Date().toISOString() }).eq("id", product.id);

    // Stok hareketi kaydet
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("stock_movements").insert({
      user_id: user?.id,
      product_id: product.id,
      type: delta > 0 ? "in" : "out",
      quantity: Math.abs(delta),
      note: delta > 0 ? "Manuel stok girişi" : "Manuel stok çıkışı",
    });

    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
    showToast(delta > 0 ? `+${delta} stok eklendi` : `${Math.abs(delta)} stok düşüldü`);
    setAdjustId(null);
  };

  const manualAdjust = async (product: Product, type: "in" | "out") => {
    const qty = Number(adjustQty);
    if (!qty || qty <= 0) return;
    await adjustStock(product, type === "in" ? qty : -qty);
  };

  // Filtreleme
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCategory === "Tümü" || p.category === filterCategory;
    const matchStok = filterStok === "Tümü" ||
      (filterStok === "Kritik" && p.stock <= p.min_stock) ||
      (filterStok === "Normal" && p.stock > p.min_stock);
    return matchSearch && matchCat && matchStok;
  });

  // İstatistikler
  const totalProducts = products.length;
  const criticalCount = products.filter(p => p.stock <= p.min_stock).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.purchase_price), 0);

  const getStockBadge = (p: Product) => {
    if (p.stock === 0) return { label: "Tükendi", cls: "bg-red-100 text-red-700 border-red-200" };
    if (p.stock <= p.min_stock) return { label: "Kritik", cls: "bg-orange-100 text-orange-700 border-orange-200" };
    return { label: "Normal", cls: "bg-green-100 text-green-700 border-green-200" };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}

      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Stok Yönetimi</h2>
          <p className="text-slate-500 mt-1">Ürünlerini ekle, stoklarını takip et.</p>
        </div>
        <Button onClick={openAdd} className="bg-green-600 hover:bg-green-700 gap-2 shadow-sm">
          <Plus size={16} /> Ürün Ekle
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Toplam Ürün" value={totalProducts} icon={<Package size={18} className="text-slate-600" />} color="bg-slate-50" />
        <StatCard label="Kritik Stok" value={criticalCount} icon={<AlertTriangle size={18} className="text-orange-500" />} color="bg-orange-50" highlight={criticalCount > 0} />
        <StatCard label="Tükenen" value={outOfStock} icon={<X size={18} className="text-red-500" />} color="bg-red-50" highlight={outOfStock > 0} />
        <StatCard label="Stok Değeri" value={`${totalValue.toLocaleString("tr-TR")} ₺`} icon={<BarChart3 size={18} className="text-green-600" />} color="bg-green-50" />
      </div>

      {/* Kritik Stok Uyarısı */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800">
          <AlertTriangle size={18} className="flex-shrink-0 text-orange-500" />
          <p className="text-sm font-medium">
            <strong>{criticalCount} ürün</strong> kritik stok seviyesinde veya tükendi. Hemen sipariş ver!
          </p>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Ürün ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 bg-slate-50 border-slate-200 h-9"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>Tümü</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={filterStok}
          onChange={e => setFilterStok(e.target.value)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>Tümü</option>
          <option>Kritik</option>
          <option>Normal</option>
        </select>
        <button onClick={loadProducts} className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Ürün Tablosu */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <RefreshCw size={24} className="animate-spin mr-3" /> Yükleniyor...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center">
              <Package size={48} className="mb-4 text-slate-200" />
              <p className="font-medium">Ürün bulunamadı.</p>
              <p className="text-sm mt-1">Yeni ürün eklemek için "Ürün Ekle" butonunu kullan.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div className="col-span-4">Ürün</div>
                <div className="col-span-2">Kategori</div>
                <div className="col-span-2 text-right">Fiyat</div>
                <div className="col-span-2 text-center">Stok</div>
                <div className="col-span-2 text-right">İşlemler</div>
              </div>

              {filtered.map(product => {
                const badge = getStockBadge(product);
                const margin = product.sale_price && product.purchase_price
                  ? Math.round(((product.sale_price - product.purchase_price) / product.sale_price) * 100)
                  : null;

                return (
                  <div key={product.id} className={`px-5 py-4 hover:bg-slate-50 transition-colors ${product.stock === 0 ? "opacity-75" : ""}`}>
                    <div className="grid grid-cols-12 gap-3 items-center">
                      {/* Ürün Adı */}
                      <div className="col-span-12 md:col-span-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            product.stock === 0 ? "bg-red-100" : product.stock <= product.min_stock ? "bg-orange-100" : "bg-green-100"
                          }`}>
                            <Package size={18} className={
                              product.stock === 0 ? "text-red-500" : product.stock <= product.min_stock ? "text-orange-500" : "text-green-600"
                            } />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{product.name}</p>
                            <p className="text-xs text-slate-400">{product.sku || "—"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Kategori */}
                      <div className="hidden md:block col-span-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{product.category || "—"}</span>
                      </div>

                      {/* Fiyat */}
                      <div className="hidden md:block col-span-2 text-right">
                        <p className="font-semibold text-slate-800">{product.sale_price?.toLocaleString("tr-TR")} ₺</p>
                        {margin !== null && (
                          <p className="text-xs text-green-600">%{margin} marj</p>
                        )}
                      </div>

                      {/* Stok */}
                      <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-1">
                        {adjustId === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => manualAdjust(product, "out")}
                              className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <Input
                              type="number"
                              value={adjustQty}
                              onChange={e => setAdjustQty(e.target.value)}
                              className="w-14 h-7 text-center text-sm p-1 border-slate-300"
                              min="1"
                            />
                            <button
                              onClick={() => manualAdjust(product, "in")}
                              className="w-7 h-7 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                            <button onClick={() => setAdjustId(null)} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center">
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setAdjustId(product.id); setAdjustQty("1"); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <span className={`text-lg font-bold ${
                              product.stock === 0 ? "text-red-600" :
                              product.stock <= product.min_stock ? "text-orange-600" :
                              "text-slate-800"
                            }`}>
                              {product.stock}
                            </span>
                            <span className="text-xs text-slate-400">{product.unit}</span>
                          </button>
                        )}
                      </div>

                      {/* İşlemler */}
                      <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Ürün Ekle / Düzenle */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package size={18} className="text-green-600" />
                  {editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                </span>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Ürün Adı *</label>
                  <Input
                    placeholder="örn: Bluetooth Kulaklık"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="bg-slate-50"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">SKU / Barkod</label>
                  <Input placeholder="BT-001" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kategori</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seç...</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Alış Fiyatı (₺)</label>
                  <Input type="number" placeholder="0" value={form.purchase_price} onChange={e => setForm(f => ({ ...f, purchase_price: e.target.value }))} className="bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Satış Fiyatı (₺)</label>
                  <Input type="number" placeholder="0" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} className="bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Mevcut Stok</label>
                  <Input type="number" placeholder="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kritik Stok Eşiği</label>
                  <Input type="number" placeholder="5" value={form.min_stock} onChange={e => setForm(f => ({ ...f, min_stock: e.target.value }))} className="bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Birim</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {["adet", "kg", "litre", "metre", "paket", "kutu", "çift"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Notlar</label>
                  <Input placeholder="Tedarikçi adı, raf numarası vb." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="bg-slate-50" />
                </div>
              </div>

              {/* Kar Marjı Önizleme */}
              {form.purchase_price && form.sale_price && Number(form.sale_price) > 0 && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-sm">
                  <BarChart3 size={15} className="text-green-600" />
                  <span className="text-green-800">
                    Tahmini kar marjı:{" "}
                    <strong>
                      %{Math.round(((Number(form.sale_price) - Number(form.purchase_price)) / Number(form.sale_price)) * 100)}
                    </strong>{" "}
                    • Adet başı kar:{" "}
                    <strong>{(Number(form.sale_price) - Number(form.purchase_price)).toLocaleString("tr-TR")} ₺</strong>
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={saveProduct} disabled={saving || !form.name.trim()} className="bg-green-600 hover:bg-green-700 gap-2 flex-1">
                  {saving ? <><RefreshCw size={14} className="animate-spin" /> Kaydediliyor...</> : <><Save size={14} /> {editId ? "Güncelle" : "Ürünü Ekle"}</>}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="border-slate-200">
                  İptal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, highlight }: any) {
  return (
    <Card className={`border-slate-200 shadow-sm ${highlight ? "ring-2 ring-orange-400" : ""}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
