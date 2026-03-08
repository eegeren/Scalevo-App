"use client";

import { useRouter } from "next/navigation";
import { Lock, Zap, ArrowRight, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/lib/hooks/usePlan";

interface PlanGateProps {
  children: React.ReactNode;
  feature?: string;
  requireMax?: boolean; // sadece Max planı gerektiren özellikler için
}

export default function PlanGate({ children, feature, requireMax = false }: PlanGateProps) {
  const { isPro, isMax, loading } = usePlan();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasAccess = requireMax ? isMax : isPro;

  if (hasAccess) return <>{children}</>;

  const isMaxGate = requireMax;

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center">
      {/* Bulanık arka plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-20 blur-sm scale-95">
        {children}
      </div>

      {/* Upgrade kartı */}
      <div className="relative z-10 bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-sm w-full text-center space-y-4 mx-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
            isMaxGate
              ? "bg-gradient-to-br from-violet-500 to-purple-600"
              : "bg-gradient-to-br from-green-500 to-emerald-600"
          }`}
        >
          <Lock size={24} className="text-white" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {isMaxGate ? "Max özelliği" : "Pro özelliği"}
          </h3>
          {feature && (
            <p className="text-sm text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{feature}</span>{" "}
              {isMaxGate ? "Scalevo Max" : "Pro veya Max"} planda kullanılabilir.
            </p>
          )}
          {!feature && (
            <p className="text-sm text-slate-500 mt-1">
              Bu özellik {isMaxGate ? "Scalevo Max" : "Pro veya Max"} planda kullanılabilir.
            </p>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {isMaxGate ? "Max ile ne kazanırsın?" : "Pro ile ne kazanırsın?"}
          </p>
          {isMaxGate ? (
            <>
              {[
                "Sınırsız AI analizi",
                "Tüm AI araçları",
                "Rakip fiyat takibi",
                "Pazaryeri entegrasyonu",
                "Reklam araçları",
                "Öncelikli destek",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-4 h-4 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket size={10} className="text-violet-600" />
                  </div>
                  {item}
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                "Aylık 100 AI analizi",
                "Temel AI araçları",
                "Müşteri yönetimi (CRM)",
                "500 ürün stok takibi",
                "Ürün karşılaştırma",
                "Hedefler & KPI",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={10} className="text-green-600" />
                  </div>
                  {item}
                </div>
              ))}
            </>
          )}
        </div>

        <Button
          onClick={() => router.push("/upgrade")}
          className={`w-full gap-2 h-11 font-semibold ${
            isMaxGate
              ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isMaxGate ? (
            <>
              <Star size={16} /> Max&apos;e Geç <ArrowRight size={16} />
            </>
          ) : (
            <>
              Pro&apos;ya Geç <ArrowRight size={16} />
            </>
          )}
        </Button>

        <p className="text-xs text-slate-400">
          {isMaxGate ? "Aylık 899₺" : "Aylık 499₺"} · İstediğin zaman iptal
        </p>
      </div>
    </div>
  );
}
