"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Search, TrendingUp, ChevronRight, LogOut, User, Store, Settings, Sparkles, Boxes, Users, Scale, Target, ShieldCheck, Building2, Crosshair, Crown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import BrandIcon from "@/components/brand/BrandIcon";

const ADMIN_EMAILS = ["egeevren@gmail.com", "admin@scalevo.com", "yusufege.erenn@gmail.com"];

interface SidebarProps {
  user: { name: string; email: string } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
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
      <div className="flex flex-col gap-1 mb-10 px-2">
        <BrandIcon />
        {storeName ? (
          <p className="text-xs text-green-600 font-semibold truncate mt-1">🏪 {storeName}</p>
        ) : (
          <p className="text-xs text-slate-500 font-medium mt-1">Yönetim Paneli</p>
        )}
      </div>

      <nav className="space-y-1.5">
        <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Genel Bakış" active={pathname === "/"} />
        <NavItem href="/analiz" icon={<Search size={18} />} label="Ürün Analiz & Skor" active={pathname.startsWith("/analiz")} />
        <NavItem href="/ai-araclar" icon={<Sparkles size={18} />} label="AI Araçlar" active={pathname === "/ai-araclar"} badge="Yeni" />
        <NavItem href="/karsilastir" icon={<Scale size={18} />} label="Ürün Karşılaştır" active={pathname === "/karsilastir"} />
        <NavItem href="/operasyonlar" icon={<ShoppingBag size={18} />} label="Operasyonlar" active={pathname === "/operasyonlar"} />
        <NavItem href="/stok" icon={<Boxes size={18} />} label="Stok Yönetimi" active={pathname === "/stok"} />
        <NavItem href="/musteriler" icon={<Users size={18} />} label="Müşteriler" active={pathname === "/musteriler"} />
        <NavItem href="/hedefler" icon={<Target size={18} />} label="Hedefler & KPI" active={pathname === "/hedefler"} />
        <NavItem href="/rakip-takip" icon={<Crosshair size={18} />} label="Rakip Takibi" active={pathname === "/rakip-takip"} />
        <NavItem href="/finans" icon={<TrendingUp size={18} />} label="Finansal Durum" active={pathname === "/finans"} />
        <NavItem href="/pazaryerleri" icon={<Store size={18} />} label="Pazaryerleri" active={pathname === "/pazaryerleri"} badge="Yeni" />
        {storeName && (
          <NavItem href="/magazam" icon={<Building2 size={18} />} label="Mağazam" active={pathname === "/magazam"} />
        )}

        <div className="border-t border-slate-100 my-2" />

        <NavItem href="/ayarlar" icon={<Settings size={18} />} label="Ayarlar" active={pathname === "/ayarlar"} />

        {/* Admin linki — sadece yetkili e-postalar */}
        {user && ADMIN_EMAILS.includes(user.email?.toLowerCase()) && (
          <>
            <div className="border-t border-slate-100 my-2" />
            <NavItem href="/admin" icon={<ShieldCheck size={18} />} label="Admin Paneli" active={pathname === "/admin"} badge="Admin" />
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
                  <span className="text-xs font-bold text-green-700">Ücretsiz Plan</span>
                  <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">Pro&apos;ya Geç</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min((planInfo.analysisUsed / 20) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">{planInfo.analysisUsed} / 20 analiz kullanıldı</p>
              </div>
            </Link>
          ) : (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-amber-700">Pro Plan — Aktif</span>
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

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 justify-start"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Çıkış Yap
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
