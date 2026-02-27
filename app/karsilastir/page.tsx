"use client";
import PlanGate from "@/components/PlanGate";

import { useState } from "react";
import {
  Scale, Plus, X, Sparkles, RefreshCw, Trophy, TrendingUp,
  Package, DollarSign, Truck, AlertCircle, CheckCircle2, Minus, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SCORE_COLOR = (s: number) =>
  s >= 75 ? "text-green-600 bg-green-50 border-green-200" :
  s >= 50 ? "text-orange-500 bg-orange-50 border-orange-200" :
  "text-red-500 bg-red-50 border-red-200";

const TREND_COLOR: Record<string, string> = {
  "Yükselen": "bg-green-100 text-green-700",
  "Stabil": "bg-slate-100 text-slate-600",
  "Düşen": "bg-red-100 text-red-600",
};

const REKABET_COLOR: Record<string, string> = {
  "Düşük": "bg-green-100 text-green-700",
  "Orta": "bg-orange-100 text-orange-700",
  "Yüksek": "bg-red-100 text-red-700",
};

export default function KarsilastirPage() {
  const [inputs, setInputs] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addInput = () => { if (inputs.length < 4) setInputs([...inputs, ""]); };
  const removeInput = (i: number) => { if (inputs.length > 2) setInputs(inputs.filter((_, idx) => idx !== i)); };
  const setInput = (i: number, val: string) => setInputs(inputs.map((v, idx) => idx === i ? val : v));

  const run = async () => {
    const urunler = inputs.map(s => s.trim()).filter(Boolean);
    if (urunler.length < 2) { setError("En az 2 ürün adı gir."); return; }
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/ai/karsilastir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urunler }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch { setError("Sunucuya bağlanılamadı."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Scale size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Ürün Karşılaştırma</h2>
          <p className="text-slate-500 mt-1">2-4 ürünü yan yana analiz et, hangisinin daha iyi olduğunu AI'ya sor.</p>
        </div>
      </div>

      {/* Input */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            {inputs.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                <Input
                  placeholder={`${i === 0 ? "örn: Kedi Su Pınarı" : i === 1 ? "örn: Bluetooth Kulaklık" : "Ürün adı..."}`}
                  value={val}
                  onChange={e => setInput(i, e.target.value)}
                  onKeyDown={e => e.key === "Enter" && run()}
                  className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                />
                {inputs.length > 2 && (
                  <button onClick={() => removeInput(i)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors flex-shrink-0">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            {inputs.length < 4 && (
              <Button onClick={addInput} variant="outline" className="gap-2 border-slate-200 text-slate-600">
                <Plus size={14} /> Ürün Ekle
              </Button>
            )}
            <Button onClick={run} disabled={loading || inputs.filter(Boolean).length < 2} className="bg-blue-600 hover:bg-blue-700 gap-2">
              {loading ? <><RefreshCw size={14} className="animate-spin" /> Karşılaştırılıyor...</> : <><Sparkles size={14} /> Karşılaştır</>}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sonuç */}
      {result && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-400">
          {/* Kazanan Banner */}
          <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Trophy size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-0.5">En İyi Seçim</p>
              <h3 className="text-xl font-extrabold text-amber-900">{result.kazanan}</h3>
              <p className="text-amber-800 text-sm mt-1 leading-relaxed">{result.kazananNeden}</p>
            </div>
          </div>

          {/* Karşılaştırma Grid */}
          <div className={`grid grid-cols-1 ${result.urunler.length === 2 ? "md:grid-cols-2" : result.urunler.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-4`}>
            {result.urunler.map((u: any, i: number) => {
              const isWinner = u.ad === result.kazanan;
              return (
                <Card key={i} className={`border-2 shadow-sm transition-all ${isWinner ? "border-amber-300 shadow-amber-100" : "border-slate-200"}`}>
                  {isWinner && (
                    <div className="bg-amber-400 text-white text-xs font-bold text-center py-1 rounded-t-xl tracking-wide">
                      🏆 EN İYİ SEÇİM
                    </div>
                  )}
                  <CardContent className="p-5 space-y-4">
                    {/* Başlık + Skor */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{u.ad}</h4>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 border-2 ${SCORE_COLOR(u.score)}`}>
                        {u.score}
                      </div>
                    </div>

                    {/* Metrikler */}
                    <div className="grid grid-cols-2 gap-2">
                      <MetricBox label="Rekabet" value={u.rekabet} badge={REKABET_COLOR[u.rekabet]} />
                      <MetricBox label="Trend" value={u.trend} badge={TREND_COLOR[u.trend]} />
                      <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Fiyat Aralığı</p>
                        <p className="text-sm font-semibold text-slate-800">{u.fiyatAraligi}</p>
                      </div>
                      <MetricBox label="Kargo" value={u.kargoZorluk} badge={u.kargoZorluk === "Kolay" ? "bg-green-100 text-green-700" : u.kargoZorluk === "Orta" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"} />
                      <MetricBox label="Pazar" value={u.pazarBuyuklugu} badge="bg-blue-100 text-blue-700" />
                    </div>

                    {/* Güçlü Yönler */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Güçlü Yönler</p>
                      <ul className="space-y-1">
                        {u.gucluYonler?.map((g: string, j: number) => (
                          <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="text-green-500 flex-shrink-0 mt-0.5">+</span> {g}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Zayıf Yönler */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1"><Minus size={12} className="text-red-400" /> Dikkat Et</p>
                      <ul className="space-y-1">
                        {u.zayifYonler?.map((z: string, j: number) => (
                          <li key={j} className="text-xs text-slate-500 flex items-start gap-1.5">
                            <span className="text-red-400 flex-shrink-0 mt-0.5">-</span> {z}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Özet */}
                    <div className={`p-3 rounded-lg text-xs leading-relaxed ${isWinner ? "bg-amber-50 text-amber-800 border border-amber-100" : "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                      {u.ozet}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Genel Özet */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 mb-1 text-sm">AI Genel Değerlendirmesi</p>
                <p className="text-slate-600 text-sm leading-relaxed">{result.karsilastirmaOzeti}</p>
              </div>
            </CardContent>
          </Card>

          {/* Analiz Et Butonu */}
          <div className="flex justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Seçtiğin ürünü detaylı analiz et <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, badge }: { label: string; value: string; badge: string }) {
  return (
    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
      <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${badge}`}>{value}</span>
    </div>
  );
}
