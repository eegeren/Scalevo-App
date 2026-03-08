"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ReactNode } from "react";
import {
  Zap, ShoppingBag, BrainCircuit,
  CheckCircle, ArrowRight, Star, Sparkles,
  Users, Shield, Boxes, Rocket, Crown, Globe
} from "lucide-react";
import BrandIcon from "@/components/brand/BrandIcon";

/* ── Çeviri ── */
const translations = {
  tr: {
    announcementBar: { text: "Yeni: ", bold: "0'dan Mağaza Kur", sub: "— Niş seç, ürün ara, AI logo & slogan oluştur, ilk reklamını yaz. Hepsi 2 dakikada.", cta: "Dene →" },
    nav: { features: "Özellikler", pricing: "Fiyatlandırma", faq: "SSS", login: "Giriş Yap", signup: "Ücretsiz Başla →" },
    hero: {
      badge: "Türkiye'nin AI destekli e-ticaret paneli",
      h1a: "E-Ticarette Kazan,", h1b: "Yapay Zeka", h1c: "ile", h1d: "Büyü",
      sub: "Ürün analizi, sipariş takibi, stok yönetimi ve pazaryeri entegrasyonu — hepsi tek panelde. Ücretsiz başla, anında kullan.",
      pills: [{ icon: "🚀", label: "0'dan Mağaza Kur" }, { icon: "🎨", label: "9 Farklı AI Logo" }, { icon: "🔍", label: "Ürün Arama" }, { icon: "🗑️", label: "Tam Kontrol" }],
      ctaPrimary: "Ücretsiz Hesap Aç", ctaSecondary: "Giriş Yap",
    },
    logoBar: { label: "Entegre Platformlar" },
    compare: {
      badge: "Neden Scalevo?", title: "Diğer araçlarla karşılaştır",
      col1: "Özellik", col2: "Diğer Araçlar",
      limited: "Kısıtlı",
      rows: [
        ["Ücretsiz başlangıç planı", true, false],
        ["AI ürün analizi & skor", true, false],
        ["0'dan Mağaza Kur (AI)", true, false],
        ["9 farklı AI logo oluşturma", true, false],
        ["Trendyol & HB entegrasyonu", true, "Kısıtlı"],
        ["Başlık & açıklama üretici (AI)", true, false],
        ["Sipariş / Müşteri / Analiz silme", true, false],
        ["Aylık maliyet", "0₺ - 899₺", "1000₺+"],
        ["Kurulum gerektirmez", true, false],
      ],
      footnote: "* Genel pazar araştırmasına dayalı karşılaştırma",
    },
    features: {
      badge: "Özellikler", title: "Her şey tek panelde",
      sub: "Başarılı bir e-ticaret için ihtiyacın olan tüm araçlar, kurulum gerektirmeden.",
      cards: [
        { title: "0'dan Mağaza Kur", badge: "Yeni", desc: "Hiç mağazan yokken bile başlayabilirsin. Niş seç, ürün ara, AI ile logo ve slogan oluştur.", items: ["Gerçek pazar & komisyon verileri", "AI ürün arama & önerileri", "9 farklı logo stili oluştur", "AI slogan & ilk reklam"] },
        { title: "AI Ürün Analizi", badge: "Popüler", desc: "Ürün adını gir, satılabilirlik skoru, rekabet durumu ve fiyat aralığını saniyeler içinde öğren.", items: ["0-100 satılabilirlik skoru", "Rekabet & fiyat analizi", "AI tavsiyesi", "Analiz geçmişi & silme"] },
        { title: "AI Araçlar", badge: "", desc: "Başlık üretici, fiyatlama asistanı, trend keşfi ve yorum analizi — hepsi yapay zeka ile.", items: ["SEO başlık & açıklama üretici", "Optimal fiyat stratejisi", "Rakip yorum analizi"] },
        { title: "Sipariş Yönetimi", badge: "", desc: "Gelen siparişleri onayla, hazırla, kargola. Tam kontrol elinizde.", items: ["Yeni → Hazır → Kargo → Teslim", "Anlık durum güncelleme", "Sipariş silme"] },
        { title: "Müşteri Yönetimi", badge: "", desc: "Siparişlerden oluşan müşteri profilleri, notlar ve harcama geçmişi.", items: ["Müşteri profili & sipariş geçmişi", "Not ekleme & silme", "Müşteri silme"] },
        { title: "Stok & Finans", badge: "", desc: "Ürünlerini ekle, stoklarını takip et. Ciro ve karını izle.", items: ["Ürün & SKU yönetimi", "Kritik stok uyarıları", "Ciro & kar hesaplama"] },
      ],
    },
    howItWorks: {
      badge: "Nasıl Çalışır", title: "3 adımda başla", sub: "Kurulum gerektirmez. Hesap aç, hemen kullan.",
      steps: [
        { number: "1", icon: "✉️", title: "Kayıt Ol", desc: "E-posta ile ücretsiz hesap oluştur. Kredi kartı gerekmez." },
        { number: "2", icon: "🤖", title: "AI Analiz Yap", desc: "Satmayı düşündüğün ürünün adını gir, skoru ve tavsiyeyi anında al." },
        { number: "3", icon: "🚀", title: "Büyü", desc: "Siparişleri yönet, stoğu takip et, kazancını izle." },
      ],
    },
    pricing: {
      badge: "Fiyatlandırma", title: "Sade ve şeffaf", sub: "Başlamak ücretsiz. Büyüdükçe yükselt.",
      period: "/ ay",
      plans: [
        { title: "Ücretsiz", price: "0 ₺", badge: "", desc: "E-ticarete yeni başlayanlar için temel araçlar.", cta: "Ücretsiz Başla", items: ["Aylık 20 AI analizi", "Sipariş yönetimi", "Stok takibi (50 ürün)", "Finans özeti"] },
        { title: "Pro", price: "499 ₺", badge: "Popüler", desc: "Büyümeye hazır satıcılar için akıllı araçlar.", cta: "Pro'ya Geç", highlighted: true, items: ["Aylık 100 AI analizi", "Temel AI araçları (başlık, fiyat)", "Müşteri yönetimi (CRM)", "Stok takibi (500 ürün)", "Ürün karşılaştırma", "Hedefler & KPI takibi"] },
        { title: "Scalevo Max", price: "899 ₺", badge: "En İyi", desc: "Tüm güç, sınırsız erişim, tam öncelik.", cta: "Max'e Geç", isMax: true, items: ["Sınırsız AI analizi", "Tüm AI araçları (trend, yorum)", "Rakip fiyat takibi", "Sınırsız stok ürünü", "Pazaryeri entegrasyonu", "Reklam araçları", "Öncelikli destek"] },
      ],
    },
    faq: {
      badge: "SSS", title: "Sıkça Sorulan Sorular",
      items: [
        { q: "Gerçekten ücretsiz mi?", a: "Evet. Temel özellikler sonsuza kadar ücretsiz. Daha fazla analiz ve özellik için Pro veya Max planına geçebilirsin." },
        { q: "Kredi kartı gerekiyor mu?", a: "Hayır. Ücretsiz plana başlamak için kredi kartı istemiyoruz." },
        { q: "Trendyol API nasıl bağlanır?", a: "Ayarlar → Pazaryeri sekmesinden Trendyol Supplier ID, API Key ve Secret girerek bağlanabilirsin." },
        { q: "Verilerim güvende mi?", a: "Evet. Supabase altyapısı kullanıyoruz, tüm veriler şifreli ve güvende. Üçüncü taraflarla paylaşılmaz." },
        { q: "Mobil uyumlu mu?", a: "Evet, tüm sayfalar mobil cihazlarda da düzgün çalışır." },
      ],
    },
    cta: { title: "Rakiplerinden önce", title2: "başla.", sub: "2,400+ satıcı Scalevo ile büyüyor. Sen de katıl, ücretsiz.", btn: "Ücretsiz Hesap Aç", note: "Kredi kartı gerekmez · Kurulum yok · 2 dakikada başla" },
    footer: { rights: "© 2026 Scalevo. Tüm hakları saklıdır.", login: "Giriş Yap", signup: "Kayıt Ol", kvkk: "KVKK & Gizlilik" },
  },
  en: {
    announcementBar: { text: "New: ", bold: "Build a Store from Scratch", sub: "— Pick a niche, search products, create AI logo & slogan, write your first ad. All in 2 minutes.", cta: "Try it →" },
    nav: { features: "Features", pricing: "Pricing", faq: "FAQ", login: "Sign In", signup: "Start for Free →" },
    hero: {
      badge: "Turkey's AI-powered e-commerce dashboard",
      h1a: "Win in E-Commerce,", h1b: "Grow with", h1c: "", h1d: "AI",
      sub: "Product analysis, order tracking, inventory management and marketplace integration — all in one dashboard. Start free, use instantly.",
      pills: [{ icon: "🚀", label: "Build from Scratch" }, { icon: "🎨", label: "9 AI Logo Styles" }, { icon: "🔍", label: "Product Search" }, { icon: "🗑️", label: "Full Control" }],
      ctaPrimary: "Create Free Account", ctaSecondary: "Sign In",
    },
    logoBar: { label: "Integrated Platforms" },
    compare: {
      badge: "Why Scalevo?", title: "Compare with other tools",
      col1: "Feature", col2: "Other Tools",
      limited: "Limited",
      rows: [
        ["Free starter plan", true, false],
        ["AI product analysis & score", true, false],
        ["Build store from scratch (AI)", true, false],
        ["9 AI logo styles", true, false],
        ["Trendyol & HB integration", true, "Limited"],
        ["Title & description generator (AI)", true, false],
        ["Order / Customer / Analysis delete", true, false],
        ["Monthly cost", "₺0 - ₺899", "₺1000+"],
        ["No setup required", true, false],
      ],
      footnote: "* Based on general market research",
    },
    features: {
      badge: "Features", title: "Everything in one dashboard",
      sub: "All the tools you need for a successful e-commerce business, with zero setup.",
      cards: [
        { title: "Build Store from Scratch", badge: "New", desc: "Start even if you have no store yet. Pick a niche, search products, create AI logo and slogan.", items: ["Real market & commission data", "AI product search & suggestions", "Generate 9 logo styles", "AI slogan & first ad"] },
        { title: "AI Product Analysis", badge: "Popular", desc: "Enter a product name and get a sellability score, competition status and price range in seconds.", items: ["0-100 sellability score", "Competition & price analysis", "AI recommendation", "Analysis history & delete"] },
        { title: "AI Tools", badge: "", desc: "Title generator, pricing assistant, trend discovery and review analysis — all with AI.", items: ["SEO title & description generator", "Optimal pricing strategy", "Competitor review analysis"] },
        { title: "Order Management", badge: "", desc: "Confirm, prepare and ship incoming orders. Full control in your hands.", items: ["New → Ready → Shipped → Delivered", "Real-time status updates", "Order deletion"] },
        { title: "Customer Management", badge: "", desc: "Customer profiles from orders, notes and spending history.", items: ["Customer profile & order history", "Add & delete notes", "Delete customers"] },
        { title: "Stock & Finance", badge: "", desc: "Add your products, track your inventory. Monitor your revenue and profit.", items: ["Product & SKU management", "Low stock alerts", "Revenue & profit calculation"] },
      ],
    },
    howItWorks: {
      badge: "How It Works", title: "Get started in 3 steps", sub: "No setup required. Create account, use immediately.",
      steps: [
        { number: "1", icon: "✉️", title: "Sign Up", desc: "Create a free account with your email. No credit card required." },
        { number: "2", icon: "🤖", title: "Run AI Analysis", desc: "Enter the name of a product you want to sell and get the score and recommendation instantly." },
        { number: "3", icon: "🚀", title: "Grow", desc: "Manage orders, track inventory, monitor your earnings." },
      ],
    },
    pricing: {
      badge: "Pricing", title: "Simple and transparent", sub: "Start for free. Upgrade as you grow.",
      period: "/ mo",
      plans: [
        { title: "Free", price: "₺0", badge: "", desc: "Essential tools for those just starting out in e-commerce.", cta: "Start for Free", items: ["20 AI analyses / month", "Order management", "Inventory tracking (50 products)", "Finance summary"] },
        { title: "Pro", price: "₺499", badge: "Popular", desc: "Smart tools for sellers ready to grow.", cta: "Go Pro", highlighted: true, items: ["100 AI analyses / month", "Core AI tools (title, price)", "Customer management (CRM)", "Inventory tracking (500 products)", "Product comparison", "Goals & KPI tracking"] },
        { title: "Scalevo Max", price: "₺899", badge: "Best", desc: "Full power, unlimited access, top priority.", cta: "Go Max", isMax: true, items: ["Unlimited AI analyses", "All AI tools (trend, reviews)", "Competitor price tracking", "Unlimited inventory", "Marketplace integration", "Ad tools", "Priority support"] },
      ],
    },
    faq: {
      badge: "FAQ", title: "Frequently Asked Questions",
      items: [
        { q: "Is it really free?", a: "Yes. Core features are free forever. You can upgrade to Pro or Max for more analyses and features." },
        { q: "Is a credit card required?", a: "No. We don't ask for a credit card to start the free plan." },
        { q: "How do I connect the Trendyol API?", a: "Go to Settings → Marketplace and enter your Trendyol Supplier ID, API Key and Secret." },
        { q: "Is my data secure?", a: "Yes. We use Supabase infrastructure — all data is encrypted and secure. It is never shared with third parties." },
        { q: "Is it mobile-friendly?", a: "Yes, all pages work correctly on mobile devices." },
      ],
    },
    cta: { title: "Get ahead of", title2: "your competitors.", sub: "2,400+ sellers are growing with Scalevo. Join them, for free.", btn: "Create Free Account", note: "No credit card · No setup · Start in 2 minutes" },
    footer: { rights: "© 2026 Scalevo. All rights reserved.", login: "Sign In", signup: "Sign Up", kvkk: "Privacy Policy" },
  },
} as const;

