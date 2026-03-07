"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ReactNode } from "react";
import {
  Zap, ShoppingBag, BrainCircuit,
  CheckCircle, ArrowRight, Star, Sparkles,
  Users, Shield, Boxes, Rocket
} from "lucide-react";
import BrandIcon from "@/components/brand/BrandIcon";

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
        🚀 Yeni: <span className="font-bold">0'dan Mağaza Kur</span> — Niş seç, ürün ara, AI logo & slogan oluştur, ilk reklamını yaz. Hepsi 2 dakikada.
        <Link href="/kayit" className="ml-2 underline underline-offset-2 font-bold hover:opacity-80">Dene →</Link>
      </div>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2.5">
          <BrandIcon />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Scalevo</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-500 font-medium">
          <a href="#ozellikler" className="hover:text-slate-900 transition-colors">Özellikler</a>
          <a href="#fiyatlandirma" className="hover:text-slate-900 transition-colors">Fiyatlandırma</a>
          <a href="#sss" className="hover:text-slate-900 transition-colors">SSS</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/giris" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            Giriş Yap
          </Link>
          <Link href="/kayit" className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-sm transition-colors">
            Ücretsiz Başla →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-white via-green-50/30 to-slate-50">
        <div className="hero-badge inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-2 rounded-full border border-green-100 mb-8">
          <Star size={13} fill="currentColor" /> Türkiye'nin AI destekli e-ticaret paneli
        </div>

        <h1 className="hero-h1 text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] max-w-4xl mb-6 tracking-tight">
          E-Ticarette Kazan,<br />
          <span className="text-green-600">Yapay Zeka</span> ile<br />
          Büyü
        </h1>

        <p className="hero-p text-xl text-slate-500 max-w-2xl mb-8 leading-relaxed">
          Ürün analizi, sipariş takibi, stok yönetimi ve pazaryeri entegrasyonu —
          hepsi tek panelde. Ücretsiz başla, anında kullan.
        </p>

        <div className="hero-pills flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { icon: "🚀", label: "0'dan Mağaza Kur" },
            { icon: "🎨", label: "9 Farklı AI Logo" },
            { icon: "🔍", label: "Ürün Arama" },
            { icon: "🗑️", label: "Tam Kontrol" },
          ].map(item => (
            <span key={item.label} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              {item.icon} {item.label}
            </span>
          ))}
        </div>

        <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/kayit" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg text-base transition-all hover:shadow-xl hover:-translate-y-0.5">
            Ücretsiz Hesap Aç <ArrowRight size={18} />
          </Link>
          <Link href="/giris" className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-8 py-4 rounded-xl border border-slate-200 shadow-sm text-base transition-colors">
            Giriş Yap
          </Link>
        </div>
      </section>

      {/* LOGO BAR */}
      <Reveal>
        <section className="py-12 px-6 bg-slate-50 border-y border-slate-100">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Entegre Platformlar
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
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Neden Scalevo?</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Diğer araçlarla karşılaştır</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 text-slate-500 font-semibold w-1/3">Özellik</th>
                    <th className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                        ⚡ Scalevo
                      </div>
                    </th>
                    <th className="p-4 text-center text-slate-400 font-semibold text-xs">Diğer Araçlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Ücretsiz başlangıç planı", true, false],
                    ["AI ürün analizi & skor", true, false],
                    ["0'dan Mağaza Kur (AI)", true, false],
                    ["9 farklı AI logo oluşturma", true, false],
                    ["Trendyol & HB entegrasyonu", true, "Kısıtlı"],
                    ["Başlık & açıklama üretici (AI)", true, false],
                    ["Sipariş / Müşteri / Analiz silme", true, false],
                    ["Aylık maliyet", "0₺ - 499", "1000₺+"],
                    ["Kurulum gerektirmez", true, false],
                  ].map(([feat, scalevo, other], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="p-4 text-slate-700 font-medium">{feat}</td>
                      <td className="p-4 text-center">
                        {scalevo === true ? <span className="text-green-500 font-bold text-lg">✓</span> :
                         <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">{scalevo}</span>}
                      </td>
                      <td className="p-4 text-center">
                        {other === false ? <span className="text-slate-300 font-bold text-lg">✗</span> :
                         <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{other}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">* Genel pazar araştırmasına dayalı karşılaştırma</p>
          </Reveal>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section id="ozellikler" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Özellikler</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Her şey tek panelde</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Başarılı bir e-ticaret için ihtiyacın olan tüm araçlar, kurulum gerektirmeden.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Rocket size={26} />, iconBg: "bg-green-100 text-green-600", title: "0'dan Mağaza Kur", badge: "Yeni",
                desc: "Hiç mağazan yokken bile başlayabilirsin. Niş seç, ürün ara, AI ile logo ve slogan oluştur.",
                items: ["Gerçek pazar & komisyon verileri", "AI ürün arama & önerileri", "9 farklı logo stili oluştur", "AI slogan & ilk reklam"] },
              { icon: <BrainCircuit size={26} />, iconBg: "bg-violet-100 text-violet-600", title: "AI Ürün Analizi", badge: "Popüler",
                desc: "Ürün adını gir, satılabilirlik skoru, rekabet durumu ve fiyat aralığını saniyeler içinde öğren.",
                items: ["0-100 satılabilirlik skoru", "Rekabet & fiyat analizi", "AI tavsiyesi", "Analiz geçmişi & silme"] },
              { icon: <Sparkles size={26} />, iconBg: "bg-amber-100 text-amber-600", title: "AI Araçlar", badge: "",
                desc: "Başlık üretici, fiyatlama asistanı, trend keşfi ve yorum analizi — hepsi yapay zeka ile.",
                items: ["SEO başlık & açıklama üretici", "Optimal fiyat stratejisi", "Rakip yorum analizi"] },
              { icon: <ShoppingBag size={26} />, iconBg: "bg-blue-100 text-blue-600", title: "Sipariş Yönetimi", badge: "",
                desc: "Gelen siparişleri onayla, hazırla, kargola. Tam kontrol elinizde.",
                items: ["Yeni → Hazır → Kargo → Teslim", "Anlık durum güncelleme", "Sipariş silme"] },
              { icon: <Users size={26} />, iconBg: "bg-pink-100 text-pink-600", title: "Müşteri Yönetimi", badge: "",
                desc: "Siparişlerden oluşan müşteri profilleri, notlar ve harcama geçmişi.",
                items: ["Müşteri profili & sipariş geçmişi", "Not ekleme & silme", "Müşteri silme"] },
              { icon: <Boxes size={26} />, iconBg: "bg-teal-100 text-teal-600", title: "Stok & Finans", badge: "",
                desc: "Ürünlerini ekle, stoklarını takip et. Ciro ve karını izle.",
                items: ["Ürün & SKU yönetimi", "Kritik stok uyarıları", "Ciro & kar hesaplama"] },
            ].map((card, i) => (
              <Reveal key={card.title} delay={(i % 3) * 120}>
                <FeatureCard {...card} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Nasıl Çalışır</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">3 adımda başla</h2>
            <p className="text-slate-500 text-lg mb-16">Kurulum gerektirmez. Hesap aç, hemen kullan.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "1", icon: "✉️", title: "Kayıt Ol", desc: "E-posta ile ücretsiz hesap oluştur. Kredi kartı gerekmez." },
              { number: "2", icon: "🤖", title: "AI Analiz Yap", desc: "Satmayı düşündüğün ürünün adını gir, skoru ve tavsiyeyi anında al." },
              { number: "3", icon: "🚀", title: "Büyü", desc: "Siparişleri yönet, stoğu takip et, kazancını izle." },
            ].map((step, i) => (
              <Reveal key={step.number} delay={i * 150}>
                <Step {...step} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA */}
      <section id="fiyatlandirma" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Fiyatlandırma</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Sade ve şeffaf</h2>
            <p className="text-slate-500 text-lg">Başlamak ücretsiz. Büyüdükçe yükselt.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <PricingCard title="Ücretsiz" price="0 ₺" period="/ ay" badge=""
                desc="E-ticarete yeni başlayanlar için temel araçlar."
                ctaLabel="Ücretsiz Başla" ctaHref="/kayit"
                items={["Aylık 20 AI analizi", "Sipariş yönetimi", "Stok takibi (50 ürün)", "Finans özeti"]} />
            </Reveal>
            <Reveal delay={150}>
              <PricingCard title="Scale" price="499 ₺" period="/ ay" badge="En Popüler"
                desc="Büyüyen mağazalar için tam kapsamlı paket."
                ctaLabel="Scale'e Geç" ctaHref="/kayit" highlighted
                items={["Sınırsız AI analizi", "Trendyol & Hepsiburada entegrasyon", "Sınırsız stok yönetimi", "AI Araçlar (başlık, fiyat, trend)", "Müşteri yönetimi (CRM)", "Öncelikli destek"]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">SSS</p>
            <h2 className="text-4xl font-bold text-slate-900">Sıkça Sorulan Sorular</h2>
          </Reveal>
          <div className="space-y-4">
            {[
              { q: "Gerçekten ücretsiz mi?", a: "Evet. Temel özellikler sonsuza kadar ücretsiz. Sınırsız analiz ve entegrasyonlar için Scale planına geçebilirsin." },
              { q: "Kredi kartı gerekiyor mu?", a: "Hayır. Ücretsiz plana başlamak için kredi kartı istemiyoruz." },
              { q: "Trendyol API nasıl bağlanır?", a: "Ayarlar → Pazaryeri sekmesinden Trendyol Supplier ID, API Key ve Secret girerek bağlanabilirsin." },
              { q: "Verilerim güvende mi?", a: "Evet. Supabase altyapısı kullanıyoruz, tüm veriler şifreli ve güvende. Üçüncü taraflarla paylaşılmaz." },
              { q: "Mobil uyumlu mu?", a: "Evet, tüm sayfalar mobil cihazlarda da düzgün çalışır." },
            ].map((faq, i) => (
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Rakiplerinden önce<br />başla.</h2>
            <p className="text-green-100 text-lg mb-10">
              2,400+ satıcı Scalevo ile büyüyor. Sen de katıl, ücretsiz.
            </p>
            <Link href="/kayit" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-12 py-4 rounded-xl shadow-xl text-base hover:bg-green-50 transition-all hover:-translate-y-0.5">
              Ücretsiz Hesap Aç <ArrowRight size={18} />
            </Link>
            <p className="text-green-200 text-sm mt-5 flex items-center justify-center gap-2">
              <Shield size={14} /> Kredi kartı gerekmez · Kurulum yok · 2 dakikada başla
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
          <p className="text-slate-400 text-sm">© 2026 Scalevo. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/giris" className="hover:text-slate-700 transition-colors">Giriş Yap</Link>
            <Link href="/kayit" className="hover:text-slate-700 transition-colors">Kayıt Ol</Link>
            <Link href="/kvkk" className="hover:text-slate-700 transition-colors">KVKK & Gizlilik</Link>
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

function PricingCard({ title, price, period, badge, desc, ctaLabel, ctaHref, items, highlighted = false }: any) {
  return (
    <div className={`rounded-2xl border p-8 shadow-sm relative h-full flex flex-col ${highlighted ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full bg-slate-900 text-white">{badge}</span>
      )}
      <p className={`text-sm font-semibold ${highlighted ? "text-green-100" : "text-slate-500"}`}>{title}</p>
      <div className="mt-3 flex items-end gap-1.5 mb-2">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className={`text-sm mb-1 ${highlighted ? "text-green-100" : "text-slate-400"}`}>{period}</span>
      </div>
      <p className={`text-sm leading-relaxed mb-6 ${highlighted ? "text-green-50" : "text-slate-500"}`}>{desc}</p>
      <ul className="space-y-2.5 mb-7 flex-1">
        {items.map((item: string, i: number) => (
          <li key={i} className={`flex items-center gap-2 text-sm ${highlighted ? "text-green-50" : "text-slate-600"}`}>
            <CheckCircle size={14} className={highlighted ? "text-white" : "text-green-500"} /> {item}
          </li>
        ))}
      </ul>
      <Link href={ctaHref} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${highlighted ? "bg-white text-green-700 hover:bg-green-50" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
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
