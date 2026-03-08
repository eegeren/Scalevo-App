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
    title: "Hesap Oluştur",
    subtitle: "Birkaç adımda başlayın, ücretsizdir.",
    fullName: "Ad Soyad",
    phone: "Cep Telefonu",
    email: "E-posta",
    password: "Şifre",
    namePlaceholder: "Adınız Soyadınız",
    phonePlaceholder: "+90 5XX XXX XX XX",
    emailPlaceholder: "ornek@email.com",
    passwordPlaceholder: "En az 6 karakter",
    registerBtn: "Kayıt Ol",
    registering: "Hesap oluşturuluyor...",
    hasAccount: "Zaten hesabın var mı?",
    login: "Giriş Yap",
    errFields: "Lütfen tüm zorunlu alanları doldurun.",
    errPassword: "Şifre en az 6 karakter olmalı.",
    errExists: "Bu e-posta zaten kayıtlı.",
    langToggle: "EN",
  },
  en: {
    tagline: ["Take your e-commerce", "to the next", "level."],
    features: ["AI-powered product analysis", "Order and operations management", "Revenue and profitability tracking"],
    copyright: "© 2026 Scalevo. All rights reserved.",
    title: "Create Account",
    subtitle: "Get started in a few steps, it's free.",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email",
    password: "Password",
    namePlaceholder: "Your Full Name",
    phonePlaceholder: "+90 5XX XXX XX XX",
    emailPlaceholder: "example@email.com",
    passwordPlaceholder: "At least 6 characters",
    registerBtn: "Sign Up",
    registering: "Creating account...",
    hasAccount: "Already have an account?",
    login: "Sign In",
    errFields: "Please fill in all required fields.",
    errPassword: "Password must be at least 6 characters.",
    errExists: "This email is already registered.",
    langToggle: "TR",
  },
} as const;

export default function KayitPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang, toggle } = useLang();
  const t = labels[lang];

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError(t.errFields);
      return;
    }
    if (password.length < 6) {
      setError(t.errPassword);
      return;
    }
    setLoading(true);
    setError("");

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError(t.errExists);
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    router.push("/onboarding");
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
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                {t.fullName} <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t.phone}</label>
              <Input
                type="tel"
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                {t.email} <span className="text-red-400">*</span>
              </label>
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                {t.password} <span className="text-red-400">*</span>
              </label>
              <Input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
            )}

            <Button
              className="w-full h-11 bg-green-600 hover:bg-green-700 font-medium text-base"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? t.registering : t.registerBtn}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-1">
              {t.hasAccount}{" "}
              <Link href="/giris" className="text-green-600 hover:text-green-700 font-semibold">
                {t.login}
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