type Lang = keyof typeof translations;

/* ── Scroll Reveal ── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.65s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.65s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export default function TanitimPage() {
  const [lang, setLang] = useState<Lang>("tr");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBadge {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .hero-badge  { animation: heroBadge  0.6s cubic-bezier(.4,0,.2,1) 0ms    both; }
        .hero-h1     { animation: heroFadeUp 0.7s cubic-bezier(.4,0,.2,1) 120ms  both; }
        .hero-p      { animation: heroFadeUp 0.7s cubic-bezier(.4,0,.2,1) 240ms  both; }
        .hero-pills  { animation: heroFadeUp 0.7s cubic-bezier(.4,0,.2,1) 360ms  both; }
        .hero-btns   { animation: heroFadeUp 0.7s cubic-bezier(.4,0,.2,1) 480ms  both; }
      `}</style>

      {/* YENİLİKLER ÇUBUĞU */}
      <div className="bg-green-600 text-white text-xs font-medium text-center py-2 px-4">
        🚀 {t.announcementBar.text}<span className="font-bold">{t.announcementBar.bold}</span> {t.announcementBar.sub}
        <Link href="/kayit" className="ml-2 underline underline-offset-2 font-bold hover:opacity-80">{t.announcementBar.cta}</Link>
      </div>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2.5">
          <BrandIcon />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Scalevo</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-500 font-medium">
          <a href="#ozellikler" className="hover:text-slate-900 transition-colors">{t.nav.features}</a>
          <a href="#fiyatlandirma" className="hover:text-slate-900 transition-colors">{t.nav.pricing}</a>
          <a href="#sss" className="hover:text-slate-900 transition-colors">{t.nav.faq}</a>
        </div>
        <div className="flex items-center gap-2">
          {/* Dil Değiştirici */}
          <button
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Globe size={13} />
            {lang === "tr" ? "EN" : "TR"}
          </button>
          <Link href="/giris" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            {t.nav.login}
          </Link>
          <Link href="/kayit" className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-sm transition-colors">
            {t.nav.signup}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-white via-green-50/30 to-slate-50">
        <div className="hero-badge inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-2 rounded-full border border-green-100 mb-8">
          <Star size={13} fill="currentColor" /> {t.hero.badge}
        </div>

        <h1 className="hero-h1 text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] max-w-4xl mb-6 tracking-tight">
          {t.hero.h1a}<br />
          <span className="text-green-600">{t.hero.h1b}</span> {t.hero.h1c}<br />
          {t.hero.h1d}
        </h1>

        <p className="hero-p text-xl text-slate-500 max-w-2xl mb-8 leading-relaxed">
          {t.hero.sub}
        </p>

        <div className="hero-pills flex flex-wrap items-center justify-center gap-2 mb-10">
          {t.hero.pills.map(item => (
            <span key={item.label} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              {item.icon} {item.label}
            </span>
          ))}
        </div>

        <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/kayit" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg text-base transition-all hover:shadow-xl hover:-translate-y-0.5">
            {t.hero.ctaPrimary} <ArrowRight size={18} />
          </Link>
          <Link href="/giris" className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-8 py-4 rounded-xl border border-slate-200 shadow-sm text-base transition-colors">
            {t.hero.ctaSecondary}
          </Link>
        </div>
      </section>

      {/* LOGO BAR */}
      <Reveal>
        <section className="py-12 px-6 bg-slate-50 border-y border-slate-100">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            {t.logoBar.label}
          </p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">🟠 Trendyol</div>
            <div className="text-slate-200 text-2xl">|</div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-lg">🟡 Hepsiburada</div>
          </div>
        </section>
      </Reveal>

      {/* RAKIP KARŞILAŞTIRMA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">{t.compare.badge}</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.compare.title}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 text-slate-500 font-semibold w-1/3">{t.compare.col1}</th>
                    <th className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                        ⚡ Scalevo
                      </div>
                    </th>
                    <th className="p-4 text-center text-slate-400 font-semibold text-xs">{t.compare.col2}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {t.compare.rows.map(([feat, scalevo, other], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="p-4 text-slate-700 font-medium">{feat}</td>
                      <td className="p-4 text-center">
                        {scalevo === true ? <span className="text-green-500 font-bold text-lg">✓</span> :
                         <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">{scalevo as string}</span>}
                      </td>
                      <td className="p-4 text-center">
                        {other === false ? <span className="text-slate-300 font-bold text-lg">✗</span> :
                         <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{other as string}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">{t.compare.footnote}</p>
          </Reveal>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section id="ozellikler" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">{t.features.badge}</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.features.title}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t.features.sub}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { iconEl: <Rocket size={26} />, iconBg: "bg-green-100 text-green-600" },
              { iconEl: <BrainCircuit size={26} />, iconBg: "bg-violet-100 text-violet-600" },
              { iconEl: <Sparkles size={26} />, iconBg: "bg-amber-100 text-amber-600" },
              { iconEl: <ShoppingBag size={26} />, iconBg: "bg-blue-100 text-blue-600" },
              { iconEl: <Users size={26} />, iconBg: "bg-pink-100 text-pink-600" },
              { iconEl: <Boxes size={26} />, iconBg: "bg-teal-100 text-teal-600" },
            ].map(({ iconEl, iconBg }, i) => {
              const card = t.features.cards[i];
              return (
                <Reveal key={card.title} delay={(i % 3) * 120}>
                  <FeatureCard icon={iconEl} iconBg={iconBg} title={card.title} badge={card.badge} desc={card.desc} items={card.items} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">{t.howItWorks.badge}</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.howItWorks.title}</h2>
            <p className="text-slate-500 text-lg mb-16">{t.howItWorks.sub}</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 150}>
                <Step {...step} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA */}
      <section id="fiyatlandirma" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">{t.pricing.badge}</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.pricing.title}</h2>
            <p className="text-slate-500 text-lg">{t.pricing.sub}</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.pricing.plans.map((plan, i) => (
              <Reveal key={plan.title} delay={i * 150}>
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  period={t.pricing.period}
                  badge={plan.badge}
                  desc={plan.desc}
                  ctaLabel={plan.cta}
                  ctaHref="/kayit"
                  items={plan.items}
                  highlighted={"highlighted" in plan ? plan.highlighted : false}
                  isMax={"isMax" in plan ? plan.isMax : false}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">{t.faq.badge}</p>
            <h2 className="text-4xl font-bold text-slate-900">{t.faq.title}</h2>
          </Reveal>
          <div className="space-y-4">
            {t.faq.items.map((faq, i) => (
              <Reveal key={i} delay={i * 80}>
                <FAQ q={faq.q} a={faq.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <Reveal>
        <section className="py-24 px-6 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t.cta.title}<br />{t.cta.title2}</h2>
            <p className="text-green-100 text-lg mb-10">{t.cta.sub}</p>
            <Link href="/kayit" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-12 py-4 rounded-xl shadow-xl text-base hover:bg-green-50 transition-all hover:-translate-y-0.5">
              {t.cta.btn} <ArrowRight size={18} />
            </Link>
            <p className="text-green-200 text-sm mt-5 flex items-center justify-center gap-2">
              <Shield size={14} /> {t.cta.note}
            </p>
          </div>
        </section>
      </Reveal>

      {/* FOOTER */}
      <footer className="py-10 px-8 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-700 text-lg">Scalevo</span>
          </div>
          <p className="text-slate-400 text-sm">{t.footer.rights}</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/giris" className="hover:text-slate-700 transition-colors">{t.footer.login}</Link>
            <Link href="/kayit" className="hover:text-slate-700 transition-colors">{t.footer.signup}</Link>
            <Link href="/kvkk" className="hover:text-slate-700 transition-colors">{t.footer.kvkk}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, badge, desc, items }: any) {
  return (
    <div className="p-7 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative h-full">
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wide">{badge}</span>
      )}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${iconBg}`}>{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{desc}</p>
      <ul className="space-y-2">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ number, icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">{icon}</div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold">{number}</div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({ title, price, period, badge, desc, ctaLabel, ctaHref, items, highlighted = false, isMax = false }: any) {
  const bgClass = isMax
    ? "bg-gradient-to-br from-violet-600 to-purple-700 border-violet-600 text-white"
    : highlighted
    ? "bg-green-600 border-green-600 text-white"
    : "bg-white border-slate-200 text-slate-900";

  const subTextClass = isMax ? "text-violet-200" : highlighted ? "text-green-100" : "text-slate-500";
  const itemTextClass = isMax ? "text-violet-50" : highlighted ? "text-green-50" : "text-slate-600";
  const checkClass = isMax || highlighted ? "text-white" : "text-green-500";
  const badgeBg = isMax ? "bg-white text-violet-700" : "bg-slate-900 text-white";
  const ctaClass = isMax
    ? "bg-white text-violet-700 hover:bg-violet-50"
    : highlighted
    ? "bg-white text-green-700 hover:bg-green-50"
    : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <div className={`rounded-2xl border p-8 shadow-sm relative h-full flex flex-col ${bgClass}`}>
      {badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${badgeBg}`}>{badge}</span>
      )}
      <div className="flex items-center gap-2 mb-1">
        {isMax && <Crown size={14} className="text-violet-200" />}
        <p className={`text-sm font-semibold ${subTextClass}`}>{title}</p>
      </div>
      <div className="mt-2 flex items-end gap-1.5 mb-2">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className={`text-sm mb-1 ${subTextClass}`}>{period}</span>
      </div>
      <p className={`text-sm leading-relaxed mb-6 ${subTextClass}`}>{desc}</p>
      <ul className="space-y-2.5 mb-7 flex-1">
        {items.map((item: string, i: number) => (
          <li key={i} className={`flex items-center gap-2 text-sm ${itemTextClass}`}>
            <CheckCircle size={14} className={checkClass} /> {item}
          </li>
        ))}
      </ul>
      <Link href={ctaHref} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${ctaClass}`}>
        {ctaLabel} <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-colors duration-200">
      <p className="font-semibold text-slate-900 mb-2 flex items-start gap-2">
        <span className="text-green-500 flex-shrink-0 mt-0.5">Q.</span> {q}
      </p>
      <p className="text-slate-500 text-sm leading-relaxed pl-5">{a}</p>
    </div>
  );
}
