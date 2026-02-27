"use client";
import PlanGate from "@/components/PlanGate";

import { useState } from "react";
import {
  Sparkles, PenLine, DollarSign, TrendingUp, MessageSquare,
  Copy, Check, RefreshCw, ChevronRight, AlertCircle, Flame,
  ArrowUpRight, Lightbulb, Target, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "baslik" | "fiyat" | "trend" | "yorum";

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: "baslik", label: "Başlık & Açıklama", icon: <PenLine size={18} />, desc: "SEO uyumlu ürün içeriği üret", color: "text-violet-600" },
  { id: "fiyat", label: "Fiyatlama Asistanı", icon: <DollarSign size={18} />, desc: "Optimal fiyat stratejisi belirle", color: "text-green-600" },
  { id: "trend", label: "Trend Keşfi", icon: <TrendingUp size={18} />, desc: "Bu ay yükselen ürünleri bul", color: "text-orange-600" },
  { id: "yorum", label: "Yorum Analizi", icon: <MessageSquare size={18} />, desc: "Rakip açıklarını tespit et", color: "text-blue-600" },
];

export default function AIAraclarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("baslik");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-green-500 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Sparkles size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">AI Araçlar</h2>
          <p className="text-slate-500 mt-1">Yapay zeka destekli içerik, fiyat ve pazar analizi.</p>
        </div>
      </div>

      {/* Tab Seçici */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 ${
              activeTab === tab.id
                ? "border-green-300 bg-green-50 shadow-sm ring-1 ring-green-300"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            <div className={`mb-2 ${activeTab === tab.id ? "text-green-600" : tab.color}`}>
              {tab.icon}
            </div>
            <p className={`font-semibold text-sm ${activeTab === tab.id ? "text-green-800" : "text-slate-800"}`}>
              {tab.label}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{tab.desc}</p>
          </button>
        ))}
      </div>

      {/* İçerik */}
      {activeTab === "baslik" && <BaslikTool />}
      {activeTab === "fiyat" && <FiyatTool />}
      {activeTab === "trend" && <TrendTool />}
      {activeTab === "yorum" && <YorumTool />}
    </div>
  );
}

