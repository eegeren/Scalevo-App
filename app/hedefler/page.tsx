"use client";

import { useState, useEffect } from "react";
import { Target, TrendingUp, ShoppingBag, BarChart3, Save, RefreshCw, CheckCircle2, Trophy, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Goals {
  siparis: number;
  ciro: number;
  analiz: number;
  yeniMusteri: number;
}

interface Progress {
  siparis: number;
  ciro: number;
  analiz: number;
  yeniMusteri: number;
}

const MONTH_KEY = () => {
  const d = new Date();
  return `scalevo_goals_${d.getFullYear()}_${d.getMonth() + 1}`;
};

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

export default function HedeflerPage() {
  const [goals, setGoals] = useState<Goals>({ siparis: 50, ciro: 25000, analiz: 20, yeniMusteri: 30 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Goals>({ siparis: 50, ciro: 25000, analiz: 20, yeniMusteri: 30 });
  const [progress, setProgress] = useState<Progress>({ siparis: 0, ciro: 0, analiz: 0, yeniMusteri: 0 });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysLeft = daysInMonth - daysPassed;

  useEffect(() => {
    // Hedefleri localStorage'dan yükle
    const savedGoals = localStorage.getItem(MONTH_KEY());
    if (savedGoals) {
      try {
        const g = JSON.parse(savedGoals);
        setGoals(g);
        setDraft(g);
      } catch {}
    }
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

      const [{ data: orders }, { count: analysisCount }] = await Promise.all([
        supabase.from("orders").select("price_num, customer, timestamp").gte("timestamp", startOfMonth).lte("timestamp", endOfMonth),
        supabase.from("analysis_history").select("*", { count: "exact", head: true }).gte("created_at", new Date(startOfMonth).toISOString()),
      ]);

      const siparisCount = orders?.length || 0;
      const ciro = orders?.reduce((s, o) => s + (o.price_num || 0), 0) || 0;
      const uniqueCustomers = new Set(orders?.map(o => o.customer) || []).size;

      setProgress({ siparis: siparisCount, ciro, analiz: analysisCount || 0, yeniMusteri: uniqueCustomers });
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = () => {
    localStorage.setItem(MONTH_KEY(), JSON.stringify(draft));
    setGoals(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pct = (val: number, goal: number) => goal > 0 ? Math.min(Math.round((val / goal) * 100), 100) : 0;

  const KPIS = [
    {
      key: "siparis" as keyof Goals,
      label: "Sipariş Sayısı",
      icon: <ShoppingBag size={20} className="text-blue-600" />,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      current: progress.siparis,
      goal: goals.siparis,
      unit: "adet",
      format: (v: number) => v.toLocaleString("tr-TR"),
    },
    {
      key: "ciro" as keyof Goals,
      label: "Aylık Ciro",
      icon: <TrendingUp size={20} className="text-green-600" />,
      color: "bg-green-600",
      lightColor: "bg-green-50",
      current: progress.ciro,
      goal: goals.ciro,
      unit: "₺",
      format: (v: number) => `${v.toLocaleString("tr-TR")} ₺`,
    },
    {
      key: "analiz" as keyof Goals,
      label: "AI Analiz Sayısı",
      icon: <BarChart3 size={20} className="text-violet-600" />,
      color: "bg-violet-600",
      lightColor: "bg-violet-50",
      current: progress.analiz,
      goal: goals.analiz,
      unit: "adet",
      format: (v: number) => v.toLocaleString("tr-TR"),
    },
    {
      key: "yeniMusteri" as keyof Goals,
      label: "Alışveriş Yapan Müşteri",
      icon: <Target size={20} className="text-orange-600" />,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      current: progress.yeniMusteri,
      goal: goals.yeniMusteri,
      unit: "kişi",
      format: (v: number) => v.toLocaleString("tr-TR"),
    },
  ];

  const overallPct = Math.round(KPIS.reduce((s, k) => s + pct(k.current, k.goal), 0) / KPIS.length);
  const allDone = KPIS.every(k => pct(k.current, k.goal) >= 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Hedefler & KPI</h2>
          <p className="text-slate-500 mt-1">{currentMonth} {currentYear} — {daysLeft} gün kaldı</p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <div className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
              <CheckCircle2 size={14} /> Kaydedildi
            </div>
          )}
          {editing ? (
            <>
              <Button onClick={() => { setEditing(false); setDraft(goals); }} variant="outline" className="border-slate-200">İptal</Button>
              <Button onClick={saveGoals} className="bg-green-600 hover:bg-green-700 gap-2">
                <Save size={14} /> Kaydet
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} variant="outline" className="border-slate-200 gap-2">
              <Target size={14} /> Hedefleri Düzenle
            </Button>
          )}
        </div>
      </div>

      {/* Genel İlerleme */}
      <Card className={`border-2 shadow-sm ${allDone ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${allDone ? "bg-amber-400" : overallPct >= 75 ? "bg-green-600" : overallPct >= 40 ? "bg-orange-500" : "bg-slate-300"}`}>
              {allDone ? <Trophy size={28} className="text-white" /> : <Flame size={28} className="text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-slate-900">{allDone ? "🎉 Tüm hedeflere ulaştın!" : `Genel İlerleme — %${overallPct}`}</p>
                <p className="text-sm text-slate-500">{daysPassed}/{daysInMonth} gün</p>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${allDone ? "bg-amber-400" : overallPct >= 75 ? "bg-green-500" : overallPct >= 40 ? "bg-orange-400" : "bg-slate-400"}`}
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {overallPct >= 100 ? "Harika! Hedefleri yükselttim istersen." :
                 overallPct >= 75 ? "Çok iyi gidiyorsun, biraz daha!" :
                 overallPct >= 40 ? "Orta yoldasın, hızlan." :
                 "Hedefe ulaşmak için tempo artırılmalı."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {KPIS.map(kpi => {
          const p = pct(kpi.current, kpi.goal);
          const done = p >= 100;
          return (
            <Card key={kpi.key} className={`border-slate-200 shadow-sm ${done ? "ring-2 ring-green-400" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${kpi.lightColor}`}>{kpi.icon}</div>
                    <div>
                      <p className="font-semibold text-slate-800">{kpi.label}</p>
                      {done && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Hedefe Ulaşıldı!</span>}
                    </div>
                  </div>
                  {editing ? (
                    <Input
                      type="number"
                      value={draft[kpi.key]}
                      onChange={e => setDraft(d => ({ ...d, [kpi.key]: Number(e.target.value) }))}
                      className="w-28 h-8 text-right text-sm bg-slate-50 border-slate-300"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Hedef: {kpi.format(kpi.goal)}</span>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-2xl font-extrabold text-slate-900">{loading ? "..." : kpi.format(kpi.current)}</span>
                    <span className={`text-sm font-bold ${done ? "text-green-600" : "text-slate-500"}`}>%{p}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${kpi.color}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>{kpi.format(kpi.current)} gerçekleşti</span>
                  <span>{kpi.format(Math.max(0, kpi.goal - kpi.current))} kaldı</span>
                </div>

                {/* Günlük hedef tavsiyesi */}
                {!done && daysLeft > 0 && kpi.goal > kpi.current && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                    Hedefe ulaşmak için günde <strong>{kpi.key === "ciro"
                      ? `${Math.ceil((kpi.goal - kpi.current) / daysLeft).toLocaleString("tr-TR")} ₺`
                      : `${Math.ceil((kpi.goal - kpi.current) / daysLeft)} ${kpi.unit}`
                    }</strong> gerekiyor.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Ay Değiştir notu */}
      <p className="text-center text-xs text-slate-400">
        Hedefler her ay sıfırlanır. Geçmiş aylara ait veriler Supabase'de saklanmaya devam eder.
      </p>
    </div>
  );
}
