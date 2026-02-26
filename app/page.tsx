"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BrainCircuit, AlertCircle, DollarSign, Package, TrendingUp, ShoppingBag, BarChart2, Clock,
  ArrowUpRight, CheckCircle2, Truck, Share2, Copy, Check
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    try {
      const res = await fetch("/api/analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun: query }),
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
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-400 font-medium">
            {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">Panelin seni bekliyor.</p>
        </div>
      </header>

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
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h4 className="text-2xl font-semibold text-slate-700">Ürün Fikri Doğrulama</h4>
            <p className="text-slate-500">Ürün adını gir, potansiyelini yapay zeka ile ölçelim.</p>
            <div className="flex gap-2 relative max-w-lg mx-auto">
              <Input
                placeholder="Örn: Kedi Su Pınarı"
                className="h-12 text-lg px-4 border-slate-200 focus-visible:ring-green-500 shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Button
                size="lg"
                className="h-12 px-8 bg-green-600 hover:bg-green-700 font-medium min-w-[140px]"
                onClick={handleAnalyze}
                disabled={loading}
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