/* ─── BAŞLIK & AÇIKLAMA ─── */
function BaslikTool() {
  const [urun, setUrun] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const run = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/ai/baslik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun, kategori, ozellikler }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch { setError("Sunucuya bağlanılamadı."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <PenLine size={18} className="text-violet-600" /> SEO Başlık & Açıklama Üretici
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Ürün Adı *</label>
              <Input value={urun} onChange={e => setUrun(e.target.value)} placeholder="örn: Kedi Su Pınarı" className="bg-slate-50" onKeyDown={e => e.key === "Enter" && run()} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kategori</label>
              <Input value={kategori} onChange={e => setKategori(e.target.value)} placeholder="örn: Evcil Hayvan Ürünleri" className="bg-slate-50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Öne Çıkan Özellikler</label>
            <Input value={ozellikler} onChange={e => setOzellikler(e.target.value)} placeholder="örn: Sessiz motor, 2.5L tank, LED aydınlatma" className="bg-slate-50" />
          </div>
          <Button onClick={run} disabled={loading || !urun} className="bg-violet-600 hover:bg-violet-700 gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Üretiliyor...</> : <><Sparkles size={14} /> İçerik Üret</>}
          </Button>
          {error && <ErrorBox msg={error} />}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Başlıklar */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm text-slate-700">📝 Başlık Seçenekleri</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[result.baslik1, result.baslik2, result.baslik3].map((b: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                  <div>
                    <span className="text-xs text-slate-400 font-medium mr-2">#{i + 1}</span>
                    <span className="text-sm text-slate-800 font-medium">{b}</span>
                    <span className={`ml-2 text-xs ${b?.length > 55 ? "text-orange-500" : "text-green-500"}`}>({b?.length} karakter)</span>
                  </div>
                  <button onClick={() => copy(b, `baslik${i}`)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 rounded">
                    {copied === `baslik${i}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-slate-500" />}
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Açıklama */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm text-slate-700">📄 Ürün Açıklaması</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">{result.aciklama}</p>
                <button onClick={() => copy(result.aciklama, "aciklama")} className="absolute top-2 right-2 p-1.5 hover:bg-slate-200 rounded transition-colors">
                  {copied === "aciklama" ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-slate-400" />}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Etiketler + İpucu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm text-slate-700">🏷️ Anahtar Kelimeler</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-wrap gap-2">
                {result.etiketler?.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm text-slate-700 flex items-center gap-1"><Lightbulb size={14} className="text-yellow-500" /> İpucu</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600 leading-relaxed">{result.ipucu}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FİYATLAMA ASİSTANI ─── */
function FiyatTool() {
  const [urun, setUrun] = useState("");
  const [maliyet, setMaliyet] = useState("");
  const [hedefMarj, setHedefMarj] = useState("");
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/ai/fiyat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun, maliyet: Number(maliyet), hedefMarj: Number(hedefMarj), kategori }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch { setError("Sunucuya bağlanılamadı."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign size={18} className="text-green-600" /> Fiyatlama Asistanı
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Ürün Adı *</label>
              <Input value={urun} onChange={e => setUrun(e.target.value)} placeholder="örn: Bluetooth Kulaklık" className="bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kategori</label>
              <Input value={kategori} onChange={e => setKategori(e.target.value)} placeholder="örn: Elektronik" className="bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Maliyet (₺)</label>
              <Input type="number" value={maliyet} onChange={e => setMaliyet(e.target.value)} placeholder="örn: 250" className="bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Hedef Kar Marjı (%)</label>
              <Input type="number" value={hedefMarj} onChange={e => setHedefMarj(e.target.value)} placeholder="örn: 40" className="bg-slate-50" />
            </div>
          </div>
          <Button onClick={run} disabled={loading || !urun} className="bg-green-600 hover:bg-green-700 gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Hesaplanıyor...</> : <><Sparkles size={14} /> Fiyat Stratejisi Oluştur</>}
          </Button>
          {error && <ErrorBox msg={error} />}
        </CardContent>
      </Card>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
          {/* Ana Fiyat */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50 shadow-sm md:col-span-1">
              <CardContent className="p-5 text-center">
                <p className="text-xs text-green-700 font-semibold mb-1">Önerilen Fiyat</p>
                <p className="text-4xl font-bold text-green-600">{result.onerilenenFiyat?.toLocaleString("tr-TR")} ₺</p>
                <p className="text-xs text-green-600 mt-1">%{result.karMarji} kar marjı</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm md:col-span-2">
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox label="Minimum Fiyat" value={`${result.minFiyat?.toLocaleString("tr-TR")} ₺`} sub="Rekabetçi alt sınır" />
                  <InfoBox label="Maksimum Fiyat" value={`${result.maxFiyat?.toLocaleString("tr-TR")} ₺`} sub="Premium üst sınır" />
                  <InfoBox label="Trendyol Komisyon" value={`%${result.trendyolKomisyon}`} sub="Tahmini oran" />
                  <InfoBox label="Hepsiburada Komisyon" value={`%${result.hepsiburadaKomisyon}`} sub="Tahmini oran" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100"><CardTitle className="text-sm flex items-center gap-1"><Target size={14} className="text-green-600"/> Strateji</CardTitle></CardHeader>
              <CardContent className="p-4"><p className="text-sm text-slate-700 leading-relaxed">{result.strateji}</p></CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100"><CardTitle className="text-sm flex items-center gap-1"><ArrowUpRight size={14} className="text-blue-600"/> Rakip Analiz</CardTitle></CardHeader>
              <CardContent className="p-4"><p className="text-sm text-slate-700 leading-relaxed">{result.rakipAnaliz}</p></CardContent>
            </Card>
          </div>

          {result.uyari && (
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p>{result.uyari}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── TREND KEŞFİ ─── */
function TrendTool() {
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/ai/trend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategori }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch { setError("Sunucuya bağlanılamadı."); }
    finally { setLoading(false); }
  };

  const POTANSIYEL_COLORS: Record<string, string> = {
    "Patlama Noktasında": "bg-red-100 text-red-700",
    "Yüksek": "bg-orange-100 text-orange-700",
    "Orta": "bg-yellow-100 text-yellow-700",
    "Düşük": "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-600" /> Bu Ay Yükselen Ürünler
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kategori Filtresi (opsiyonel)</label>
            <Input value={kategori} onChange={e => setKategori(e.target.value)} placeholder="örn: Mutfak, Spor, Güzellik — boş bırakırsan tüm kategoriler" className="bg-slate-50 max-w-sm" />
          </div>
          <Button onClick={run} disabled={loading} className="bg-orange-500 hover:bg-orange-600 gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Analiz ediliyor...</> : <><Flame size={14} /> Trendleri Getir</>}
          </Button>
          {error && <ErrorBox msg={error} />}
        </CardContent>
      </Card>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
          {/* Altın Fırsat Banner */}
          {result.altinFirsat && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">Altın Fırsat</p>
                <p className="text-amber-700 text-sm mt-0.5">{result.altinFirsat}</p>
              </div>
            </div>
          )}

          {/* Mevsimsel Uyarı */}
          {result.mevsimselUyari && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{result.mevsimselUyari}</span>
            </div>
          )}

          {/* Trend Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.trendler?.map((t: any, i: number) => (
              <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-800">{t.urun}</p>
                      <p className="text-xs text-slate-400">{t.kategori}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-black text-orange-500">{t.trendsSkoru}</div>
                      <div className="text-xs text-slate-400">skor</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POTANSIYEL_COLORS[t.buyumePotansiyeli] || "bg-slate-100 text-slate-600"}`}>
                      {t.buyumePotansiyeli}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Rekabet: {t.tahminiRekabet}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.neden}</p>
                  <p className="text-xs text-slate-400 mt-1">📅 {t.tahminiIlgiSuresi}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── YORUM ANALİZİ ─── */
function YorumTool() {
  const [urun, setUrun] = useState("");
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/ai/yorum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun, kategori }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch { setError("Sunucuya bağlanılamadı."); }
    finally { setLoading(false); }
  };

  const SIKLIK_COLORS: Record<string, string> = {
    "Çok Sık": "bg-red-100 text-red-700",
    "Sık": "bg-orange-100 text-orange-700",
    "Orta": "bg-yellow-100 text-yellow-700",
  };
  const ONCELIK_COLORS: Record<string, string> = {
    "Kritik": "bg-red-100 text-red-700",
    "Önemli": "bg-orange-100 text-orange-700",
    "İyi Olur": "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" /> Rakip Yorum Analizi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Ürün Adı *</label>
              <Input value={urun} onChange={e => setUrun(e.target.value)} placeholder="örn: Akıllı Saat" className="bg-slate-50" onKeyDown={e => e.key === "Enter" && run()} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kategori</label>
              <Input value={kategori} onChange={e => setKategori(e.target.value)} placeholder="örn: Elektronik" className="bg-slate-50" />
            </div>
          </div>
          <Button onClick={run} disabled={loading || !urun} className="bg-blue-600 hover:bg-blue-700 gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Analiz ediliyor...</> : <><Sparkles size={14} /> Yorumları Analiz Et</>}
          </Button>
          {error && <ErrorBox msg={error} />}
        </CardContent>
      </Card>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
          {/* İdeal Müşteri */}
          <Card className="border-blue-100 bg-blue-50 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-semibold text-blue-900 text-sm">İdeal Müşteri Profili</p>
                <p className="text-blue-800 text-sm mt-0.5">{result.idealMusteri}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Şikayetler */}
            <Card className="border-red-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ThumbsDown size={14} className="text-red-500" /> Müşteri Şikayetleri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {result.sikayetler?.map((s: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-slate-800">{s.baslik}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SIKLIK_COLORS[s.sıklık] || "bg-slate-100 text-slate-600"}`}>{s.sıklık}</span>
                    </div>
                    <p className="text-xs text-slate-600">{s.detay}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Övgüler */}
            <Card className="border-green-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ThumbsUp size={14} className="text-green-500" /> Beğenilen Özellikler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {result.ovguler?.map((o: any, i: number) => (
                  <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="font-semibold text-sm text-green-800">{o.baslik}</p>
                    <p className="text-xs text-green-700 mt-0.5">{o.detay}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Fırsatlar */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowUpRight size={14} className="text-orange-500" /> Rakip Boşlukları & Fırsatlar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {result.fırsatlar?.map((f: any, i: number) => (
                <div key={i} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-orange-900">{f.baslik}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ONCELIK_COLORS[f.oncelik] || "bg-slate-100 text-slate-600"}`}>{f.oncelik}</span>
                  </div>
                  <p className="text-xs text-orange-800">{f.aciklama}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Kazanma Formülü */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
            <CardContent className="p-5 flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-bold text-green-900 mb-1">Kazanma Formülü</p>
                <p className="text-green-800 text-sm whitespace-pre-line leading-relaxed">{result.kazanmaFormulu}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─── YARDIMCI BİLEŞENLER ─── */
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <AlertCircle size={14} className="flex-shrink-0" /> {msg}
    </div>
  );
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}
