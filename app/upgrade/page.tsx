"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Zap,
  ArrowLeft,
  Crown,
  MessageCircle,
  Rocket,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FREE_OZELLIKLER = [
  "Aylık 20 AI analizi",
  "Sipariş yönetimi",
  "Stok takibi (50 ürün)",
  "Finans özeti",
];

const PRO_OZELLIKLER = [
  "Aylık 100 AI analizi",
  "Temel AI araçları (başlık, fiyat)",
  "Müşteri yönetimi (CRM)",
  "Stok takibi (500 ürün)",
  "Ürün karşılaştırma",
  "Hedefler & KPI takibi",
  "Standart destek",
];

const MAX_OZELLIKLER = [
  "Sınırsız AI analizi",
  "Tüm AI araçları (başlık, fiyat, trend, yorum)",
  "Rakip fiyat takibi",
  "Müşteri yönetimi (CRM)",
  "Sınırsız stok ürünü",
  "Ürün karşılaştırma",
  "Hedefler & KPI takibi",
  "Pazaryeri entegrasyonu",
  "Mağaza profili & reklam araçları",
  "Öncelikli destek",
];

export default function UpgradePage() {
  const router = useRouter();
  const [contactedPro, setContactedPro] = useState(false);
  const [contactedMax, setContactedMax] = useState(false);

  const handleContactPro = () => {
    window.open(
      "https://wa.me/905551234567?text=Scalevo%20Pro%20plan%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum",
      "_blank"
    );
    setContactedPro(true);
  };

  const handleContactMax = () => {
    window.open(
      "https://wa.me/905551234567?text=Scalevo%20Max%20plan%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum",
      "_blank"
    );
    setContactedMax(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Geri */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft size={16} /> Geri dön
      </button>

      {/* Başlık */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-4 py-2 rounded-full border border-green-100">
          <Crown size={13} /> Premium Planlar
        </div>
        <h1 className="text-4xl font-black text-slate-900">Sınırları Kaldır</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          İşletmene en uygun planı seç, yapay zekanın gücüyle mağazanı büyüt.
        </p>
      </div>

      {/* Plan Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ücretsiz */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-5 flex flex-col h-full">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ücretsiz</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900">0₺</span>
                <span className="text-slate-400 text-sm">/ ay</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">E-ticarete yeni başlayanlar için temel araçlar.</p>
            </div>
            <div className="space-y-2.5 flex-1">
              {FREE_OZELLIKLER.map((o) => (
                <div key={o} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-slate-400 flex-shrink-0" />
                  {o}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Mevcut Plan
            </Button>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className="border-green-300 shadow-lg ring-2 ring-green-500/20 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            POPÜLER
          </div>
          <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400" />
          <CardContent className="p-6 space-y-5 flex flex-col h-full">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-green-600" />
                <p className="text-sm text-green-600 font-semibold">Pro</p>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900">499₺</span>
                <span className="text-slate-400 text-sm">/ ay</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Büyümeye hazır satıcılar için akıllı araçlar.</p>
            </div>
            <div className="space-y-2.5 flex-1">
              {PRO_OZELLIKLER.map((o) => (
                <div key={o} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={10} className="text-green-600" />
                  </div>
                  {o}
                </div>
              ))}
            </div>

            {contactedPro ? (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-green-700">✅ Teşekkürler! En kısa sürede dönüş yapacağız.</p>
              </div>
            ) : (
              <Button
                onClick={handleContactPro}
                className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12 font-bold text-base"
              >
                <MessageCircle size={18} /> Pro&apos;ya Geç
              </Button>
            )}
            <p className="text-xs text-center text-slate-400">İstediğin zaman iptal edebilirsin.</p>
          </CardContent>
        </Card>

        {/* Scalevo Max */}
        <Card className="border-violet-300 shadow-xl ring-2 ring-violet-500/30 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            EN İYİ
          </div>
          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
          <CardContent className="p-6 space-y-5 flex flex-col h-full">
            <div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-violet-600 fill-violet-200" />
                <p className="text-sm text-violet-600 font-semibold">Scalevo Max</p>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900">899₺</span>
                <span className="text-slate-400 text-sm">/ ay</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Tüm güç, sınırsız erişim, tam öncelik.</p>
            </div>
            <div className="space-y-2.5 flex-1">
              {MAX_OZELLIKLER.map((o) => (
                <div key={o} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <div className="w-4 h-4 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket size={10} className="text-violet-600" />
                  </div>
                  {o}
                </div>
              ))}
            </div>

            {contactedMax ? (
              <div className="w-full bg-violet-50 border border-violet-200 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-violet-700">✅ Teşekkürler! En kısa sürede dönüş yapacağız.</p>
              </div>
            ) : (
              <Button
                onClick={handleContactMax}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 h-12 font-bold text-base text-white border-0"
              >
                <Star size={18} /> Max&apos;e Geç
              </Button>
            )}
            <p className="text-xs text-center text-slate-400">İstediğin zaman iptal edebilirsin.</p>
          </CardContent>
        </Card>
      </div>

      {/* Özellik Karşılaştırma Tablosu */}
      <div className="bg-slate-50 rounded-2xl p-6 overflow-x-auto">
        <h3 className="font-bold text-slate-800 mb-4">Plan Karşılaştırması</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pb-3 text-slate-500 font-medium w-1/2">Özellik</th>
              <th className="pb-3 text-slate-500 font-medium text-center">Ücretsiz</th>
              <th className="pb-3 text-green-600 font-semibold text-center">Pro</th>
              <th className="pb-3 text-violet-600 font-semibold text-center">Max</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[
              { ozellik: "AI Analiz Limiti", free: "20/ay", pro: "100/ay", max: "Sınırsız" },
              { ozellik: "Stok Ürünü", free: "50 ürün", pro: "500 ürün", max: "Sınırsız" },
              { ozellik: "Temel AI Araçları", free: "—", pro: "✓", max: "✓" },
              { ozellik: "Trend & Yorum AI", free: "—", pro: "—", max: "✓" },
              { ozellik: "Rakip Fiyat Takibi", free: "—", pro: "—", max: "✓" },
              { ozellik: "Müşteri Yönetimi (CRM)", free: "—", pro: "✓", max: "✓" },
              { ozellik: "Ürün Karşılaştırma", free: "—", pro: "✓", max: "✓" },
              { ozellik: "Hedefler & KPI", free: "—", pro: "✓", max: "✓" },
              { ozellik: "Pazaryeri Entegrasyonu", free: "—", pro: "—", max: "✓" },
              { ozellik: "Reklam Araçları", free: "—", pro: "—", max: "✓" },
              { ozellik: "Destek", free: "Standart", pro: "Standart", max: "Öncelikli" },
            ].map((row, i) => (
              <tr key={i}>
                <td className="py-2.5 text-slate-700 font-medium">{row.ozellik}</td>
                <td className="py-2.5 text-slate-400 text-center">{row.free}</td>
                <td className="py-2.5 text-green-600 text-center font-medium">{row.pro}</td>
                <td className="py-2.5 text-violet-600 text-center font-medium">{row.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SSS */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Sık sorulan sorular</h3>
        <div className="space-y-3">
          {[
            {
              q: "Ödeme nasıl yapılıyor?",
              a: "Şu an manuel ödeme sistemi aktif. WhatsApp üzerinden iletişime geçin, Papara / havale ile ödeme yapabilirsiniz. Yakında otomatik ödeme sistemi eklenecek.",
            },
            {
              q: "İptal edebilir miyim?",
              a: "Evet, istediğin zaman iptal edebilirsin. Kalan süren boyunca mevcut plan özelliklerini kullanmaya devam edersin.",
            },
            {
              q: "Plan yükseltince ne olur?",
              a: "Tüm kısıtlamalar kalkar, geçmişte yaptığın analizler ve veriler korunur. Anında erişim sağlanır.",
            },
            {
              q: "Pro ile Max arasındaki fark nedir?",
              a: "Max planı; rakip fiyat takibi, trend & yorum AI araçları, pazaryeri entegrasyonu ve reklam araçlarını da kapsar. Tüm özelliklere sınırsız erişim Max'e özeldir.",
            },
          ].map((item, i) => (
            <div key={i} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
              <p className="font-semibold text-slate-800 text-sm">{item.q}</p>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
