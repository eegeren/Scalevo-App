"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store, RefreshCw, Sparkles, BarChart2, Megaphone, ArrowUpRight,
  Edit3, Copy, Check, BrainCircuit, Rocket, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NIS_COLORS: Record<string, [string, string]> = {
  "Evcil Hayvan":     ["#f97316", "#ea580c"],
  "Elektronik":       ["#3b82f6", "#1d4ed8"],
  "Güzellik & Bakım": ["#ec4899", "#be185d"],
  "Spor & Fitness":   ["#22c55e", "#15803d"],
  "Ev & Yaşam":       ["#14b8a6", "#0f766e"],
  "Bebek & Çocuk":    ["#f59e0b", "#b45309"],
  "Moda & Giyim":     ["#a855f7", "#7e22ce"],
  "Gıda & İçecek":    ["#ef4444", "#b91c1c"],
};

const NIS_EMOJILER: Record<string, string> = {
  "Evcil Hayvan": "🐾", "Elektronik": "📱", "Güzellik & Bakım": "💄",
  "Spor & Fitness": "💪", "Ev & Yaşam": "🏠", "Bebek & Çocuk": "🍼",
  "Moda & Giyim": "👗", "Gıda & İçecek": "🍎",
};

const PLATFORM_LABELS: Record<string, string> = {
  trendyol: "🟠 Trendyol",
  hepsiburada: "🟡 Hepsiburada",
  her_ikisi: "🛍️ Trendyol & Hepsiburada",
  yeni: "🚀 Yeni Başlıyor",
};

function StoreLogo({ name, nis, size = 80 }: { name: string; nis: string; size?: number }) {
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : (name.slice(0, 2) || "S").toUpperCase();
  const [c1, c2] = NIS_COLORS[nis] || ["#16a34a", "#15803d"];
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 900, color: "white",
        fontFamily: "-apple-system,system-ui,sans-serif",
        boxShadow: `0 8px 24px ${c1}55`,
        letterSpacing: -1, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function MagazamPage() {
  const router = useRouter();
  const [store, setStore] = useState<{ magazaAdi: string; nis: string; platform: string; slogan?: string } | null>(null);
  const [reklam, setReklam] = useState<string | null>(null);
  const [reklamLoading, setReklamLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scalevo_store");
      if (stored) setStore(JSON.parse(stored));
    } catch {}
  }, []);

  const generateReklam = async () => {
    if (!store) return;
    setReklamLoading(true);
    try {
      const res = await fetch("/api/ai/reklam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ magazaAdi: store.magazaAdi, nis: store.nis, slogan: store.slogan }),
      });
      const data = await res.json();
      if (data.reklam) setReklam(data.reklam);
    } catch {}
    setReklamLoading(false);
  };

  const copyReklam = () => {
    if (!reklam) return;
    navigator.clipboard.writeText(reklam);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
          <Store size={32} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Henüz mağaza kurulmadı</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Ana sayfadaki "0'dan Mağaza Kur" butonuyla mağazanı oluşturabilirsin.
        </p>
        <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700 gap-2">
          <Rocket size={16} /> Mağaza Kur
        </Button>
      </div>
    );
  }

  const [c1] = NIS_COLORS[store.nis] || ["#16a34a", "#15803d"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Mağazam</h2>
          <p className="text-slate-500 mt-1">Mağaza profili, logo ve reklam araçları.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="gap-2 border-slate-200"
        >
          <Edit3 size={14} /> Düzenle
        </Button>
      </div>

      {/* Mağaza Kartı */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c1}, ${c1}88)` }} />
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <StoreLogo name={store.magazaAdi} nis={store.nis} size={88} />
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">{store.magazaAdi}</h3>
              {store.slogan && (
                <p className="text-slate-500 text-sm mt-1 italic">"{store.slogan}"</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                  {NIS_EMOJILER[store.nis]} {store.nis}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                  {PLATFORM_LABELS[store.platform] || store.platform}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Araçlar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ürün Analizi — zaten var */}
        <Link href="/" className="group">
          <Card className="border-slate-200 shadow-sm h-full hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <BarChart2 size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Ürün Analizi</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {store.nis} nişinde satılabilecek ürünleri AI ile puanla.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-green-600 text-xs font-semibold group-hover:gap-2 transition-all">
                Analiz Yap <ArrowUpRight size={13} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Ürün Karşılaştır — zaten var */}
        <Link href="/karsilastir" className="group">
          <Card className="border-slate-200 shadow-sm h-full hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Package size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Ürün Karşılaştır</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Rakip ürünleri karşılaştırarak en iyi seçeneği bul.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-blue-600 text-xs font-semibold group-hover:gap-2 transition-all">
                Karşılaştır <ArrowUpRight size={13} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* AI Araçlar — zaten var */}
        <Link href="/ai-araclar" className="group">
          <Card className="border-slate-200 shadow-sm h-full hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">AI Araçlar</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Başlık üretici, fiyatlama, trend keşfi ve daha fazlası.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-purple-600 text-xs font-semibold group-hover:gap-2 transition-all">
                Araçları Gör <ArrowUpRight size={13} />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Reklam Metni Üretici */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Megaphone size={18} className="text-orange-500" /> Reklam Metni Üretici
          </CardTitle>
          <p className="text-xs text-slate-500">{store.magazaAdi} için sosyal medya ve pazaryeri reklam metni oluştur.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateReklam}
            disabled={reklamLoading}
            className="bg-orange-500 hover:bg-orange-600 gap-2"
          >
            {reklamLoading ? (
              <><RefreshCw size={15} className="animate-spin" /> Üretiliyor...</>
            ) : (
              <><Sparkles size={15} /> Reklam Metni Üret</>
            )}
          </Button>

          {reklam && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600 flex-shrink-0">
                  <BrainCircuit size={16} />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed flex-1 whitespace-pre-line">{reklam}</p>
              </div>
              <button
                onClick={copyReklam}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied ? "bg-green-100 text-green-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {copied ? <><Check size={13} /> Kopyalandı!</> : <><Copy size={13} /> Kopyala</>}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
