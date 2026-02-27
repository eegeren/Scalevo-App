"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, TrendingUp, Package, Activity, BrainCircuit,
  DollarSign, AlertCircle, BarChart2, Loader2
} from "lucide-react";

interface AnalysisData {
  product_name: string;
  score: number;
  competition: string;
  price_range: string;
  shipping_difficulty: string;
  trend: string;
  suggestion: string;
  created_at: string;
}

export default function UrunDetayPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const urlSlug = params.urunId as string;
  const productNameFromUrl = decodeURIComponent(urlSlug).replace(/-/g, " ");

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // Ürün adına göre en son analizi getir
      const { data: rows } = await supabase
        .from("analysis_history")
        .select("*")
        .ilike("product_name", productNameFromUrl)
        .order("created_at", { ascending: false })
        .limit(1);

      if (rows && rows.length > 0) {
        setData(rows[0]);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, [productNameFromUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 gap-3">
        <Loader2 size={24} className="animate-spin" />
        <span>Analiz yükleniyor...</span>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900 pl-0" onClick={() => router.back()}>
          <ArrowLeft size={18} /> Geri Dön
        </Button>
        <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3">
          <BarChart2 size={48} className="text-slate-200" />
          <p className="font-medium text-lg">Analiz bulunamadı.</p>
          <p className="text-sm">"{productNameFromUrl}" için kayıtlı bir analiz yok.</p>
          <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700" onClick={() => router.push("/")}>
            Analiz Başlat
          </Button>
        </div>
      </div>
    );
  }

  const scoreColor =
    data.score >= 75 ? "text-green-600" :
    data.score >= 50 ? "text-orange-500" :
    "text-red-500";

  const scoreBg =
    data.score >= 75 ? "bg-green-50 border-green-100" :
    data.score >= 50 ? "bg-orange-50 border-orange-100" :
    "bg-red-50 border-red-100";

  const scoreBar =
    data.score >= 75 ? "bg-green-500" :
    data.score >= 50 ? "bg-orange-400" :
    "bg-red-500";

  const competitionColor =
    data.competition === "Düşük" ? "bg-green-100 text-green-700" :
    data.competition === "Orta" ? "bg-orange-100 text-orange-700" :
    "bg-red-100 text-red-700";

  const statusLabel =
    data.score >= 75 ? "Yüksek Potansiyel" :
    data.score >= 50 ? "Orta Potansiyel" :
    "Düşük Potansiyel";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        className="gap-2 text-slate-500 hover:text-slate-900 pl-0"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} /> Geri Dön
      </Button>

      {/* BAŞLIK */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{data.product_name}</h1>
            <Badge className={`text-xs font-semibold border-0 ${competitionColor}`}>
              {statusLabel}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm">
            {new Date(data.created_at).toLocaleDateString("tr-TR", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })} tarihinde analiz edildi.
          </p>
        </div>
      </div>

      {/* SKOR + METRİKLER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SKOR KARTI */}
        <Card className={`border shadow-sm ${scoreBg}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Satılabilirlik Skoru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${scoreColor}`}>{data.score}</span>
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${scoreBar}`}
                style={{ width: `${data.score}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* PAZAR VERİLERİ */}
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pazar Verileri</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <MetricBox
              label="Rekabet Seviyesi"
              value={data.competition}
              icon={<AlertCircle size={16} className="text-orange-500" />}
            />
            <MetricBox
              label="Fiyat Aralığı"
              value={data.price_range}
              icon={<DollarSign size={16} className="text-green-500" />}
            />
            <MetricBox
              label="Kargo Zorluğu"
              value={data.shipping_difficulty}
              icon={<Package size={16} className="text-blue-500" />}
            />
            <MetricBox
              label="Trend Tipi"
              value={data.trend}
              icon={<TrendingUp size={16} className="text-purple-500" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* AI TAVSİYESİ */}
      <Card className="border-slate-200 bg-white shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="p-2.5 bg-green-100 rounded-xl text-green-600 mt-0.5 flex-shrink-0">
            <BrainCircuit size={22} />
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-1.5">AI Tavsiyesi</h5>
            <p className="text-slate-600 text-sm leading-relaxed">{data.suggestion}</p>
          </div>
        </CardContent>
      </Card>

      {/* ÖZET TABLOSU */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base text-slate-700 flex items-center gap-2">
            <Activity size={16} className="text-slate-400" /> Analiz Özeti
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-slate-50">
            <SummaryRow label="Ürün Adı" value={data.product_name} />
            <SummaryRow label="Skor" value={`${data.score} / 100`} />
            <SummaryRow label="Rekabet" value={data.competition} />
            <SummaryRow label="Fiyat Aralığı" value={data.price_range} />
            <SummaryRow label="Kargo" value={data.shipping_difficulty} />
            <SummaryRow label="Trend" value={data.trend} />
            <SummaryRow
              label="Analiz Tarihi"
              value={new Date(data.created_at).toLocaleDateString("tr-TR", {
                day: "numeric", month: "long", year: "numeric",
              })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="flex items-center gap-2 mb-1.5 text-slate-400 text-xs font-medium">
        {icon} {label}
      </div>
      <div className="text-slate-800 font-semibold text-sm leading-snug">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
