"use client";

import { usePathname } from "next/navigation";
import PlanGate from "@/components/PlanGate";

const PREMIUM_ROUTES = [
  "/ai-araclar",
  "/karsilastir",
  "/musteriler",
  "/hedefler",
  "/rakip-takip",
  "/pazaryerleri",
  "/magazam",
];

const ROUTE_LABELS: Record<string, string> = {
  "/ai-araclar":   "AI Araçlar",
  "/karsilastir":  "Ürün Karşılaştır",
  "/musteriler":   "Müşteri Yönetimi",
  "/hedefler":     "Hedefler & KPI",
  "/rakip-takip":  "Rakip Fiyat Takibi",
  "/pazaryerleri": "Pazaryeri Entegrasyonu",
  "/magazam":      "Mağazam",
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPremiumRoute = PREMIUM_ROUTES.includes(pathname);
  const featureLabel = ROUTE_LABELS[pathname];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {isPremiumRoute ? (
        <PlanGate feature={featureLabel}>{children}</PlanGate>
      ) : (
        children
      )}
    </div>
  );
}
