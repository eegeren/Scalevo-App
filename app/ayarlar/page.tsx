"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  User, KeyRound, Store, Bell, ShieldAlert, Eye, EyeOff,
  CheckCircle2, RefreshCw, AlertCircle, Save, LogOut, Trash2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Tab = "profil" | "pazaryeri" | "bildirimler" | "hesap";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "profil", label: "Profil", icon: <User size={16} /> },
  { id: "pazaryeri", label: "Pazaryeri", icon: <Store size={16} /> },
  { id: "bildirimler", label: "Bildirimler", icon: <Bell size={16} /> },
  { id: "hesap", label: "Hesap Güvenliği", icon: <ShieldAlert size={16} /> },
];

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Başlık */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Ayarlar</h2>
        <p className="text-slate-500 mt-1">Hesap ve entegrasyon ayarlarını yönet.</p>
      </div>

      {/* Toast Bildirimi */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sol Menü */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1 sticky top-6">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-green-50 text-green-700 font-semibold border border-green-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={activeTab === tab.id ? "text-green-600" : "text-slate-400"}>
                  {tab.icon}
                </span>
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto text-green-500" />}
              </button>
            ))}
          </nav>
        </div>

        {/* İçerik */}
        <div className="flex-1">
          {activeTab === "profil" && <ProfilTab onToast={showToast} />}
          {activeTab === "pazaryeri" && <PazaryeriTab onToast={showToast} />}
          {activeTab === "bildirimler" && <BildirimlerTab onToast={showToast} />}
          {activeTab === "hesap" && <HesapTab onToast={showToast} />}
        </div>
      </div>
    </div>
  );
}

