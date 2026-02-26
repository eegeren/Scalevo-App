"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, BarChart2, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function KayitPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
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
        setError("Bu e-posta zaten kayıtlı.");
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
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Zap size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Scalevo</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            E-Ticaretinizi<br />bir üst seviyeye<br />taşıyın.
          </h2>
          <div className="space-y-4">
            <Feature icon={<BarChart2 size={18} />} text="Yapay zeka destekli ürün analizi" />
            <Feature icon={<ShoppingBag size={18} />} text="Sipariş ve operasyon yönetimi" />
            <Feature icon={<TrendingUp size={18} />} text="Gelir ve karlılık takibi" />
          </div>
        </div>

        <p className="text-green-200 text-sm">© 2026 Scalevo. Tüm hakları saklıdır.</p>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Scalevo</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Hesap Oluştur</h1>
            <p className="text-slate-500 mt-2">Birkaç adımda başlayın, ücretsizdir.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Ad Soyad <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Cep Telefonu</label>
              <Input
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                E-posta <span className="text-red-400">*</span>
              </label>
              <Input
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Şifre <span className="text-red-400">*</span>
              </label>
              <Input
                type="password"
                placeholder="En az 6 karakter"
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
              {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-1">
              Zaten hesabın var mı?{" "}
              <Link href="/giris" className="text-green-600 hover:text-green-700 font-semibold">
                Giriş Yap
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
