"use client";

import { useState, useEffect } from "react";

export interface PlanInfo {
  plan: "free" | "pro";
  isPro: boolean;
  analysisUsed: number;
  analysisLimit: number;
  canAnalyze: boolean;
  stockLimit: number; // free: 50, pro: unlimited (999999)
  loading: boolean;
}

export function usePlan(): PlanInfo {
  const [plan, setPlan] = useState<"free" | "pro">("free");
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

        const currentPlan: "free" | "pro" = sub?.plan || "free";
        setPlan(currentPlan);

        // Bu ayki analiz sayısı (sadece free için önemli)
        if (currentPlan === "free") {
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

  const isPro = plan === "pro";
  const analysisLimit = 20;

  return {
    plan,
    isPro,
    analysisUsed,
    analysisLimit,
    canAnalyze: isPro || analysisUsed < analysisLimit,
    stockLimit: isPro ? 999999 : 50,
    loading,
  };
}
