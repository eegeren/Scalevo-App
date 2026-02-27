"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Zap, ArrowLeft, Crown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FREE_OZELLIKLER = [
  "Aylık 20 AI analizi",
  "Sipariş yönetimi",
  "Stok takibi (50 ürün)",
  "Finans özeti",
];

const PRO_OZELLIKLER = [
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
  const [contacted, setContacted] = useState(false);

  const handleContact = () => {
    // WhatsApp veya email ile iletişim
    window.open("https://wa.me/905551234567?text=Scalevo%20Pro%20plan%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum", "_blank");
    setContacted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
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
          <Crown size={13} /> Pro Plan
        </div>
        <h1 className="text-4xl font-black text-slate-900">Sınırları Kaldır</h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">
          Tüm AI araçları, sınırsız analiz ve tam özellik erişimi ile mağazanı büyüt.
        </p>
      </div>

      {/* Plan Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ücretsiz */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ücretsiz</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900">0₺</span>
                <span className="text-slate-400 text-sm">/ ay</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">E-ticarete yeni başlayanlar için temel araçlar.</p>
            </div>
            <div className="space-y-2.5">
              {FREE_OZELLIKLER.map(o => (
                <div key={o} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
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
            ÖNERİLEN
          </div>
          <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400" />
          <CardContent className="p-6 space-y-5">
            <div>
              <p className="text-sm text-green-600 font-semibold">Pro</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900">299₺</span>
                <span className="text-slate-400 text-sm">/ ay</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Büyümeye kararlı satıcılar için tam güç.</p>
            </div>
            <div className="space-y-2.5">
              {PRO_OZELLIKLER.map(o => (
                <div key={o} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={10} className="text-green-600" />
                  </div>
                  {o}
                </div>
              ))}
            </div>

            {contacted ? (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-green-700">✅ Teşekkürler! En kısa sürede dönüş yapacağız.</p>
              </div>
            ) : (
              <Button
                onClick={handleContact}
                className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12 font-bold text-base"
              >
                <MessageCircle size={18} /> Pro&apos;ya Geç — İletişime Geç
              </Button>
            )}
            <p className="text-xs text-center text-slate-400">İstediğin zaman iptal edebilirsin.</p>
          </CardContent>
        </Card>
      </div>

      {/* SSS */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Sık sorulan sorular</h3>
        <div className="space-y-3">
          {[
            { q: "Ödeme nasıl yapılıyor?", a: "Şu an manuel ödeme sistemi aktif. WhatsApp üzerinden iletişime geçin, Papara / havale ile ödeme yapabilirsiniz. Yakında otomatik ödeme sistemi eklenecek." },
            { q: "İptal edebilir miyim?", a: "Evet, istediğin zaman iptal edebilirsin. Kalan süren boyunca Pro özelliklerini kullanmaya devam edersin." },
            { q: "Ücretsiz plandan Pro'ya geçince ne olur?", a: "Tüm kısıtlamalar kalkar, geçmişte yaptığın analizler ve veriler korunur." },
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
