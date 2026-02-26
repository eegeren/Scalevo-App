import Link from "next/link";
import {
  Zap, BarChart2, ShoppingBag, TrendingUp, BrainCircuit,
  CheckCircle, ArrowRight, Package, Star, Sparkles, Store,
  Users, MessageSquare, ChevronDown, Shield, Clock, Boxes
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
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-500 font-medium">
          <a href="#ozellikler" className="hover:text-slate-900 transition-colors">Özellikler</a>
          <a href="#fiyatlandirma" className="hover:text-slate-900 transition-colors">Fiyatlandırma</a>
          <a href="#yorumlar" className="hover:text-slate-900 transition-colors">Yorumlar</a>
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
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-2 rounded-full border border-green-100 mb-8">
          <Star size={13} fill="currentColor" /> Türkiye'nin AI destekli e-ticaret paneli
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] max-w-4xl mb-6 tracking-tight">
          Trendyol'da Kazan,<br />
          <span className="text-green-600">Yapay Zeka</span> ile<br />
          Büyü
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          Ürün analizi, sipariş takibi, stok yönetimi ve pazaryeri entegrasyonu —
          hepsi tek panelde. Ücretsiz başla, anında kullan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/kayit" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg text-base transition-all hover:shadow-xl hover:-translate-y-0.5">
            Ücretsiz Hesap Aç <ArrowRight size={18} />
          </Link>
          <Link href="/giris" className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-8 py-4 rounded-xl border border-slate-200 shadow-sm text-base transition-colors">
            Giriş Yap
          </Link>
        </div>

        {/* Sosyal Kanıt Sayaçlar */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <StatBadge value="2,400+" label="Aktif Satıcı" />
          <StatBadge value="180,000+" label="Analiz Yapıldı" />
          <StatBadge value="4.8/5" label="Kullanıcı Puanı" />
          <StatBadge value="₺0" label="Başlangıç Ücreti" />
        </div>
      </section>

      {/* LOGO BAR */}
      <section className="py-12 px-6 bg-slate-50 border-y border-slate-100">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Entegre Platformlar
        </p>
        <div className="flex items-center justify-center gap-10 flex-wrap">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">🟠 Trendyol</div>
          <div className="text-slate-200 text-2xl">|</div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-lg">🟡 Hepsiburada</div>
          <div className="text-slate-200 text-2xl">|</div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">🤖 OpenAI GPT-4o</div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section id="ozellikler" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Özellikler</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Her şey tek panelde</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Başarılı bir e-ticaret için ihtiyacın olan tüm araçlar, kurulum gerektirmeden.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<BrainCircuit size={26} />} iconBg="bg-violet-100 text-violet-600"
              title="AI Ürün Analizi" badge="Popüler"
              desc="Ürün adını gir, satılabilirlik skoru, rekabet durumu ve fiyat aralığını saniyeler içinde öğren."
              items={["0-100 satılabilirlik skoru", "Rekabet & fiyat analizi", "AI tavsiyesi"]} />

            <FeatureCard icon={<Sparkles size={26} />} iconBg="bg-green-100 text-green-600"
              title="AI Araçlar" badge="Yeni"
              desc="Başlık üretici, fiyatlama asistanı, trend keşfi ve yorum analizi — hepsi yapay zeka ile."
              items={["SEO başlık & açıklama üretici", "Optimal fiyat stratejisi", "Rakip yorum analizi"]} />

            <FeatureCard icon={<Store size={26} />} iconBg="bg-orange-100 text-orange-600"
              title="Pazaryeri Entegrasyonu" badge="Yeni"
              desc="Trendyol ve Hepsiburada API'larını bağla, siparişleri ve ürünleri tek panelden yönet."
              items={["Trendyol & Hepsiburada", "Otomatik sipariş senkronizasyonu", "Ürün listeleme takibi"]} />

            <FeatureCard icon={<ShoppingBag size={26} />} iconBg="bg-blue-100 text-blue-600"
              title="Sipariş Yönetimi"
              desc="Gelen siparişleri onayla, hazırla, kargola. Tüm süreç elinizin altında."
              items={["Yeni → Hazır → Kargo → Teslim", "Anlık durum güncelleme", "Müşteri takibi"]} />

            <FeatureCard icon={<Boxes size={26} />} iconBg="bg-teal-100 text-teal-600"
              title="Stok Yönetimi"
              desc="Ürünlerini ekle, stoklarını takip et, kritik seviyede uyarı al."
              items={["Ürün & SKU yönetimi", "Kritik stok uyarıları", "Stok hareket geçmişi"]} />

            <FeatureCard icon={<TrendingUp size={26} />} iconBg="bg-emerald-100 text-emerald-600"
              title="Finansal Takip"
              desc="Ciro, net kar ve reklam giderlerini görün. Haftalık grafik ile büyümeyi izle."
              items={["Ciro & kar hesaplama", "Haftalık sipariş grafiği", "Reklam gider takibi"]} />
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Nasıl Çalışır</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">3 adımda başla</h2>
          <p className="text-slate-500 text-lg mb-16">Kurulum gerektirmez. Hesap aç, hemen kullan.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step number="1" icon="✉️" title="Kayıt Ol" desc="E-posta ile ücretsiz hesap oluştur. Kredi kartı gerekmez." />
            <Step number="2" icon="🤖" title="AI Analiz Yap" desc="Satmayı düşündüğün ürünün adını gir, skoru ve tavsiyeyi anında al." />
            <Step number="3" icon="🚀" title="Büyü" desc="Siparişleri yönet, stoğu takip et, kazancını izle." />
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section id="yorumlar" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Kullanıcı Yorumları</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Satıcılar ne diyor?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              name="Emre K." role="Trendyol Satıcısı" stars={5}
              text="AI ürün analizi gerçekten işe yarıyor. İlk haftada 3 yeni ürün denedim, 2'si tuttu. Eskiden bu araştırmayı saatler sürerdi."
            />
            <Testimonial
              name="Selin A." role="Hepsiburada & Trendyol" stars={5}
              text="Iki pazaryerini tek panelden yönetmek hayat kurtarıcı. Sipariş takibi çok kolaylaştı, artık hiç sipariş kaçırmıyorum."
            />
            <Testimonial
              name="Murat T." role="E-ticaret Girişimcisi" stars={5}
              text="Stok yönetimi özelliği benim için en değerlisi. Kritik stok uyarısı gelince hemen sipariş veriyorum, ürün tükenmesi sorunu kalmadı."
            />
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA */}
      <section id="fiyatlandirma" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Fiyatlandırma</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Sade ve şeffaf</h2>
            <p className="text-slate-500 text-lg">Başlamak ücretsiz. Büyüdükçe yükselt.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PricingCard title="Ücretsiz" price="0 ₺" period="/ ay" badge=""
              desc="E-ticarete yeni başlayanlar için temel araçlar."
              ctaLabel="Ücretsiz Başla" ctaHref="/kayit"
              items={["Aylık 20 AI analizi", "Sipariş yönetimi", "Stok takibi (50 ürün)", "Finans özeti"]} />
            <PricingCard title="Scale" price="879 ₺" period="/ ay" badge="En Popüler"
              desc="Büyüyen mağazalar için tam kapsamlı paket."
              ctaLabel="Scale'e Geç" ctaHref="/kayit" highlighted
              items={["Sınırsız AI analizi", "Trendyol & Hepsiburada entegrasyon", "Sınırsız stok yönetimi", "AI Araçlar (başlık, fiyat, trend)", "Müşteri yönetimi (CRM)", "Öncelikli destek"]} />
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">SSS</p>
            <h2 className="text-4xl font-bold text-slate-900">Sıkça Sorulan Sorular</h2>
          </div>
          <div className="space-y-4">
            <FAQ q="Gerçekten ücretsiz mi?" a="Evet. Temel özellikler sonsuza kadar ücretsiz. Sınırsız analiz ve entegrasyonlar için Scale planına geçebilirsin." />
            <FAQ q="Kredi kartı gerekiyor mu?" a="Hayır. Ücretsiz plana başlamak için kredi kartı istemiyoruz." />
            <FAQ q="Trendyol API nasıl bağlanır?" a="Ayarlar → Pazaryeri sekmesinden Trendyol Supplier ID, API Key ve Secret girerek bağlanabilirsin." />
            <FAQ q="Verilerim güvende mi?" a="Evet. Supabase altyapısı kullanıyoruz, tüm veriler şifreli ve güvende. Üçüncü taraflarla paylaşılmaz." />
            <FAQ q="Mobil uyumlu mu?" a="Evet, tüm sayfalar mobil cihazlarda da düzgün çalışır." />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
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
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, badge, desc, items }: any) {
  return (
    <div className="p-7 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative">
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wide">{badge}</span>
      )}
      <div className={`w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${iconBg}`}>{icon}</div>
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

