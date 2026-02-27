"use client";

import { useRouter } from "next/navigation";
import { Lock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/lib/hooks/usePlan";

interface PlanGateProps {
  children: React.ReactNode;
  feature?: string;
}

export default function PlanGate({ children, feature }: PlanGateProps) {
  const { isPro, loading } = usePlan();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPro) return <>{children}</>;

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center">
      {/* Bulanık arka plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-20 blur-sm scale-95">
        {children}
      </div>

      {/* Upgrade kartı */}
      <div className="relative z-10 bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-sm w-full text-center space-y-4 mx-4">
        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Lock size={24} className="text-white" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">Pro özellik</h3>
          {feature && (
            <p className="text-sm text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{feature}</span> Pro planda kullanılabilir.
            </p>
          )}
          {!feature && (
            <p className="text-sm text-slate-500 mt-1">Bu özellik Pro planda kullanılabilir.</p>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pro ile ne kazanırsın?</p>
          {[
            "Sınırsız AI analizi",
            "Tüm AI araçları",
            "Rakip fiyat takibi",
            "Müşteri yönetimi (CRM)",
            "Sınırsız stok ürünü",
            "Ürün karşılaştırma",
            "Hedefler & KPI",
            "Öncelikli destek",
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap size={10} className="text-green-600" />
              </div>
              {item}
            </div>
          ))}
        </div>

        <Button
          onClick={() => router.push("/upgrade")}
          className="w-full bg-green-600 hover:bg-green-700 gap-2 h-11 font-semibold"
        >
          Pro&apos;ya Geç <ArrowRight size={16} />
        </Button>

        <p className="text-xs text-slate-400">Aylık 299₺ · İstediğin zaman iptal</p>
      </div>
    </div>
  );
}
