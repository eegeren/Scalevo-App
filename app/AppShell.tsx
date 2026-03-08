"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Search,
  TrendingUp,
  Store,
  Boxes,
  Users,
  Target,
  Settings,
  Scale,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./Sidebar";
import BrandIcon from "@/components/brand/BrandIcon";
import { useLang } from "@/lib/context/LanguageContext";
import { translateText } from "@/lib/i18n/runtime";

interface AppShellProps {
  children: React.ReactNode;
  user: { name: string; email: string } | null;
}

const BOTTOM_NAV = [
  { href: "/", icon: LayoutDashboard, label: "Panel" },
  { href: "/analiz", icon: Search, label: "Analiz" },
  { href: "/ai-araclar", icon: Sparkles, label: "AI" },
  { href: "/operasyonlar", icon: ShoppingBag, label: "Siparişler" },
  { href: "/stok", icon: Boxes, label: "Stok" },
];

const ADMIN_EMAILS_SHELL = ["egeevren@gmail.com", "admin@scalevo.com", "yusufege.erenn@gmail.com"];

const DRAWER_NAV = [
  { href: "/", icon: LayoutDashboard, label: "Genel Bakış" },
  { href: "/analiz", icon: Search, label: "Ürün Analiz & Skor" },
  { href: "/ai-araclar", icon: Sparkles, label: "AI Araçlar", badge: "Yeni" },
  { href: "/karsilastir", icon: Scale, label: "Ürün Karşılaştır" },
  { href: "/operasyonlar", icon: ShoppingBag, label: "Operasyonlar" },
  { href: "/stok", icon: Boxes, label: "Stok Yönetimi" },
  { href: "/musteriler", icon: Users, label: "Müşteriler" },
  { href: "/hedefler", icon: Target, label: "Hedefler & KPI" },
  { href: "/finans", icon: TrendingUp, label: "Finansal Durum" },
  { href: "/pazaryerleri", icon: Store, label: "Pazaryerleri" },
  { href: "/ayarlar", icon: Settings, label: "Ayarlar" },
];

export default function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const { lang } = useLang();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = (value: string) => translateText(value, lang);

  const isAuthRoute =
    pathname === "/giris" ||
    pathname === "/kayit" ||
    pathname === "/tanitim" ||
    pathname === "/onboarding" ||
    pathname === "/kvkk" ||
    pathname?.startsWith("/paylasim");

  if (isAuthRoute) return <>{children}</>;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/tanitim";
  };

  const drawerItems = [
    ...DRAWER_NAV,
    ...(user && ADMIN_EMAILS_SHELL.includes(user.email?.toLowerCase())
      ? [{ href: "/admin", icon: ShieldCheck, label: "Admin Paneli", badge: "Admin" }]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <BrandIcon size="sm" />
                <span className="font-bold text-slate-900">Scalevo</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
              {drawerItems.map((item) => {
                const active = item.href === "/" ? pathname === "/" : (pathname?.startsWith(item.href) ?? false);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-green-50 text-green-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={17} className={active ? "text-green-600" : "text-slate-400"} />
                    <span>{t(item.label)}</span>
                    {item.badge && !active && (
                      <span className="ml-auto rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 border-t border-slate-100 p-4">
              {user && (
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                    {user.name?.slice(0, 1).toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="truncate text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
              >
                <LogOut size={15} />
                {lang === "tr" ? "Cikis Yap" : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <BrandIcon size="sm" />
            <span className="text-sm font-bold text-slate-900">Scalevo</span>
          </div>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-lg md:hidden">
          <div className="flex items-stretch">
            {BOTTOM_NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : (pathname?.startsWith(item.href) ?? false);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                    active ? "text-green-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-green-600" : ""} />
                  <span className={`text-[10px] font-semibold ${active ? "text-green-600" : ""}`}>
                    {t(item.label)}
                  </span>
                  {active && <div className="h-0.5 w-6 rounded-full bg-green-500" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
