"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Search, TrendingUp, ChevronRight, LogOut, User, Zap, Store, Settings, Sparkles, Boxes
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  user: { name: string; email: string } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 shadow-sm sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-sm">
          <Zap size={22} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 tracking-tight">Scalevo</h1>
          <p className="text-xs text-slate-500 font-medium">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1">
        <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Genel Bakış" active={pathname === "/"} />
        <NavItem href="/analiz" icon={<Search size={18} />} label="Ürün Analiz & Skor" active={pathname.startsWith("/analiz")} />
        <NavItem href="/ai-araclar" icon={<Sparkles size={18} />} label="AI Araçlar" active={pathname === "/ai-araclar"} badge="Yeni" />
        <NavItem href="/operasyonlar" icon={<ShoppingBag size={18} />} label="Operasyonlar" active={pathname === "/operasyonlar"} />
        <NavItem href="/stok" icon={<Boxes size={18} />} label="Stok Yönetimi" active={pathname === "/stok"} />
        <NavItem href="/finans" icon={<TrendingUp size={18} />} label="Finansal Durum" active={pathname === "/finans"} />
        <NavItem href="/pazaryerleri" icon={<Store size={18} />} label="Pazaryerleri" active={pathname === "/pazaryerleri"} badge="Yeni" />

        <div className="border-t border-slate-100 my-2" />

        <NavItem href="/ayarlar" icon={<Settings size={18} />} label="Ayarlar" active={pathname === "/ayarlar"} />
      </nav>

      <div className="mt-auto space-y-3">
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
