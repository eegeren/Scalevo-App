"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Search,
  TrendingUp,
  ChevronRight,
  LogOut,
  User,
  Store,
  Settings,
  Sparkles,
  Boxes,
  Users,
  Scale,
  Target,
  ShieldCheck,
  Building2,
  Crosshair,
  Crown,
} from "lucide-react";
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
  const { lang } = useLang();
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
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: sub } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).single();
        const plan = sub?.plan || "free";

        if (plan === "free") {
          const start = new Date();
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          const { count } = await supabase
            .from("analysis_history")
            .select("*", { count: "exact", head: true })
            .gte("created_at", start.toISOString());
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
    <aside className="sticky top-0 hidden h-screen w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-sm md:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <BrandIcon className="flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Scalevo</h1>
          {storeName ? (
            <p className="truncate text-xs font-semibold text-green-600">{storeName}</p>
          ) : (
            <p className="text-xs font-medium text-slate-500">{t.dashboard}</p>
          )}
        </div>
      </div>

      <nav className="space-y-1.5">
        <NavItem href="/" icon={<LayoutDashboard size={18} />} label={t.overview} active={pathname === "/"} />
        <NavItem href="/analiz" icon={<Search size={18} />} label={t.analysis} active={pathname?.startsWith("/analiz") ?? false} />
        <NavItem href="/ai-araclar" icon={<Sparkles size={18} />} label={t.aiTools} active={pathname === "/ai-araclar"} badge="Yeni" />
        <NavItem href="/karsilastir" icon={<Scale size={18} />} label={t.compare} active={pathname === "/karsilastir"} />
        <NavItem href="/operasyonlar" icon={<ShoppingBag size={18} />} label={t.operations} active={pathname === "/operasyonlar"} />
        <NavItem href="/stok" icon={<Boxes size={18} />} label={t.stock} active={pathname === "/stok"} />
        <NavItem href="/musteriler" icon={<Users size={18} />} label={t.customers} active={pathname === "/musteriler"} />
        <NavItem href="/hedefler" icon={<Target size={18} />} label={t.goals} active={pathname === "/hedefler"} />
        <NavItem href="/rakip-takip" icon={<Crosshair size={18} />} label={t.competitors} active={pathname === "/rakip-takip"} />
        <NavItem href="/finans" icon={<TrendingUp size={18} />} label={t.finance} active={pathname === "/finans"} />
        <NavItem href="/pazaryerleri" icon={<Store size={18} />} label={t.marketplaces} active={pathname === "/pazaryerleri"} badge="Yeni" />
        {storeName && <NavItem href="/magazam" icon={<Building2 size={18} />} label={t.myStore} active={pathname === "/magazam"} />}

        <div className="my-2 border-t border-slate-100" />

        <NavItem href="/ayarlar" icon={<Settings size={18} />} label={t.settings} active={pathname === "/ayarlar"} />

        {user && ADMIN_EMAILS.includes(user.email?.toLowerCase()) && (
          <>
            <div className="my-2 border-t border-slate-100" />
            <NavItem href="/admin" icon={<ShieldCheck size={18} />} label={t.admin} active={pathname === "/admin"} badge="Admin" />
          </>
        )}
      </nav>

      <div className="mt-4 space-y-3">
        {planInfo &&
          (planInfo.plan === "free" ? (
            <Link href="/upgrade" className="block">
              <div className="cursor-pointer rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 transition-colors hover:border-green-400">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-green-700">{t.freePlan}</span>
                  <span className="rounded-full bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">{t.upgradeBtn}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-200">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{ width: `${Math.min((planInfo.analysisUsed / 20) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-green-600">{t.analysisUsed(planInfo.analysisUsed)}</p>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-3">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-amber-700">{planInfo.plan === "max" ? t.maxPlan : t.proPlan}</span>
              </div>
            </div>
          ))}

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <User size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={16} /> {t.logout}
        </Button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
  active = false,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex w-full items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200 ${
        active ? "bg-slate-100 font-semibold text-green-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-green-600" : "text-slate-400 group-hover:text-slate-600"}>{icon}</span>
      <span className="text-sm">{label}</span>
      {badge && !active && <span className="ml-auto rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">{badge}</span>}
      {active && <ChevronRight size={16} className="ml-auto text-green-600" />}
    </Link>
  );
}