function Testimonial({ name, role, stars, text }: any) {
  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex gap-0.5 mb-4">
        {Array(stars).fill(0).map((_, i) => <Star key={i} size={14} className="text-amber-400" fill="currentColor" />)}
      </div>
      <p className="text-slate-700 text-sm leading-relaxed mb-5">"{text}"</p>
      <div>
        <p className="font-semibold text-slate-900 text-sm">{name}</p>
        <p className="text-slate-400 text-xs">{role}</p>
      </div>
    </div>
  );
}

function PricingCard({ title, price, period, badge, desc, ctaLabel, ctaHref, items, highlighted = false }: any) {
  return (
    <div className={`rounded-2xl border p-8 shadow-sm relative ${highlighted ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full bg-slate-900 text-white">{badge}</span>
      )}
      <p className={`text-sm font-semibold ${highlighted ? "text-green-100" : "text-slate-500"}`}>{title}</p>
      <div className="mt-3 flex items-end gap-1.5 mb-2">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className={`text-sm mb-1 ${highlighted ? "text-green-100" : "text-slate-400"}`}>{period}</span>
      </div>
      <p className={`text-sm leading-relaxed mb-6 ${highlighted ? "text-green-50" : "text-slate-500"}`}>{desc}</p>
      <ul className="space-y-2.5 mb-7">
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
    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
      <p className="font-semibold text-slate-900 mb-2 flex items-start gap-2">
        <span className="text-green-500 flex-shrink-0 mt-0.5">Q.</span> {q}
      </p>
      <p className="text-slate-500 text-sm leading-relaxed pl-5">{a}</p>
    </div>
  );
}
