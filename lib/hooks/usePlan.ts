"use client";

import { useState, useEffect } from "react";

export type PlanType = "free" | "pro" | "max";

export interface PlanInfo {
  plan: PlanType;
  isPro: boolean;   // pro veya max
  isMax: boolean;   // sadece max
  analysisUsed: number;
  analysisLimit: number;
  canAnalyze: boolean;
  stockLimit: number; // free: 50, pro: 500, max: unlimited
  loading: boolean;
}

export function usePlan(): PlanInfo {
  const [plan, setPlan] = useState<PlanType>("free");
  const [analysisUsed, setAnalysisUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Abonelik planı
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", user.id)
          .single();

        const currentPlan: PlanType = sub?.plan || "free";
        setPlan(currentPlan);

        // Bu ayki analiz sayısı (sadece free ve pro için önemli)
        if (currentPlan !== "max") {
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const { count } = await supabase
            .from("analysis_history")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth.toISOString());

          setAnalysisUsed(count || 0);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const isMax = plan === "max";
  const isPro = plan === "pro" || plan === "max";
  const analysisLimit = plan === "max" ? 999999 : plan === "pro" ? 100 : 20;

  return {
    plan,
    isPro,
    isMax,
    analysisUsed,
    analysisLimit,
    canAnalyze: isMax || analysisUsed < analysisLimit,
    stockLimit: isMax ? 999999 : isPro ? 500 : 50,
    loading,
  };
}