/* ─── PROFİL ─── */
function ProfilTab({ onToast }: { onToast: (msg: string, type?: "success" | "error") => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.name || "");
        setEmail(user.email || "");
      }
    };
    load();
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ data: { name } });
      if (error) throw error;
      onToast("Profil güncellendi ✓");
    } catch {
      onToast("Güncelleme başarısız.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base flex items-center gap-2">
          <User size={18} className="text-green-600" /> Profil Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm">
            {name ? name.slice(0, 2).toUpperCase() : "??"}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{name || "—"}</p>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Ad Soyad</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Adınızı girin"
            className="bg-slate-50 border-slate-200 focus-visible:ring-green-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">E-posta</label>
          <Input
            value={email}
            disabled
            className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">E-posta değiştirme için destek ekibiyle iletişime geçin.</p>
        </div>

        <Button
          onClick={save}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 gap-2"
        >
          {loading ? <><RefreshCw size={14} className="animate-spin" /> Kaydediliyor...</> : <><Save size={14} /> Kaydet</>}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── PAZARYERİ ─── */
function PazaryeriTab({ onToast }: { onToast: (msg: string, type?: "success" | "error") => void }) {
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, string>>({});
  const [creds, setCreds] = useState({
    trendyol: { supplierId: "", apiKey: "", apiSecret: "", connected: false },
    hepsiburada: { username: "", password: "", merchantId: "", connected: false },
  });
  const [showTYSecret, setShowTYSecret] = useState(false);
  const [showHBPassword, setShowHBPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("marketplace_creds");
    if (saved) {
      try { setCreds(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveCreds = (platform: "trendyol" | "hepsiburada", data: any) => {
    const updated = { ...creds, [platform]: { ...creds[platform], ...data } };
    setCreds(updated);
    localStorage.setItem("marketplace_creds", JSON.stringify(updated));
  };

  const syncPlatform = async (platform: "trendyol" | "hepsiburada") => {
    setLoading(true);
    setSyncStatus(prev => ({ ...prev, [platform]: "syncing" }));
    try {
      if (platform === "trendyol") {
        const { supplierId, apiKey, apiSecret } = creds.trendyol;
        if (!supplierId || !apiKey || !apiSecret) {
          onToast("Trendyol bilgilerini eksiksiz doldurun.", "error");
          return;
        }
        await fetch("/api/trendyol", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getOrders", supplierId, apiKey, apiSecret }),
        });
        saveCreds("trendyol", { connected: true });
      } else {
        const { username, password, merchantId } = creds.hepsiburada;
        if (!username || !password) {
          onToast("Hepsiburada bilgilerini eksiksiz doldurun.", "error");
          return;
        }
        await fetch("/api/hepsiburada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getOrders", username, password, merchantId }),
        });
        saveCreds("hepsiburada", { connected: true });
      }
      setSyncStatus(prev => ({ ...prev, [platform]: "success" }));
      onToast(`${platform === "trendyol" ? "Trendyol" : "Hepsiburada"} başarıyla bağlandı ✓`);
      setTimeout(() => setSyncStatus(prev => ({ ...prev, [platform]: "" })), 3000);
    } catch {
      setSyncStatus(prev => ({ ...prev, [platform]: "error" }));
      onToast("Bağlantı başarısız.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Trendyol */}
      <Card className="border-orange-100 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-lg" />
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-xl">🟠</span> Trendyol Entegrasyonu
            {creds.trendyol.connected && (
              <Badge className="ml-auto bg-green-100 text-green-700 border-0 text-xs">
                <CheckCircle2 size={11} className="mr-1" /> Bağlı
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-100 rounded-lg text-xs text-orange-700">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>Trendyol Satıcı Paneli → Hesabım → API Entegrasyon bölümünden alın.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Tedarikçi ID</label>
              <Input
                placeholder="12345678"
                value={creds.trendyol.supplierId}
                onChange={e => saveCreds("trendyol", { supplierId: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">API Key</label>
              <Input
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={creds.trendyol.apiKey}
                onChange={e => saveCreds("trendyol", { apiKey: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">API Secret</label>
            <div className="relative">
              <Input
                type={showTYSecret ? "text" : "password"}
                placeholder="••••••••••••"
                value={creds.trendyol.apiSecret}
                onChange={e => saveCreds("trendyol", { apiSecret: e.target.value })}
                className="bg-slate-50 border-slate-200 pr-10"
              />
              <button type="button" onClick={() => setShowTYSecret(!showTYSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                {showTYSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button onClick={() => syncPlatform("trendyol")} disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
            {syncStatus.trendyol === "syncing" ? <><RefreshCw size={14} className="animate-spin" /> Senkronize ediliyor...</> :
             syncStatus.trendyol === "success" ? <><CheckCircle2 size={14} /> Başarılı!</> :
             <><RefreshCw size={14} /> Bağlan & Senkronize Et</>}
          </Button>
        </CardContent>
      </Card>

      {/* Hepsiburada */}
      <Card className="border-amber-100 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-lg" />
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-xl">🟡</span> Hepsiburada Entegrasyonu
            {creds.hepsiburada.connected && (
              <Badge className="ml-auto bg-green-100 text-green-700 border-0 text-xs">
                <CheckCircle2 size={11} className="mr-1" /> Bağlı
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>Hepsiburada Merchant Portal → API Entegrasyon bölümünden bilgileri alın.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Kullanıcı Adı / E-posta</label>
              <Input
                placeholder="magaza@email.com"
                value={creds.hepsiburada.username}
                onChange={e => saveCreds("hepsiburada", { username: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Merchant ID</label>
              <Input
                placeholder="HB_MERCHANT_ID"
                value={creds.hepsiburada.merchantId}
                onChange={e => saveCreds("hepsiburada", { merchantId: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Şifre / API Key</label>
            <div className="relative">
              <Input
                type={showHBPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={creds.hepsiburada.password}
                onChange={e => saveCreds("hepsiburada", { password: e.target.value })}
                className="bg-slate-50 border-slate-200 pr-10"
              />
              <button type="button" onClick={() => setShowHBPassword(!showHBPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                {showHBPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button onClick={() => syncPlatform("hepsiburada")} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
            {syncStatus.hepsiburada === "syncing" ? <><RefreshCw size={14} className="animate-spin" /> Senkronize ediliyor...</> :
             syncStatus.hepsiburada === "success" ? <><CheckCircle2 size={14} /> Başarılı!</> :
             <><RefreshCw size={14} /> Bağlan & Senkronize Et</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── BİLDİRİMLER ─── */
function BildirimlerTab({ onToast }: { onToast: (msg: string, type?: "success" | "error") => void }) {
  const [prefs, setPrefs] = useState({
    yeniSiparis: true,
    analizTamamlandi: true,
    dusukStok: false,
    haftalikRapor: true,
    email: true,
    browser: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const save = () => {
    localStorage.setItem("scalevo_notif_prefs", JSON.stringify(prefs));
    onToast("Bildirim tercihleri kaydedildi ✓");
  };

  useEffect(() => {
    const saved = localStorage.getItem("scalevo_notif_prefs");
    if (saved) {
      try { setPrefs(JSON.parse(saved)); } catch {}
    }
  }, []);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell size={18} className="text-green-600" /> Bildirim Tercihleri
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Bildirim Türleri</p>
          <div className="space-y-3">
            <Toggle label="Yeni sipariş geldiğinde" checked={prefs.yeniSiparis} onChange={() => toggle("yeniSiparis")} />
            <Toggle label="Ürün analizi tamamlandığında" checked={prefs.analizTamamlandi} onChange={() => toggle("analizTamamlandi")} />
            <Toggle label="Stok kritik seviyeye düştüğünde" checked={prefs.dusukStok} onChange={() => toggle("dusukStok")} />
            <Toggle label="Haftalık performans raporu" checked={prefs.haftalikRapor} onChange={() => toggle("haftalikRapor")} />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Bildirim Kanalları</p>
          <div className="space-y-3">
            <Toggle label="E-posta bildirimleri" checked={prefs.email} onChange={() => toggle("email")} />
            <Toggle label="Tarayıcı bildirimleri" checked={prefs.browser} onChange={() => toggle("browser")} />
          </div>
        </div>

        <Button onClick={save} className="bg-green-600 hover:bg-green-700 gap-2">
          <Save size={14} /> Tercihleri Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── HESAP GÜVENLİĞİ ─── */
function HesapTab({ onToast }: { onToast: (msg: string, type?: "success" | "error") => void }) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const changePassword = async () => {
    if (password !== passwordConfirm) {
      onToast("Şifreler eşleşmiyor.", "error");
      return;
    }
    if (password.length < 8) {
      onToast("Şifre en az 8 karakter olmalı.", "error");
      return;
    }
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setPasswordConfirm("");
      onToast("Şifre güncellendi ✓");
    } catch (e: any) {
      onToast(e.message || "Şifre güncellenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="space-y-4">
      {/* Şifre Değiştir */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound size={18} className="text-green-600" /> Şifre Değiştir
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Yeni Şifre</label>
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                placeholder="En az 8 karakter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-200 pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Yeni Şifre (Tekrar)</label>
            <Input
              type="password"
              placeholder="Şifreyi tekrar gir"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className="bg-slate-50 border-slate-200"
            />
          </div>
          <Button onClick={changePassword} disabled={loading || !password || !passwordConfirm} className="bg-green-600 hover:bg-green-700 gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Değiştiriliyor...</> : <><Save size={14} /> Şifreyi Değiştir</>}
          </Button>
        </CardContent>
      </Card>

      {/* Oturumu Kapat */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Oturumu Kapat</p>
              <p className="text-sm text-slate-500">Tüm cihazlarda oturumu kapat.</p>
            </div>
            <Button onClick={signOut} variant="outline" className="border-slate-300 text-slate-700 gap-2">
              <LogOut size={14} /> Çıkış Yap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tehlike Bölgesi */}
      <Card className="border-red-200 shadow-sm">
        <CardHeader className="border-b border-red-100">
          <CardTitle className="text-base text-red-600 flex items-center gap-2">
            <ShieldAlert size={18} /> Tehlike Bölgesi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
            <strong>Dikkat:</strong> Hesabı silmek geri alınamaz. Tüm analiz geçmişi, siparişler ve ayarlar kalıcı olarak silinir.
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Onaylamak için <span className="text-red-600 font-bold">SİL</span> yazın
            </label>
            <Input
              placeholder="SİL"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              className="bg-slate-50 border-red-200 focus-visible:ring-red-400 max-w-xs"
            />
          </div>
          <Button
            disabled={deleteConfirm !== "SİL"}
            variant="outline"
            className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white gap-2 disabled:opacity-40"
          >
            <Trash2 size={14} /> Hesabı Kalıcı Olarak Sil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── TOGGLE BİLEŞENİ ─── */
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer" onClick={onChange}>
      <span className="text-sm text-slate-700 font-medium">{label}</span>
      <div className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${checked ? "bg-green-500" : "bg-slate-300"}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
    </div>
  );
}
