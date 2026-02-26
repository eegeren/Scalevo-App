"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, AlertCircle, DollarSign, Package, TrendingUp, BrainCircuit, ArrowRight } from "lucide-react";

interface AnalysisData {
  urun: string;
  score: number;
  competition: string;
  priceRange: string;
  shippingDifficulty: string;
  trend: string;
  suggestion: string;
  date?: string;
}

export default function PaylasimPage() {
  const params = useSearchParams();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = params.get("d");
      if (!raw) { setError(true); return; }
      const decoded = JSON.parse(atob(decodeURIComponent(raw)));
      setData(decoded);
    } catch { setError(true); }
  }, [params]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Geçersiz veya süresi dolmuş paylaşım linki.</p>
          <Link href="/tanitim" className="mt-4 inline-block text-green-600 hover:underline text-sm">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const scoreColor = data.score >= 75 ? "text-green-600" : data.score >= 50 ? "text-orange-500" : "text-red-500";
  const scoreBg = data.score >= 75 ? "bg-green-600" : data.score >= 50 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-white flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <Link href="/tanitim" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-800">Scalevo</span>
        </Link>
        <Link href="/kayit" className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
          Ücretsiz Dene →
        </Link>
      </nav>

      {/* Kart */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">AI Ürün Analizi</p>
            <h1 className="text-3xl font-extrabold text-slate-900">{data.urun}</h1>
            {data.date && <p className="text-xs text-slate-400 mt-1">{data.date}</p>}
          </div>

          {/* Skor */}
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden mb-4">
            <div className={`h-1.5 ${scoreBg} w-full`} />
            <div className="p-8 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Satılabilirlik Skoru</p>
              <div className={`text-8xl font-black mb-2 ${scoreColor}`}>{data.score}</div>
              <div className="text-slate-400 text-sm font-medium">/ 100</div>
              <div className="w-full bg-slate-100 h-3 rounded-full mt-5 overflow-hidden">
                <div className={`h-full rounded-full ${scoreBg} transition-all duration-1000`} style={{ width: `${data.score}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {data.score >= 75 ? "🔥 Satılabilir ürün — başlamak için iyi fırsat" :
                 data.score >= 50 ? "⚠️ Orta potansiyel — dikkatli değerlendir" :
                 "❌ Düşük potansiyel — alternatif düşün"}
              </p>
            </div>
          </div>

          {/* Metrikler */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard label="Rekabet" value={data.competition} icon={<AlertCircle size={15} className="text-orange-500" />} />
            <MetricCard label="Fiyat Aralığı" value={data.priceRange} icon={<DollarSign size={15} className="text-green-500" />} />
            <MetricCard label="Kargo" value={data.shippingDifficulty} icon={<Package size={15} className="text-blue-500" />} />
            <MetricCard label="Trend" value={data.trend} icon={<TrendingUp size={15} className="text-emerald-500" />} />
          </div>

          {/* AI Tavsiyesi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <BrainCircuit size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">AI Tavsiyesi</p>
              <p className="text-sm text-slate-700 leading-relaxed">{data.suggestion}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white text-center">
            <p className="font-bold text-lg mb-1">Sen de analiz yap 🚀</p>
            <p className="text-green-100 text-sm mb-4">Scalevo ile ürünlerini yapay zeka ile değerlendir. Ücretsiz.</p>
            <Link href="/kayit" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-green-50 transition-colors">
              Ücretsiz Hesap Aç <ArrowRight size={15} />
            </Link>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Bu analiz <Link href="/tanitim" className="text-green-600 hover:underline">Scalevo</Link> ile oluşturuldu.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1.5">{icon} {label}</div>
      <p className="font-bold text-slate-800 text-sm">{value}</p>
    </div>
  );
}
