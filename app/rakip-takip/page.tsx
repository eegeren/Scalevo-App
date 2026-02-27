"use client";
import PlanGate from "@/components/PlanGate";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, RefreshCw, TrendingUp, TrendingDown, Minus,
  AlertCircle, Search, Store, BarChart2, ArrowUpRight, BrainCircuit,
  Bell, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Rakip {
  id: string;
  urun: string;
  platform: "trendyol" | "hepsiburada";
  hedefFiyat: number;
  sonFiyat: number | null;
  ortalamaFiyat: number | null;
  enDusuk: number | null;
  enYuksek: number | null;
  trend: string | null;
  tavsiye: string | null;
  sonGuncelleme: string | null;
  yukleniyor?: boolean;
}

const PLATFORM_LABELS = {
  trendyol: "🟠 Trendyol",
  hepsiburada: "🟡 Hepsiburada",
};

export default function RakipTakipPage() {
  const [rakipler, setRakipler] = useState<Rakip[]>([]);
  const [urunAdi, setUrunAdi] = useState("");
  const [platform, setPlatform] = useState<"trendyol" | "hepsiburada">("trendyol");
  const [hedefFiyat, setHedefFiyat] = useState("");
  const [ekleniyor, setEkleniyor] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scalevo_rakipler");
      if (stored) setRakipler(JSON.parse(stored));
    } catch {}
  }, []);

  const kaydet = (yeniListe: Rakip[]) => {
    setRakipler(yeniListe);
    try { localStorage.setItem("scalevo_rakipler", JSON.stringify(yeniListe)); } catch {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fiyatGuncelle = async (id: string) => {
    const rakip = rakipler.find(r => r.id === id);
    if (!rakip) return;
    const guncellendi = rakipler.map(r => r.id === id ? { ...r, yukleniyor: true } : r);
    setRakipler(guncellendi);
    try {
      const res = await fetch("/api/ai/rakip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun: rakip.urun, platform: rakip.platform }),
      });
      const data = await res.json();
      if (res.ok) {
        const yeniListe = rakipler.map(r =>
          r.id === id ? {
            ...r,
            sonFiyat: data.ortalamaFiyat,
            ortalamaFiyat: data.ortalamaFiyat,
            enDusuk: data.enDusuk,
            enYuksek: data.enYuksek,
            trend: data.trend,
            tavsiye: data.tavsiye,
            sonGuncelleme: new Date().toLocaleString("tr-TR"),
            yukleniyor: false,
          } : r
        );
        kaydet(yeniListe);
        showToast(`"${rakip.urun}" fiyatları güncellendi ✓`);
      }
    } catch {
      setRakipler(prev => prev.map(r => r.id === id ? { ...r, yukleniyor: false } : r));
    }
  };

  const hepsiniGuncelle = async () => {
    for (const r of rakipler) {
      await fiyatGuncelle(r.id);
    }
  };

  const ekle = async () => {
    if (!urunAdi.trim()) return;
    setEkleniyor(true);
    const yeni: Rakip = {
      id: Date.now().toString(),
      urun: urunAdi.trim(),
      platform,
      hedefFiyat: parseFloat(hedefFiyat) || 0,
      sonFiyat: null,
      ortalamaFiyat: null,
      enDusuk: null,
      enYuksek: null,
      trend: null,
      tavsiye: null,
      sonGuncelleme: null,
      yukleniyor: true,
    };
    const yeniListe = [...rakipler, yeni];
    setRakipler(yeniListe);
    setUrunAdi("");
    setHedefFiyat("");
    setEkleniyor(false);

    // Hemen fiyat çek
    try {
      const res = await fetch("/api/ai/rakip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun: yeni.urun, platform: yeni.platform }),
      });
      const data = await res.json();
      if (res.ok) {
        const guncellenmis = yeniListe.map(r =>
          r.id === yeni.id ? {
            ...r,
            sonFiyat: data.ortalamaFiyat,
            ortalamaFiyat: data.ortalamaFiyat,
            enDusuk: data.enDusuk,
            enYuksek: data.enYuksek,
            trend: data.trend,
            tavsiye: data.tavsiye,
            sonGuncelleme: new Date().toLocaleString("tr-TR"),
            yukleniyor: false,
          } : r
        );
        kaydet(guncellenmis);
      }
    } catch {
      setRakipler(prev => prev.map(r => r.id === yeni.id ? { ...r, yukleniyor: false } : r));
    }
  };

  const sil = (id: string) => {
    kaydet(rakipler.filter(r => r.id !== id));
  };

  const uyarilmasi = rakipler.filter(r =>
    r.sonFiyat && r.hedefFiyat > 0 && r.sonFiyat <= r.hedefFiyat
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 bg-green-600 text-white animate-in slide-in-from-top-4">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Rakip Fiyat Takibi</h2>
          <p className="text-slate-500 mt-1">AI ile piyasa fiyatlarını izle, avantajlı fiyat koy.</p>
        </div>
        {rakipler.length > 0 && (
          <Button onClick={hepsiniGuncelle} variant="outline" size="sm" className="gap-2 border-slate-200">
            <RefreshCw size={14} /> Hepsini Güncelle
          </Button>
        )}
      </div>

      {/* Uyarılar */}
      {uyarilmasi.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <Bell size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 text-sm">🎯 Hedef fiyata ulaşıldı!</p>
            {uyarilmasi.map(r => (
              <p key={r.id} className="text-xs text-green-700 mt-0.5">
                <strong>{r.urun}</strong> — piyasa fiyatı {r.sonFiyat}₺, hedefin {r.hedefFiyat}₺ ✓
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Yeni Ürün Ekle */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Plus size={16} className="text-blue-500" /> Takibe Al
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 font-medium block mb-1">Ürün Adı</label>
              <Input
                placeholder="örn: Bluetooth Kulaklık"
                value={urunAdi}
                onChange={e => setUrunAdi(e.target.value)}
                onKeyDown={e => e.key === "Enter" && urunAdi && ekle()}
                className="h-10"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Platform</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as any)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="trendyol">🟠 Trendyol</option>
                <option value="hepsiburada">🟡 Hepsiburada</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Hedef Fiyat (₺)</label>
              <Input
                type="number"
                placeholder="örn: 250"
                value={hedefFiyat}
                onChange={e => setHedefFiyat(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
          <Button
            onClick={ekle}
            disabled={!urunAdi.trim() || ekleniyor}
            className="mt-3 bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Search size={15} /> Ekle & Fiyat Çek
          </Button>
        </CardContent>
      </Card>

      {/* Rakip Listesi */}
      {rakipler.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <BarChart2 size={48} className="mx-auto mb-3 text-slate-200" />
          <p className="font-medium text-slate-500">Henüz takip edilen ürün yok</p>
          <p className="text-sm mt-1">Yukarıdan bir ürün ekle, AI fiyatları otomatik çeksin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rakipler.map(r => {
            const altindaMi = r.sonFiyat && r.hedefFiyat > 0 && r.sonFiyat <= r.hedefFiyat;
            const trendIcon = r.trend === "artıyor" ? (
              <TrendingUp size={14} className="text-red-500" />
            ) : r.trend === "düşüyor" ? (
              <TrendingDown size={14} className="text-green-500" />
            ) : (
              <Minus size={14} className="text-slate-400" />
            );

            return (
              <Card key={r.id} className={`border shadow-sm overflow-hidden ${altindaMi ? "border-green-300" : "border-slate-200"}`}>
                {altindaMi && <div className="h-1 bg-green-500" />}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">{r.urun}</h3>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {PLATFORM_LABELS[r.platform]}
                        </span>
                        {altindaMi && (
                          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Bell size={10} /> Hedefe Ulaştı!
                          </span>
                        )}
                      </div>

                      {r.yukleniyor ? (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                          <RefreshCw size={14} className="animate-spin" /> Fiyatlar alınıyor...
                        </div>
                      ) : r.sonFiyat ? (
                        <div className="mt-3 space-y-3">
                          {/* Fiyat bandı */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-2.5 bg-red-50 rounded-lg border border-red-100">
                              <p className="text-xs text-slate-400">En Düşük</p>
                              <p className="font-bold text-slate-800">{r.enDusuk}₺</p>
                            </div>
                            <div className="text-center p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-xs text-slate-400">Ortalama</p>
                              <p className="font-bold text-slate-800 text-lg">{r.ortalamaFiyat}₺</p>
                            </div>
                            <div className="text-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-xs text-slate-400">En Yüksek</p>
                              <p className="font-bold text-slate-800">{r.enYuksek}₺</p>
                            </div>
                          </div>

                          {/* Trend + hedef */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              {trendIcon}
                              <span className="capitalize">{r.trend || "stabil"}</span>
                            </div>
                            {r.hedefFiyat > 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${altindaMi ? "bg-green-100 text-green-700" : "bg-orange-50 text-orange-600"}`}>
                                Hedef: {r.hedefFiyat}₺
                              </span>
                            )}
                            {r.sonGuncelleme && (
                              <span className="text-xs text-slate-400 ml-auto">{r.sonGuncelleme}</span>
                            )}
                          </div>

                          {/* AI tavsiye */}
                          {r.tavsiye && (
                            <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                              <BrainCircuit size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-600 leading-relaxed">{r.tavsiye}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 mt-2">Henüz fiyat alınmadı.</p>
                      )}
                    </div>

                    {/* Aksiyon butonları */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => fiyatGuncelle(r.id)}
                        disabled={r.yukleniyor}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-500 transition-colors disabled:opacity-40"
                        title="Fiyatı güncelle"
                      >
                        <RefreshCw size={14} className={r.yukleniyor ? "animate-spin" : ""} />
                      </button>
                      <button
                        onClick={() => sil(r.id)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Özet stats */}
      {rakipler.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Store size={14} className="text-blue-500" /> <strong>{rakipler.length}</strong> ürün takipte</span>
                <span className="flex items-center gap-1.5"><Bell size={14} className="text-green-500" /> <strong>{uyarilmasi.length}</strong> hedefe ulaştı</span>
              </div>
              <p className="text-xs text-slate-400">Fiyatlar AI tahminidir — gerçek değerler farklılık gösterebilir.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
