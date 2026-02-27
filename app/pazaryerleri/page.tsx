"use client";
import PlanGate from "@/components/PlanGate";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag, Package, RefreshCw, CheckCircle2, XCircle,
  Settings, ChevronRight, AlertCircle, Truck, TrendingUp, Store
} from "lucide-react";

type Platform = "trendyol" | "hepsiburada";

interface Credentials {
  trendyol: { supplierId: string; apiKey: string; apiSecret: string; connected: boolean };
  hepsiburada: { username: string; password: string; merchantId: string; connected: boolean };
}

interface MarketOrder {
  external_id: string;
  platform: string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface MarketProduct {
  external_id: string;
  platform: string;
  title: string;
  price: number;
  stock: number;
  status: string;
}

const PLATFORM_INFO = {
  trendyol: {
    name: "Trendyol",
    color: "bg-orange-500",
    lightColor: "bg-orange-50 border-orange-200",
    textColor: "text-orange-600",
    badgeColor: "bg-orange-100 text-orange-700",
    logo: "🟠",
  },
  hepsiburada: {
    name: "Hepsiburada",
    color: "bg-orange-600",
    lightColor: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
    logo: "🟡",
  },
};

export default function PazaryerleriPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, string>>({});

  const [creds, setCreds] = useState<Credentials>({
    trendyol: { supplierId: "", apiKey: "", apiSecret: "", connected: false },
    hepsiburada: { username: "", password: "", merchantId: "", connected: false },
  });

  // LocalStorage'dan kayıtlı ayarları yükle
  useEffect(() => {
    const saved = localStorage.getItem("marketplace_creds");
    if (saved) {
      try { setCreds(JSON.parse(saved)); } catch {}
    }

    // Supabase'den siparişleri ve ürünleri çek
    loadFromSupabase();
  }, []);

  const loadFromSupabase = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const [{ data: ordersData }, { data: productsData }] = await Promise.all([
      supabase.from("marketplace_orders").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("marketplace_products").select("*").limit(100),
    ]);

