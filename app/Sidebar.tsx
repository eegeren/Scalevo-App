"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Search, TrendingUp, ChevronRight, LogOut, User, Store, Settings, Sparkles, Boxes, Users, Scale, Target, ShieldCheck, Building2, Crosshair, Crown, Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import BrandIcon from "@/components/brand/BrandIcon";
import { useLang } from "@/lib/context/LanguageContext";

const sidebarLabels = {
  tr: {
    dashboard: "Yönetim Paneli",
    overview: "Genel Bakış",
    analysis: "Ürün Analiz & Skor",
    aiTools: "AI Araçlar",
    compare: "Ürün Karşılaştır",
    operations: "Operasyonlar",
    stock: "Stok Yönetimi",
    customers: "Müşteriler",
    goals: "Hedefler & KPI",
    competitors: "Rakip Takibi",
    finance: "Finansal Durum",
    marketplaces: "Pazaryerleri",
    myStore: "Mağazam",
    settings: "Ayarlar",
    admin: "Admin Paneli",
    freePlan: "Ücretsiz Plan",
    proPlan: "Pro Plan — Aktif",
    maxPlan: "Max Plan — Aktif",
    upgradeBtn: "Pro'ya Geç",
    analysisUsed: (used: number) => `${used} / 20 analiz kullanıldı`,
    logout: "Çıkış Yap",
  },
  en: {
    dashboard: "Dashboard",
    overview: "Overview",
    analysis: "Product Analysis & Score",
    aiTools: "AI Tools",
    compare: "Compare Products",
    operations: "Operations",
    stock: "Stock Management",
    customers: "Customers",
    goals: "Goals & KPI",
    competitors: "Competitor Tracking",
    finance: "Financial Status",
    marketplaces: "Marketplaces",
    myStore: "My Store",
    settings: "Settings",
    admin: "Admin Panel",
    freePlan: "Free Plan",
    proPlan: "Pro Plan — Active",
    maxPlan: "Max Plan — Active",
    upgradeBtn: "Go Pro",
    analysisUsed: (used: number) => `${used} / 20 analyses used`,
    logout: "Sign Out",
  },
} as const;

const ADMIN_EMAILS = ["egeevren@gmail.com", "admin@scalevo.com", "yusufege.erenn@gmail.com"];

interface SidebarProps {
  user: { name: string; email: string } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggle } = useLang();
  const t = sidebarLabels[lang];
  const [storeName, setStoreName] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<{ plan: string; analysisUsed: number } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scalevo_store");
      if (stored) {
        const data = JSON.parse(stored);
        setStoreName(data.magazaAdi || null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: sub } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).single();
        const plan = sub?.plan || "free";
        if (plan === "free") {
          const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
          const { count } = await supabase.from("analysis_history").select("*", { count: "exact", head: true }).gte("created_at", start.toISOString());
          setPlanInfo({ plan, analysisUsed: count || 0 });
        } else {
          setPlanInfo({ plan, analysisUsed: 0 });
        }
      } catch {}
    };
    loadPlan();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/tanitim";
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 shadow-sm sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-3 mb-10 px-2">
        <BrandIcon className="flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="font-bold text-lg text-slate-900 tracking-tight">Scalevo</h1>
          {storeName ? (
            <p className="text-xs text-green-600 font-semibold truncate">🏪 {storeName}</p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">{t.dashboard}</p>
          )}
        </div>
      </div>

      <nav className="space-y-1.5">
        <NavItem href="/" icon={<LayoutDashboard size={18} />} label={t.overview} active={pathname === "/"} />
        <NavItem href="/analiz" icon={<Search size={18} />} label={t.analysis} active={pathname.startsWith("/analiz")} />
        <NavItem href="/ai-araclar" icon={<Sparkles size={18} />} label={t.aiTools} active={pathname === "/ai-araclar"} badge="Yeni" />
        <NavItem href="/karsilastir" icon={<Scale size={18} />} label={t.compare} active={pathname === "/karsilastir"} />
        <NavItem href="/operasyonlar" icon={<ShoppingBag size={18} />} label={t.operations} active={pathname === "/operasyonlar"} />
        <NavItem href="/stok" icon={<Boxes size={18} />} label={t.stock} active={pathname === "/stok"} />
        <NavItem href="/musteriler" icon={<Users size={18} />} label={t.customers} active={pathname === "/musteriler"} />
        <NavItem href="/hedefler" icon={<Target size={18} />} label={t.goals} active={pathname === "/hedefler"} />
        <NavItem href="/rakip-takip" icon={<Crosshair size={18} />} label={t.competitors} active={pathname === "/rakip-takip"} />
        <NavItem href="/finans" icon={<TrendingUp size={18} />} label={t.finance} active={pathname === "/finans"} />
        <NavItem href="/pazaryerleri" icon={<Store size={18} />} label={t.marketplaces} active={pathname === "/pazaryerleri"} badge="Yeni" />
        {storeName && (
          <NavItem href="/magazam" icon={<Building2 size={18} />} label={t.myStore} active={pathname === "/magazam"} />
        )}

        <div className="border-t border-slate-100 my-2" />

        <NavItem href="/ayarlar" icon={<Settings size={18} />} label={t.settings} active={pathname === "/ayarlar"} />

        {/* Admin linki — sadece yetkili e-postalar */}
        {user && ADMIN_EMAILS.includes(user.email?.toLowerCase()) && (
          <>
            <div className="border-t border-slate-100 my-2" />
            <NavItem href="/admin" icon={<ShieldCheck size={18} />} label={t.admin} active={pathname === "/admin"} badge="Admin" />
          </>
        )}
      </nav>

      <div className="mt-4 space-y-3">
        {/* Plan bilgisi */}
        {planInfo && (
          planInfo.plan === "free" ? (
            <Link href="/upgrade" className="block">
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-green-700">{t.freePlan}</span>
                  <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">{t.upgradeBtn}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min((planInfo.analysisUsed / 20) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">{t.analysisUsed(planInfo.analysisUsed)}</p>
              </div>
            </Link>
          ) : (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-amber-700">
                  {planInfo.plan === "max" ? t.maxPlan : t.proPlan}
                </span>
              </div>
            </div>
          )
        )}

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-9 h-9 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* TR / EN Toggle */}
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
        >
          <Globe size={14} />
          {lang === "tr" ? "🇹🇷 Türkçe" : "🇬🇧 English"}
          <span className="ml-auto text-slate-400">{lang === "tr" ? "EN →" : "TR →"}</span>
        </button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 justify-start"
          onClick={handleLogout}
        >
          <LogOut size={16} /> {t.logout}
        </Button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, href, active = false, badge }: { icon: any, label: string, href: string, active?: boolean, badge?: string }) {
  return (
    <Link href={href} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
      active
        ? 'bg-slate-100 text-green-600 font-semibold'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}>
      <span className={`${active ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
      {badge && !active && (
        <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
      {active && <ChevronRight size={16} className="ml-auto text-green-600" />}
    </Link>
  );
}
