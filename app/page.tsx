"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BrainCircuit, AlertCircle, DollarSign, Package, TrendingUp, ShoppingBag, BarChart2, Clock,
  ArrowUpRight, CheckCircle2, Truck, Share2, Copy, Check, Rocket, Store, RefreshCw,
  Calculator, ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import SifirdanWizard from "./SifirdanWizard"

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi Günler";
  return "İyi Akşamlar";
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Yeni", color: "bg-green-100 text-green-700" },
  preparing: { label: "Hazırlanıyor", color: "bg-orange-100 text-orange-700" },
  shipped: { label: "Kargoda", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Tamamlandı", color: "bg-slate-100 text-slate-600" },
};

const KOMISYON_ORANLARI: Record<string, number> = {
  elektronik: 10, giyim: 20, "ev-yasam": 15, "evcil-hayvan": 15,
  "bebek-cocuk": 13, spor: 15, kozmetik: 18, gida: 13,
};

const KATEGORILER = [
  { id: "elektronik",    label: "📱 Elektronik",       ornekler: ["Bluetooth Kulaklık", "Powerbank", "USB Hub", "Şarj Standı"] },
  { id: "giyim",         label: "👗 Giyim",             ornekler: ["Oversize Tişört", "Keten Pantolon", "Kaban", "Bere"] },
  { id: "ev-yasam",      label: "🏠 Ev & Yaşam",        ornekler: ["Bambu Kesme Tahtası", "Mum Seti", "Yastık Kılıfı", "Ahşap Kaşık"] },
  { id: "evcil-hayvan",  label: "🐾 Evcil Hayvan",      ornekler: ["Kedi Su Pınarı", "Köpek Tasması", "Mama Kabı", "Kedi Tarağı"] },
  { id: "bebek-cocuk",   label: "👶 Bebek & Çocuk",     ornekler: ["Bebek Bezi", "Diş Kaşıyıcı", "Uyku Tulumu", "Oyuncak"] },
  { id: "spor",          label: "🏋️ Spor",              ornekler: ["Yoga Matı", "Direnç Bandı", "Protein Shaker", "Koşu Çorabı"] },
  { id: "kozmetik",      label: "💄 Kozmetik",          ornekler: ["Saç Serumu", "Yüz Maskesi", "Dudak Balmı", "Nemlendirici"] },
  { id: "gida",          label: "🍎 Gıda",              ornekler: ["Çiğ Badem", "Granola", "Organik Zeytinyağı", "Protein Bar"] },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Kâr Hesaplayıcı
  const [showKar, setShowKar] = useState(false);
  const [alisF, setAlisF] = useState("");
  const [satisFiyat, setSatisFiyat] = useState("");
  const [kargoMaliyet, setKargoMaliyet] = useState("25");
  const [karPlatform, setKarPlatform] = useState("trendyol");

  const shareResult = () => {
    if (!result) return;
    const payload = {
      urun: query, score: result.score, competition: result.competition,
      priceRange: result.priceRange, shippingDifficulty: result.shippingDifficulty,
      trend: result.trend, suggestion: result.suggestion,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    };
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    const url = `${window.location.origin}/paylasim?d=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState({ analyses: 0, orders: 0, pendingOrders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [storeInfo, setStoreInfo] = useState<{ magazaAdi: string; nis: string; platform: string; slogan?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scalevo_store");
      if (stored) setStoreInfo(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user: sbUser } } = await supabase.auth.getUser();

      if (sbUser) {
        setUser({
          name: sbUser.user_metadata?.name || sbUser.email || "Kullanıcı",
          email: sbUser.email || "",
        });

        const [{ count: analysisCount }, { data: orders }, { data: analyses }] = await Promise.all([
          supabase.from("analysis_history").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("price_num, status, code, customer, item, price, timestamp").order("timestamp", { ascending: false }).limit(5),
          supabase.from("analysis_history").select("product_name, score, created_at").order("created_at", { ascending: false }).limit(5),
        ]);

        const pendingOrders = orders?.filter(o => o.status === "new").length || 0;
        const revenue = orders?.reduce((sum, o) => sum + (o.price_num || 0), 0) || 0;

        setStats({ analyses: analysisCount || 0, orders: orders?.length || 0, pendingOrders, revenue });
        setRecentOrders(orders || []);
        setRecentAnalyses(analyses || []);
      }
    };
    load();
  }, []);

  const handleAnalyze = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setShowKar(false);
    setAlisF("");
    setSatisFiyat("");
    try {
      const res = await fetch("/api/analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun: query, kategori: kategori || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
      } else {
        setResult(data);
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user: sbUser } } = await supabase.auth.getUser();
          if (sbUser) {
            await supabase.from("analysis_history").insert({
              user_id: sbUser.id,
              product_name: query,
              score: data.score,
              competition: data.competition,
              price_range: data.priceRange,
              shipping_difficulty: data.shippingDifficulty,
              trend: data.trend,
              suggestion: data.suggestion,
            });
            setStats(prev => ({ ...prev, analyses: prev.analyses + 1 }));
            setRecentAnalyses(prev => [{ product_name: query, score: data.score, created_at: new Date().toISOString() }, ...prev.slice(0, 4)]);
          }
        } catch {}
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {wizardOpen && (
        <SifirdanWizard
          onClose={() => setWizardOpen(false)}
          onStoreSetup={(data) => setStoreInfo(data)}
        />
      )}

      {/* KİŞİSELLEŞTİRİLMİŞ HEADER */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {user && (
            <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
              {getInitials(user.name)}
            </div>
          )}
          <div>
            <p className="text-slate-500 text-sm font-medium">{getGreeting()},</p>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {user ? user.name.split(" ")[0] : "Hoş Geldin"} 👋
            </h2>
            {storeInfo && (
              <div className="flex items-center gap-1.5 mt-1">
                <Store size={13} className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-700">{storeInfo.magazaAdi}</span>
                {storeInfo.platform === "trendyol" && (
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">Trendyol</span>
                )}
                {storeInfo.platform === "hepsiburada" && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium">Hepsiburada</span>
                )}
                {storeInfo.platform === "her_ikisi" && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">2 Platform</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-400 font-medium">
            {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">Panelin seni bekliyor.</p>
        </div>
      </header>

      {/* 0'DAN BAŞLAT BANNER — sadece mağaza kurulmamışsa göster */}
      {!storeInfo && <div
        className="relative overflow-hidden rounded-2xl p-5 md:p-6 cursor-pointer group"
        style={{ background: "linear-gradient(135deg, #16a34a 0%, #0d9488 60%, #0891b2 100%)" }}
        onClick={() => setWizardOpen(true)}
      >
        {/* Dekoratif daireler */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-4 top-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-24 -bottom-6 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Rocket size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium mb-0.5">Yeni başlıyor musun?</p>
              <h3 className="text-white font-black text-lg md:text-xl leading-tight">0&apos;dan Mağaza Kur 🚀</h3>
              <p className="text-white/70 text-xs mt-0.5 hidden sm:block">
                Niş · Ürün · Logo · Reklam Metni — hepsi AI ile 2 dakikada
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white text-green-700 font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 flex items-center gap-2">
              Başlat <ArrowUpRight size={15} />
            </div>
          </div>
        </div>
      </div>}

      {/* HIZLI İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Toplam Analiz" value={stats.analyses} icon={<BarChart2 size={18} className="text-green-500" />} color="bg-green-50" />
        <QuickStat label="Toplam Sipariş" value={stats.orders} icon={<ShoppingBag size={18} className="text-emerald-500" />} color="bg-emerald-50" />
        <QuickStat label="Bekleyen Sipariş" value={stats.pendingOrders} icon={<Clock size={18} className="text-orange-500" />} color="bg-orange-50" highlight={stats.pendingOrders > 0} />
        <QuickStat label="Toplam Ciro" value={`${stats.revenue.toLocaleString("tr-TR")} ₺`} icon={<TrendingUp size={18} className="text-green-500" />} color="bg-green-50" />
      </div>

      {/* ANALİZ BÖLÜMÜ */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400"></div>
        <CardContent className="p-5 md:p-8">
          <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-5">
            <h4 className="text-xl md:text-2xl font-semibold text-slate-700">Ürün Fikri Doğrulama</h4>
            <p className="text-slate-500 text-sm md:text-base">Kategori seç, ürün adını gir — AI ile potansiyelini ölç.</p>

            {/* Kategori Seçici */}
            <div className="flex flex-wrap gap-2 justify-center">
              {KATEGORILER.map(k => (
                <button
                  key={k.id}
                  onClick={() => { setKategori(k.id === kategori ? "" : k.id); setQuery(""); setResult(null); }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    kategori === k.id
                      ? "bg-green-600 text-white border-green-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>

            {/* Kategori örnekleri */}
            {kategori && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {KATEGORILER.find(k => k.id === kategori)?.ornekler.map(ornek => (
                  <button
                    key={ornek}
                    onClick={() => { setQuery(ornek); setResult(null); }}
                    className="text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {ornek}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <Input
                placeholder={
                  kategori
                    ? `Örn: ${KATEGORILER.find(k => k.id === kategori)?.ornekler[0] ?? "Ürün adı"}`
                    : "Önce kategori seç veya direkt ürün yaz..."
                }
                className="h-11 md:h-12 text-base px-4 border-slate-200 focus-visible:ring-green-500 shadow-sm flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Button
                size="lg"
                className="h-11 md:h-12 px-6 bg-green-600 hover:bg-green-700 font-medium w-full sm:w-auto"
                onClick={handleAnalyze}
                disabled={loading || !query}
              >
                {loading ? "Hesaplanıyor..." : "Analiz Et"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-100 bg-green-50/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Satılabilirlik Skoru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-green-600">{result.score}</span>
                  <span className="text-sm text-green-400">/ 100</span>
                </div>
                <div className="w-full bg-green-200 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-green-600 h-full rounded-full transition-all duration-1000" style={{ width: `${result.score}%` }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Pazar Verileri</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailBox label="Rekabet" value={result.competition} icon={<AlertCircle size={16} className="text-orange-500"/>} />
                <DetailBox label="Ort. Fiyat" value={result.priceRange} icon={<DollarSign size={16} className="text-green-500"/>} />
                <DetailBox label="Kargo" value={result.shippingDifficulty} icon={<Package size={16} className="text-blue-500"/>} />
                <DetailBox label="Trend Tipi" value={result.trend} icon={<TrendingUp size={16} className="text-emerald-500"/>} />
              </CardContent>
            </Card>

            <Card className="md:col-span-3 border-slate-200 bg-white shadow-sm border-l-4 border-l-green-500">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1 flex-shrink-0">
                  <BrainCircuit size={20} />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 mb-1">AI Tavsiyesi</h5>
                  <p className="text-slate-600 text-sm leading-relaxed">{result.suggestion}</p>
                </div>
                <button
                  onClick={shareResult}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                    copied ? "bg-green-100 text-green-700" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                  title="Paylaşım linkini kopyala"
                >
                  {copied ? <><Check size={13} /> Kopyalandı!</> : <><Share2 size={13} /> Paylaş</>}
                </button>
              </CardContent>
            </Card>
            {/* KÂR HESAPLAYICI */}
            <Card className="md:col-span-3 border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => {
                  setShowKar(v => !v);
                  if (!satisFiyat && result?.priceRange) {
                    const parts = result.priceRange.replace(/₺/g, "").split("-").map((s: string) => s.trim());
                    if (parts[1]) setSatisFiyat(parts[1]);
                  }
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                    <Calculator size={16} />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">Kâr Hesaplayıcı</span>
                  <span className="text-xs text-slate-400">— alış fiyatını gir, net kârı gör</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showKar ? "rotate-180" : ""}`} />
              </button>

              {showKar && (() => {
                const komisyon = KOMISYON_ORANLARI[kategori] ?? 15;
                const satis = parseFloat(satisFiyat) || 0;
                const alis = parseFloat(alisF) || 0;
                const kargo = parseFloat(kargoMaliyet) || 0;
                const hizmetBedeli = karPlatform === "trendyol" ? satis * 0.02 : satis * 0.025;
                const komisyonTutari = satis * (komisyon / 100);
                const netGelir = satis - komisyonTutari - hizmetBedeli - kargo;
                const kar = netGelir - alis;
                const marj = satis > 0 ? (kar / satis * 100) : 0;
                const karRenk = kar > 0 ? "text-green-600" : "text-red-500";
                const marjRenk = marj > 20 ? "bg-green-100 text-green-700" : marj > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-600";
                return (
                  <div className="border-t border-slate-100 p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1">Alış Fiyatı (₺)</label>
                        <input
                          type="number" placeholder="örn: 120"
                          value={alisF} onChange={e => setAlisF(e.target.value)}
                          className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1">Satış Fiyatı (₺)</label>
                        <input
                          type="number" placeholder="örn: 299"
                          value={satisFiyat} onChange={e => setSatisFiyat(e.target.value)}
                          className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1">Kargo Maliyeti (₺)</label>
                        <input
                          type="number" placeholder="25"
                          value={kargoMaliyet} onChange={e => setKargoMaliyet(e.target.value)}
                          className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1">Platform</label>
                        <select
                          value={karPlatform} onChange={e => setKarPlatform(e.target.value)}
                          className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          <option value="trendyol">🟠 Trendyol</option>
                          <option value="hepsiburada">🟡 Hepsiburada</option>
                        </select>
                      </div>
                    </div>

                    {satis > 0 && alis > 0 && (
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs text-slate-400 mb-1">Komisyon ({komisyon}%)</p>
                            <p className="font-bold text-slate-700">-{komisyonTutari.toFixed(0)}₺</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs text-slate-400 mb-1">Hizmet Bedeli</p>
                            <p className="font-bold text-slate-700">-{hizmetBedeli.toFixed(0)}₺</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs text-slate-400 mb-1">Kargo</p>
                            <p className="font-bold text-slate-700">-{kargo.toFixed(0)}₺</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs text-slate-400 mb-1">Alış Maliyeti</p>
                            <p className="font-bold text-slate-700">-{alis.toFixed(0)}₺</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-slate-200">
                          <div>
                            <p className="text-xs text-slate-400">Net Kâr</p>
                            <p className={`text-2xl font-black ${karRenk}`}>{kar.toFixed(0)}₺</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 mb-1">Kâr Marjı</p>
                            <span className={`text-lg font-black px-3 py-1 rounded-lg ${marjRenk}`}>
                              %{Math.abs(marj).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {kar < 0 && (
                          <p className="text-xs text-red-500 text-center">⚠️ Bu fiyatla zarar ediyorsun — satış fiyatını artır veya alış maliyetini düşür.</p>
                        )}
                        {kar > 0 && marj < 10 && (
                          <p className="text-xs text-orange-500 text-center">⚠️ Marj düşük (%10 altı). Ölçeklenmesi zorlaşabilir.</p>
                        )}
                        {kar > 0 && marj >= 10 && (
                          <p className="text-xs text-green-600 text-center">✅ Sağlıklı bir kâr marjı!</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </Card>
          </div>
        </div>
      )}

      {/* SON AKTİVİTELER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <ShoppingBag size={16} className="text-green-600" /> Son Siparişler
            </CardTitle>
            <Link href="/operasyonlar" className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              Tümünü gör <ArrowUpRight size={13} />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <ShoppingBag size={32} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm">Henüz sipariş yok.</p>
              </div>
            ) : (
              <div className="space-y-1 divide-y divide-slate-50">
                {recentOrders.map((o, i) => {
                  const st = STATUS_LABELS[o.status] || STATUS_LABELS.new;
                  return (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium text-slate-800 truncate">{o.customer}</p>
                        <p className="text-xs text-slate-500 truncate">{o.item}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        <span className="text-sm font-bold text-slate-700">{o.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <BarChart2 size={16} className="text-green-600" /> Son Analizler
            </CardTitle>
            <Link href="/analiz" className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              Tümünü gör <ArrowUpRight size={13} />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <BarChart2 size={32} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm">Henüz analiz yapılmadı.</p>
              </div>
            ) : (
              <div className="space-y-1 divide-y divide-slate-50">
                {recentAnalyses.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-slate-800 truncate">{a.product_name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(a.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      a.score >= 75 ? 'bg-green-100 text-green-700' :
                      a.score >= 50 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {a.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon, color, highlight }: any) {
  return (
    <Card className={`border-slate-200 shadow-sm ${highlight ? 'ring-2 ring-orange-400' : ''}`}>
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

function DetailBox({ label, value, icon }: any) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
        {icon} {label}
      </div>
      <div className="text-slate-800 font-semibold text-sm truncate" title={value}>{value}</div>
    </div>
  );
}
