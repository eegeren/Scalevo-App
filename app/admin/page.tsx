"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck, BarChart2, ShoppingBag, Package, AlertCircle,
  RefreshCw, Users, TrendingUp, Zap, CheckCircle2, XCircle,
  Clock, Activity, Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Admin e-postalar — env ile de eşleşmeli
const ADMIN_EMAILS = ["egeevren@gmail.com", "admin@scalevo.com", "yusufege.erenn@gmail.com"];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:        { label: "Yeni", color: "bg-green-100 text-green-700" },
  preparing:  { label: "Hazırlanıyor", color: "bg-orange-100 text-orange-700" },
  shipped:    { label: "Kargoda", color: "bg-blue-100 text-blue-700" },
  completed:  { label: "Tamamlandı", color: "bg-slate-100 text-slate-600" },
  returned:   { label: "İade", color: "bg-red-100 text-red-600" },
};

export default function AdminPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "analyses" | "orders" | "errors">("overview");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser) { setAuthorized(false); return; }
      const email = sbUser.email || "";
      setUser({ email });
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || ADMIN_EMAILS.length === 0;
      setAuthorized(isAdmin);
      if (isAdmin) fetchStats(email);
    };
    checkUser();
  }, []);

  const fetchStats = async (email?: string) => {
    const targetEmail = email || user?.email;
    if (!targetEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stats", email: targetEmail }),
      });
      const d = await res.json();
      setData(d);
      setLastRefresh(new Date());
    } catch {}
    setLoading(false);
  };

  // ── Loading ──
  if (authorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3">
        <RefreshCw size={24} className="animate-spin text-green-600" />
        <p className="text-slate-500 text-sm">Yetki kontrol ediliyor...</p>
      </div>
    );
  }

  // ── Yetkisiz ──
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <XCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Erişim Reddedildi</h2>
          <p className="text-slate-500 text-sm">Bu sayfaya erişim yetkiniz yok.</p>
          <p className="text-xs text-slate-400">Giriş yapılan hesap: {user?.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Paneli</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {user?.email} · {lastRefresh ? `Son güncelleme: ${lastRefresh.toLocaleTimeString("tr-TR")}` : "Yükleniyor..."}
            </p>
          </div>
        </div>
        <Button
          onClick={() => fetchStats()}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Yenile
        </Button>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: "overview", label: "Genel Bakış", icon: Activity },
          { id: "analyses", label: "Analizler", icon: BarChart2 },
          { id: "orders", label: "Siparişler", icon: ShoppingBag },
          { id: "errors", label: "Hatalar", icon: AlertCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
            {tab.id === "errors" && data?.recentErrors?.length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {Math.min(data.recentErrors.length, 9)}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-green-600 animate-spin" />
          </div>
        </div>
      ) : (
        <>
          {/* ── Genel Bakış ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* İstatistik kartları */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={<BarChart2 size={20} className="text-green-600" />}
                  label="Toplam Analiz"
                  value={data?.stats?.totalAnalyses ?? "—"}
                  color="bg-green-50"
                  desc="Tüm kullanıcıların analizleri"
                />
                <StatCard
                  icon={<ShoppingBag size={20} className="text-blue-600" />}
                  label="Toplam Sipariş"
                  value={data?.stats?.totalOrders ?? "—"}
                  color="bg-blue-50"
                  desc="Tüm kullanıcıların siparişleri"
                />
                <StatCard
                  icon={<Package size={20} className="text-purple-600" />}
                  label="Toplam Ürün"
                  value={data?.stats?.totalProducts ?? "—"}
                  color="bg-purple-50"
                  desc="Stok kayıtları"
                />
              </div>

              {/* Sistem durumu */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Activity size={15} className="text-green-600" /> Sistem Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {[
                    { name: "Supabase DB", status: data ? "ok" : "loading" },
                    { name: "OpenAI API", status: "ok" },
                    { name: "Auth Servisi", status: data ? "ok" : "loading" },
                    { name: "Hata Sayısı", status: (data?.recentErrors?.length || 0) > 5 ? "warn" : "ok", value: data?.recentErrors?.length || 0 },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === "ok" ? "bg-green-500" :
                          item.status === "warn" ? "bg-orange-400" :
                          "bg-slate-300 animate-pulse"
                        }`} />
                        <span className="text-sm text-slate-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value !== undefined && (
                          <span className="text-xs font-bold text-slate-500">{item.value}</span>
                        )}
                        <span className={`text-xs font-medium ${
                          item.status === "ok" ? "text-green-600" :
                          item.status === "warn" ? "text-orange-500" :
                          "text-slate-400"
                        }`}>
                          {item.status === "ok" ? "Çalışıyor" : item.status === "warn" ? "Dikkat" : "Kontrol ediliyor"}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Son hatalar (özet) */}
              {data?.recentErrors?.length > 0 && (
                <Card className="border-red-100 bg-red-50/30 shadow-sm">
                  <CardHeader className="pb-2 border-b border-red-100">
                    <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                      <AlertCircle size={14} /> Son Hatalar ({data.recentErrors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {data.recentErrors.slice(0, 3).map((err: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-lg border border-red-100">
                        <p className="text-xs font-semibold text-red-800 truncate">{err.message || "Bilinmeyen hata"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">{err.path || "—"}</span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-400">
                            {err.created_at ? new Date(err.created_at).toLocaleString("tr-TR") : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                    {data.recentErrors.length > 3 && (
                      <button onClick={() => setActiveTab("errors")} className="text-xs text-red-600 font-medium hover:underline">
                        + {data.recentErrors.length - 3} daha → Tümünü gör
                      </button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ── Analizler ── */}
          {activeTab === "analyses" && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart2 size={14} className="text-green-600" /> Son 10 Analiz (Tüm Kullanıcılar)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!data?.recentAnalyses?.length ? (
                  <p className="text-center py-12 text-slate-400 text-sm">Henüz analiz yok.</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {data.recentAnalyses.map((a: any, i: number) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{a.product_name}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(a.created_at).toLocaleString("tr-TR")}
                          </p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          a.score >= 75 ? 'bg-green-100 text-green-700' :
                          a.score >= 50 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {a.score}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Siparişler ── */}
          {activeTab === "orders" && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-blue-600" /> Son 10 Sipariş (Tüm Kullanıcılar)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!data?.recentOrders?.length ? (
                  <p className="text-center py-12 text-slate-400 text-sm">Henüz sipariş yok.</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {data.recentOrders.map((o: any, i: number) => {
                      const st = STATUS_LABELS[o.status] || STATUS_LABELS.new;
                      return (
                        <div key={i} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{o.customer}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{o.item} · {o.date}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                            <span className="text-sm font-bold text-slate-700">{o.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Hatalar ── */}
          {activeTab === "errors" && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" /> Uygulama Hataları
                  {data?.recentErrors?.length > 0 && (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 text-[10px]">
                      {data.recentErrors.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {!data?.recentErrors?.length ? (
                  <div className="text-center py-16 flex flex-col items-center gap-3">
                    <CheckCircle2 size={40} className="text-green-400" />
                    <p className="text-slate-500 font-medium">Harika! Kayıtlı hata yok.</p>
                    <p className="text-xs text-slate-400">API hataları burada görünür. app_errors tablosu boş.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentErrors.map((err: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-red-900">{err.message || "Bilinmeyen hata"}</p>
                            {err.path && (
                              <p className="text-xs text-slate-500 mt-0.5">📍 {err.path}</p>
                            )}
                            {err.user_email && (
                              <p className="text-xs text-slate-500">👤 {err.user_email}</p>
                            )}
                            {err.stack && (
                              <details className="mt-2">
                                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Stack trace</summary>
                                <pre className="text-[10px] text-slate-500 mt-1 overflow-x-auto bg-white p-2 rounded border border-slate-100 whitespace-pre-wrap">{err.stack}</pre>
                              </details>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">
                            {err.created_at ? new Date(err.created_at).toLocaleString("tr-TR") : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, desc }: any) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-3xl font-black text-slate-900">{value}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400">{desc}</p>
      </CardContent>
    </Card>
  );
}
