import Link from "next/link";
import {
  Zap, BarChart2, ShoppingBag, TrendingUp, BrainCircuit,
  CheckCircle, ArrowRight, Package, Star
} from "lucide-react";

export default function TanitimPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Scalevo</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/giris"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/kayit"
            className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-2 rounded-full border border-green-100 mb-8">
          <Star size={13} fill="currentColor" /> Yapay Zeka Destekli E-Ticaret Paneli
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-6">
          E-ticaretinizi<br />
          <span className="text-green-600">Yapay Zeka</span> ile<br />
          Ölçeklendirin
        </h1>

        <p className="text-xl text-slate-500 max-w-xl mb-10 leading-relaxed">
          Ürün fikirlerini analiz edin, siparişlerinizi yönetin ve
          gelir raporlarınızı tek ekranda takip edin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/kayit"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md text-base transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Hemen Üye Ol - Ücretsiz <ArrowRight size={18} />
          </Link>
          <Link
            href="/giris"
            className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-8 py-4 rounded-xl border border-slate-200 shadow-sm text-base transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Her şey tek panelde</h2>
            <p className="text-slate-500 text-lg">Başarılı bir e-ticaret için ihtiyacınız olan tüm araçlar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainCircuit size={28} />}
              iconBg="bg-green-100 text-green-600"
              title="Yapay Zeka Ürün Analizi"
              desc="Ürün ismi girin, yapay zeka satılabilirlik skoru, rekabet durumu ve fiyat aralığını saniyeler içinde analiz etsin."
              items={["Satılabilirlik skoru (0-100)", "Rekabet ve fiyat analizi", "Kargo zorluk tahmini"]}
            />
            <FeatureCard
              icon={<ShoppingBag size={28} />}
              iconBg="bg-blue-100 text-blue-600"
              title="Sipariş Yönetimi"
              desc="Gelen siparişleri onaylayın, hazırlayın ve kargolandıklarını işaretleyin. Tüm süreç elinizin altında."
              items={["Yeni -> Hazır -> Kargo -> Teslim", "Anlık durum güncelleme", "Müşteri ve ürün takibi"]}
            />
            <FeatureCard
              icon={<TrendingUp size={28} />}
              iconBg="bg-emerald-100 text-emerald-600"
              title="Finansal Durum"
              desc="Toplam cironuzu, net karınızı ve reklam giderlerinizi görün. Haftalık sipariş dağılımını grafikle takip edin."
              items={["Ciro ve kar hesaplama", "Haftalık bar grafik", "Son işlemler listesi"]}
            />
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fiyatlandırma</h2>
            <p className="text-slate-500 text-lg">İhtiyacınıza uygun planı seçin, dilediğiniz zaman yükseltin.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PricingCard
              title="Başlangıç"
              price="0 TL"
              period="/ ay"
              desc="İlk adımı atmak isteyenler için temel panel."
              ctaLabel="Ücretsiz Başla"
              ctaHref="/kayit"
              items={["Aylık 20 ürün analizi", "Temel sipariş yönetimi", "Finans özeti görüntüleme"]}
            />
            <PricingCard
              title="Scale"
              price="879 TL"
              period="/ ay"
              desc="Büyüyen mağazalar için tam kapsamlı paket."
              ctaLabel="Scale Planına Geç"
              ctaHref="/kayit"
              highlighted
              items={["Sınırsıza yakın analiz", "Detaylı finans ve performans takibi", "Öncelikli destek"]}
            />
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">3 adımda başlayın</h2>
          <p className="text-slate-500 text-lg mb-16">Kurulum gerektirmez. Hemen kullanmaya başlayın.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step number="1" title="Kayıt Olun" desc="E-posta ve şifrenizle ücretsiz hesap oluşturun. Kredi kartı gerekmez." />
            <Step number="2" title="Ürününüzü Analiz Edin" desc="Satmayı düşündüğünüz ürünün adını girin, AI skoru ve tavsiyeyi anında alın." />
            <Step number="3" title="Büyüyün" desc="Siparişlerinizi yönetin, finans raporlarını takip edin ve ölçeklendirin." />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Hemen başlamaya hazır mısınız?</h2>
        <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
          Binlerce e-ticaret girişimcisi gibi siz de Scalevo ile işinizi büyütün.
        </p>
        <Link
          href="/kayit"
          className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-10 py-4 rounded-xl shadow-lg text-base hover:bg-green-50 transition-colors"
        >
          Ücretsiz Hesap Oluştur <ArrowRight size={18} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-slate-600">Scalevo</span>
        </div>
        <p>© 2026 Scalevo. Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-4">
          <Link href="/giris" className="hover:text-slate-600 transition-colors">Giriş Yap</Link>
          <Link href="/kayit" className="hover:text-slate-600 transition-colors">Kayıt Ol</Link>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, iconBg, title, desc, items }: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  items: string[];
}) {
  return (
    <div className="p-7 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${iconBg}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{desc}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  desc,
  ctaLabel,
  ctaHref,
  items,
  highlighted = false,
}: {
  title: string;
  price: string;
  period: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-7 shadow-sm ${
        highlighted ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <p className={`text-sm font-semibold ${highlighted ? "text-green-100" : "text-slate-500"}`}>{title}</p>
      <div className="mt-3 flex items-end gap-1.5">
        <span className="text-4xl font-bold">{price}</span>
        <span className={`text-sm mb-1 ${highlighted ? "text-green-100" : "text-slate-500"}`}>{period}</span>
      </div>
      <p className={`mt-4 text-sm leading-relaxed ${highlighted ? "text-green-50" : "text-slate-500"}`}>{desc}</p>
      <ul className="mt-6 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className={`flex items-center gap-2 text-sm ${highlighted ? "text-green-50" : "text-slate-600"}`}>
            <CheckCircle size={15} className={highlighted ? "text-white" : "text-green-500"} />
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
          highlighted ? "bg-white text-green-700 hover:bg-green-50" : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {ctaLabel} <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-md mb-5">
        {number}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