    setOrders((ordersData || []) as MarketOrder[]);
    setProducts((productsData || []) as MarketProduct[]);
  };

  const saveCreds = (platform: Platform, data: any) => {
    const updated = { ...creds, [platform]: { ...creds[platform], ...data } };
    setCreds(updated);
    localStorage.setItem("marketplace_creds", JSON.stringify(updated));
  };

  const syncPlatform = async (platform: Platform) => {
    setLoading(true);
    setSyncStatus(prev => ({ ...prev, [platform]: "syncing" }));

    try {
      if (platform === "trendyol") {
        const { supplierId, apiKey, apiSecret } = creds.trendyol;
        if (!supplierId || !apiKey || !apiSecret) {
          alert("Trendyol bilgilerini doldurun!");
          return;
        }

        await Promise.all([
          fetch("/api/trendyol", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getOrders", supplierId, apiKey, apiSecret }),
          }),
          fetch("/api/trendyol", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getProducts", supplierId, apiKey, apiSecret }),
          }),
        ]);

        saveCreds("trendyol", { connected: true });
      } else {
        const { username, password, merchantId } = creds.hepsiburada;
        if (!username || !password) {
          alert("Hepsiburada bilgilerini doldurun!");
          return;
        }

        await Promise.all([
          fetch("/api/hepsiburada", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getOrders", username, password }),
          }),
          fetch("/api/hepsiburada", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getListings", username, password, merchantId }),
          }),
        ]);

        saveCreds("hepsiburada", { connected: true });
      }

      await loadFromSupabase();
      setSyncStatus(prev => ({ ...prev, [platform]: "success" }));
      setTimeout(() => setSyncStatus(prev => ({ ...prev, [platform]: "" })), 3000);
    } catch (err) {
      setSyncStatus(prev => ({ ...prev, [platform]: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const trendyolOrders = orders.filter(o => o.platform === "trendyol");
  const hbOrders = orders.filter(o => o.platform === "hepsiburada");
  const trendyolProducts = products.filter(p => p.platform === "trendyol");
  const hbProducts = products.filter(p => p.platform === "hepsiburada");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pazaryerleri</h2>
          <p className="text-slate-500 mt-1">Trendyol ve Hepsiburada entegrasyonu</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
            className={activeTab === "dashboard" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Store size={16} className="mr-2" /> Dashboard
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
            className={activeTab === "settings" ? "bg-slate-900 hover:bg-slate-800" : ""}
          >
            <Settings size={16} className="mr-2" /> API Ayarları
          </Button>
        </div>
      </div>

      {/* AYARLAR SEKMESİ */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trendyol */}
          <Card className="border-orange-100 shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-lg" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">🟠</span>
                <div>
                  <p className="font-bold text-slate-900">Trendyol</p>
                  <p className="text-xs text-slate-400 font-normal">Mağaza entegrasyonu</p>
                </div>
                {creds.trendyol.connected && (
                  <Badge className="ml-auto bg-green-100 text-green-700 border-0">
                    <CheckCircle2 size={12} className="mr-1" /> Bağlı
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Tedarikçi ID (Supplier ID)</label>
                <Input
                  placeholder="12345678"
                  value={creds.trendyol.supplierId}
                  onChange={e => saveCreds("trendyol", { supplierId: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">API Key</label>
                <Input
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={creds.trendyol.apiKey}
                  onChange={e => saveCreds("trendyol", { apiKey: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">API Secret</label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={creds.trendyol.apiSecret}
                  onChange={e => saveCreds("trendyol", { apiSecret: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100 text-xs text-orange-700">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>API bilgilerini Trendyol Satıcı Paneli → Ayarlar → API bölümünden alın.</span>
              </div>
              <Button
                onClick={() => syncPlatform("trendyol")}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {syncStatus.trendyol === "syncing" ? (
                  <><RefreshCw size={14} className="mr-2 animate-spin" /> Senkronize ediliyor...</>
                ) : syncStatus.trendyol === "success" ? (
                  <><CheckCircle2 size={14} className="mr-2" /> Başarılı!</>
                ) : (
                  <><RefreshCw size={14} className="mr-2" /> Bağlan & Senkronize Et</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Hepsiburada */}
          <Card className="border-amber-100 shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-lg" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">🟡</span>
                <div>
                  <p className="font-bold text-slate-900">Hepsiburada</p>
                  <p className="text-xs text-slate-400 font-normal">Mağaza entegrasyonu</p>
                </div>
                {creds.hepsiburada.connected && (
                  <Badge className="ml-auto bg-green-100 text-green-700 border-0">
                    <CheckCircle2 size={12} className="mr-1" /> Bağlı
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Kullanıcı Adı</label>
                <Input
                  placeholder="magaza@email.com"
                  value={creds.hepsiburada.username}
                  onChange={e => saveCreds("hepsiburada", { username: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Şifre / API Key</label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={creds.hepsiburada.password}
                  onChange={e => saveCreds("hepsiburada", { password: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Merchant ID</label>
                <Input
                  placeholder="HB_MERCHANT_ID"
                  value={creds.hepsiburada.merchantId}
                  onChange={e => saveCreds("hepsiburada", { merchantId: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>API bilgilerini Hepsiburada Merchant Portal → API Entegrasyon bölümünden alın.</span>
              </div>
              <Button
                onClick={() => syncPlatform("hepsiburada")}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                {syncStatus.hepsiburada === "syncing" ? (
                  <><RefreshCw size={14} className="mr-2 animate-spin" /> Senkronize ediliyor...</>
                ) : syncStatus.hepsiburada === "success" ? (
                  <><CheckCircle2 size={14} className="mr-2" /> Başarılı!</>
                ) : (
                  <><RefreshCw size={14} className="mr-2" /> Bağlan & Senkronize Et</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DASHBOARD SEKMESİ */}
      {activeTab === "dashboard" && (
        <>
          {/* Özet Kartlar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Trendyol Siparişi" value={trendyolOrders.length} icon="🟠" color="bg-orange-50" />
            <StatCard label="HB Siparişi" value={hbOrders.length} icon="🟡" color="bg-amber-50" />
            <StatCard label="Trendyol Ürünü" value={trendyolProducts.length} icon="📦" color="bg-orange-50" />
            <StatCard label="HB Listingi" value={hbProducts.length} icon="📋" color="bg-amber-50" />
          </div>

          {/* Senkronizasyon butonları */}
          <div className="flex gap-3">
            <Button
              onClick={() => syncPlatform("trendyol")}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Trendyol Güncelle
            </Button>
            <Button
              onClick={() => syncPlatform("hepsiburada")}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Hepsiburada Güncelle
            </Button>
          </div>

          {/* Siparişler */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <ShoppingBag size={18} className="text-green-600" />
                Pazaryeri Siparişleri
                <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {orders.length} adet
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag size={40} className="mx-auto mb-3 text-slate-200" />
                  <p>Sipariş yok. API ayarlarını yapıp senkronize edin.</p>
                  <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("settings")}>
                    API Ayarlarına Git
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {orders.slice(0, 20).map((order, i) => {
                    const info = PLATFORM_INFO[order.platform as Platform];
                    return (
                      <div key={i} className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{info?.logo}</span>
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{order.customer_name || "Müşteri"}</p>
                            <p className="text-xs text-slate-400">#{order.external_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${info?.badgeColor}`}>
                            {info?.name}
                          </span>
                          <span className="font-bold text-sm text-slate-800">
                            {order.total_price?.toLocaleString("tr-TR")} ₺
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{order.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ürünler */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Package size={18} className="text-green-600" />
                Pazaryeri Ürünleri
                <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {products.length} adet
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {products.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package size={40} className="mx-auto mb-3 text-slate-200" />
                  <p>Ürün yok. API ayarlarını yapıp senkronize edin.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {products.slice(0, 20).map((product, i) => {
                    const info = PLATFORM_INFO[product.platform as Platform];
                    return (
                      <div key={i} className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{info?.logo}</span>
                          <div>
                            <p className="font-semibold text-sm text-slate-800 truncate max-w-xs">{product.title}</p>
                            <p className="text-xs text-slate-400">SKU: {product.external_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.stock > 10 ? "bg-green-100 text-green-700" :
                            product.stock > 0 ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {product.stock} stok
                          </span>
                          <span className="font-bold text-sm text-slate-800">
                            {product.price?.toLocaleString("tr-TR")} ₺
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {product.status === "active" ? "Aktif" : "Pasif"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className={`p-4 flex items-center gap-3 ${color} rounded-xl`}>
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
