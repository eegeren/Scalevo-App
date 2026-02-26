"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Store, Package, BrainCircuit, CheckCircle2, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORE_TYPES = [
  { id: "trendyol", label: "Trendyol", icon: "🟠", desc: "Trendyol mağazam var" },
  { id: "hepsiburada", label: "Hepsiburada", icon: "🟡", desc: "Hepsiburada mağazam var" },
  { id: "her_ikisi", label: "Her İkisi", icon: "🛍️", desc: "İki platformda da satıyorum" },
  { id: "yeni", label: "Yeni Başlıyorum", icon: "🚀", desc: "Henüz mağazam yok" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [storeType, setStoreType] = useState("");
  const [urun, setUrun] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [skipped, setSkipped] = useState(false);

  const analyzeProduct = async () => {
    if (!urun) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data);
        // Supabase'e kaydet
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("analysis_history").insert({
            user_id: user.id, product_name: urun, score: data.score,
            competition: data.competition, price_range: data.priceRange,
            shipping_difficulty: data.shippingDifficulty, trend: data.trend, suggestion: data.suggestion,
          });
        }
      }
    } catch {}
    setAnalyzing(false);
    setStep(3);
  };

  const finish = () => router.push("/");

  const TOTAL_STEPS = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Scalevo</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                s < step ? "bg-green-600 text-white" :
                s === step ? "bg-green-600 text-white ring-4 ring-green-100" :
                "bg-slate-200 text-slate-500"
              }`}>
                {s < step ? <CheckCircle2 size={14} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all ${s < step ? "bg-green-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Mağaza Tipi */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Adım 1 / 3</p>
              <h2 className="text-2xl font-bold text-slate-900">Hangi platformda satıyorsun?</h2>
              <p className="text-slate-500 mt-1 text-sm">Deneyimini kişiselleştirelim.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {STORE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setStoreType(type.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    storeType === type.id
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <p className="font-semibold text-slate-800 text-sm">{type.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!storeType}
              className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12"
            >
              Devam Et <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* STEP 2 — İlk Analiz */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Adım 2 / 3</p>
              <h2 className="text-2xl font-bold text-slate-900">İlk ürününü analiz et</h2>
              <p className="text-slate-500 mt-1 text-sm">Satmayı düşündüğün bir ürün adı gir, AI skoru hemen verelim.</p>
            </div>

            <div className="mb-5">
              <Input
                placeholder="örn: Kedi Su Pınarı, Bluetooth Terazi..."
                value={urun}
                onChange={e => setUrun(e.target.value)}
                onKeyDown={e => e.key === "Enter" && urun && analyzeProduct()}
                className="h-12 bg-slate-50 text-base"
                autoFocus
              />
            </div>

            <Button
              onClick={analyzeProduct}
              disabled={!urun || analyzing}
              className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12 mb-3"
            >
              {analyzing ? (
                <><span className="animate-spin">⏳</span> Analiz ediliyor...</>
              ) : (
                <><Sparkles size={16} /> Analiz Et</>
              )}
            </Button>

            <button
              onClick={() => { setSkipped(true); setStep(3); }}
              className="w-full text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors"
            >
              Şimdi atla, sonra yaparım →
            </button>
          </div>
        )}

        {/* STEP 3 — Tamamlandı */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-5xl mb-4">{skipped ? "👋" : "🎉"}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {skipped ? "Hazırsın!" : "Harika başlangıç!"}
            </h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {skipped
                ? "Hesabın hazır. Paneline giderek ürün analiz etmeye, siparişlerini yönetmeye başlayabilirsin."
                : `"${urun}" analizi tamamlandı. Pano'na eklendi. Şimdi paneline geçelim.`
              }
            </p>

            {analysisResult && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 text-left">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-green-900 text-sm">"{urun}" Analiz Sonucu</p>
                  <div className={`text-2xl font-black ${
                    analysisResult.score >= 75 ? "text-green-600" :
                    analysisResult.score >= 50 ? "text-orange-500" : "text-red-500"
                  }`}>
                    {analysisResult.score}<span className="text-sm font-normal text-slate-400">/100</span>
                  </div>
                </div>
                <div className="w-full bg-green-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full rounded-full" style={{ width: `${analysisResult.score}%` }} />
                </div>
                <p className="text-xs text-green-800 mt-3 leading-relaxed">{analysisResult.suggestion}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <QuickLink href="/ai-araclar" icon="🤖" label="AI Araçlar" />
              <QuickLink href="/stok" icon="📦" label="Stok Ekle" />
              <QuickLink href="/operasyonlar" icon="🛍️" label="Siparişler" />
            </div>

            <Button onClick={finish} className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12">
              Panele Git <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* Alt not */}
        <p className="text-center text-xs text-slate-400 mt-6">
          İstediğin zaman ayarları değiştirebilirsin.
        </p>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a href={href} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-all">
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-xs font-semibold text-slate-700">{label}</p>
    </a>
  );
}
