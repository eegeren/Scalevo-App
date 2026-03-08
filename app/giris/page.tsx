"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart2, ShoppingBag, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandIcon from "@/components/brand/BrandIcon";
import { useLang } from "@/lib/context/LanguageContext";

const labels = {
  tr: {
    tagline: ["E-Ticaretinizi", "bir üst seviyeye", "taşıyın."],
    features: ["Yapay zeka destekli ürün analizi", "Sipariş ve operasyon yönetimi", "Gelir ve karlılık takibi"],
    copyright: "© 2026 Scalevo. Tüm hakları saklıdır.",
    title: "Tekrar Hoş Geldiniz",
    subtitle: "Hesabınıza giriş yapın.",
    email: "E-posta",
    password: "Şifre",
    loginBtn: "Giriş Yap",
    loggingIn: "Giriş yapılıyor...",
    noAccount: "Hesabın yok mu?",
    register: "Kayıt Ol",
    errFields: "Lütfen tüm alanları doldurun.",
    errAuth: "E-posta veya şifre hatalı.",
    langToggle: "EN",
  },
  en: {
    tagline: ["Take your e-commerce", "to the next", "level."],
    features: ["AI-powered product analysis", "Order and operations management", "Revenue and profitability tracking"],
    copyright: "© 2026 Scalevo. All rights reserved.",
    title: "Welcome Back",
    subtitle: "Sign in to your account.",
    email: "Email",
    password: "Password",
    loginBtn: "Sign In",
    loggingIn: "Signing in...",
    noAccount: "Don't have an account?",
    register: "Sign Up",
    errFields: "Please fill in all fields.",
    errAuth: "Invalid email or password.",
    langToggle: "TR",
  },
} as const;

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang, toggle } = useLang();
  const t = labels[lang];

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t.errFields);
      return;
    }
    setLoading(true);
    setError("");

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(t.errAuth);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <BrandIcon variant="glass" />
          <span className="text-xl font-bold tracking-tight">Scalevo</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            {t.tagline[0]}<br />{t.tagline[1]}<br />{t.tagline[2]}
          </h2>
          <div className="space-y-4">
            <Feature icon={<BarChart2 size={18} />} text={t.features[0]} />
            <Feature icon={<ShoppingBag size={18} />} text={t.features[1]} />
            <Feature icon={<TrendingUp size={18} />} text={t.features[2]} />
          </div>
        </div>

        <p className="text-green-200 text-sm">{t.copyright}</p>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative">
        <button
          onClick={toggle}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Globe size={13} />
          {t.langToggle}
        </button>

        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <BrandIcon />
            <span className="text-xl font-bold text-slate-900">Scalevo</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-slate-500 mt-2">{t.subtitle}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t.email}</label>
              <Input
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t.password}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
            )}

            <Button
              className="w-full h-11 bg-green-600 hover:bg-green-700 font-medium text-base"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? t.loggingIn : t.loginBtn}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-1">
              {t.noAccount}{" "}
              <Link href="/kayit" className="text-green-600 hover:text-green-700 font-semibold">
                {t.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-green-100 text-sm font-medium">{text}</span>
    </div>
  );
}
