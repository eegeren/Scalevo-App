"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Sparkles, Zap, Menu, X,
  Search, TrendingUp, Store, Boxes, Users, Target, Settings, Scale, LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

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
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    router.push("/giris");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Mobile: Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Zap size={17} className="text-white" />
                </div>
                <span className="font-bold text-slate-900">Scalevo</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {DRAWER_NAV.map((item) => {
                const active = item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-green-50 text-green-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={17} className={active ? "text-green-600" : "text-slate-400"} />
                    <span>{item.label}</span>
                    {item.badge && !active && (
                      <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-slate-100 space-y-3">
              {user && (
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user.name?.slice(0, 1).toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={15} /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Scalevo</span>
          </div>
          <div className="w-9" /> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
          <div className="flex items-stretch">
            {BOTTOM_NAV.map((item) => {
              const active = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                    active ? "text-green-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-green-600" : ""} />
                  <span className={`text-[10px] font-semibold ${active ? "text-green-600" : ""}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-6 h-0.5 bg-green-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
