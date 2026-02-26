import Link from "next/link";
import { Zap, Shield } from "lucide-react";

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <Link href="/tanitim" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Scalevo</span>
        </Link>
        <Link href="/kayit" className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-sm transition-colors">
          Ücretsiz Başla →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Shield size={22} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">KVKK & Gizlilik Politikası</h1>
            <p className="text-slate-500 text-sm mt-0.5">Son güncelleme: Şubat 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">

          <Section title="1. Veri Sorumlusu">
            <p>
              Bu gizlilik politikası, <strong>Scalevo</strong> ("biz", "platform") tarafından sunulan
              e-ticaret yönetim hizmetlerine ilişkin kişisel veri işleme faaliyetlerini açıklamaktadır.
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu Scalevo'dur.
            </p>
          </Section>

          <Section title="2. Toplanan Veriler">
            <p>Platformu kullandığınızda aşağıdaki veriler işlenebilir:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Kimlik verileri:</strong> Ad, soyad, e-posta adresi</li>
              <li><strong>İletişim verileri:</strong> Telefon numarası (isteğe bağlı)</li>
              <li><strong>Hesap verileri:</strong> Şifreli oturum bilgileri (Supabase Auth)</li>
              <li><strong>İşlem verileri:</strong> Sipariş kayıtları, ürün analizleri, stok bilgileri</li>
              <li><strong>Teknik veriler:</strong> IP adresi, tarayıcı bilgisi, oturum süresi</li>
              <li><strong>API verileri:</strong> Trendyol ve Hepsiburada API bağlantı bilgileri (şifrelenmiş)</li>
            </ul>
          </Section>

          <Section title="3. Verilerin İşlenme Amaçları">
            <ul className="list-disc pl-6 space-y-1">
              <li>Hesap oluşturma ve kimlik doğrulama</li>
              <li>Sipariş, stok ve analiz yönetimi hizmetlerinin sunulması</li>
              <li>Yapay zeka destekli ürün analizi ve önerilerin üretilmesi</li>
              <li>Platform güvenliğinin sağlanması</li>
              <li>Hizmet kalitesinin artırılması ve hata tespiti</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </Section>

          <Section title="4. Verilerin Saklanması ve Güvenlik">
            <p>
              Kişisel verileriniz, <strong>Supabase</strong> altyapısı üzerinde güvenli şekilde saklanmaktadır.
              Supabase, endüstri standardı AES-256 şifreleme ve SSL/TLS protokollerini kullanmaktadır.
              Şifreler hiçbir zaman düz metin olarak saklanmaz. API anahtarları tarayıcınızda şifrelenmiş
              olarak tutulur ve üçüncü taraflarla paylaşılmaz.
            </p>
          </Section>

          <Section title="5. Üçüncü Taraf Hizmetler">
            <p>Platform aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Supabase:</strong> Veritabanı ve kimlik doğrulama altyapısı</li>
              <li><strong>OpenAI:</strong> Yapay zeka analiz hizmetleri (ürün adı dışında kişisel veri gönderilmez)</li>
              <li><strong>Trendyol / Hepsiburada API:</strong> Yalnızca kullanıcının kendi mağaza verileri senkronize edilir</li>
            </ul>
            <p className="mt-2">
              Bu hizmet sağlayıcılar kendi gizlilik politikaları kapsamında faaliyet göstermektedir.
            </p>
          </Section>

          <Section title="6. Çerezler (Cookie)">
            <p>
              Platform, oturum yönetimi için zorunlu çerezler kullanmaktadır. Analitik veya
              reklam amaçlı üçüncü taraf çerez kullanılmamaktadır. Tarayıcı ayarlarından
              çerezleri devre dışı bırakabilirsiniz, ancak bu durumda oturum açma işlevi
              çalışmayabilir.
            </p>
          </Section>

          <Section title="7. Veri Sahibinin Hakları">
            <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
              <li>İşlemenin otomatik sistemler aracılığıyla aleyhine sonuç doğurması durumunda itiraz etme</li>
            </ul>
            <p className="mt-2">
              Bu haklarınızı kullanmak için Ayarlar → Hesap Güvenliği menüsünden hesabınızı silebilir
              veya destek ile iletişime geçebilirsiniz.
            </p>
          </Section>

          <Section title="8. Veri Saklama Süresi">
            <p>
              Kişisel verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmeniz
              durumunda tüm kişisel verileriniz 30 gün içinde kalıcı olarak silinir. Yasal
              yükümlülükler gerektirdiği durumlar saklı kalmak kaydıyla.
            </p>
          </Section>

          <Section title="9. Politika Değişiklikleri">
            <p>
              Bu gizlilik politikası önceden bildirim yapılmaksızın güncellenebilir. Önemli
              değişiklikler e-posta ile bildirilir. Platforma erişmeye devam etmeniz güncel
              politikayı kabul ettiğiniz anlamına gelir.
            </p>
          </Section>

          <Section title="10. İletişim">
            <p>
              KVKK kapsamındaki talepleriniz için platform üzerindeki destek kanalını kullanabilirsiniz.
              Kişisel Verileri Koruma Kurumu'na şikayette bulunma hakkınız saklıdır.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
          <Link href="/tanitim" className="text-sm text-green-600 hover:text-green-700 font-medium">
            ← Ana Sayfaya Dön
          </Link>
          <Link href="/kayit" className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-sm transition-colors">
            Ücretsiz Hesap Aç
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-green-500 rounded-full inline-block" />
        {title}
      </h2>
      <div className="pl-4 border-l-2 border-slate-100 space-y-2">{children}</div>
    </div>
  );
}
