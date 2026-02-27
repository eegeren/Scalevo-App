"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, ArrowRight, ArrowLeft, RefreshCw, Copy, Check, Sparkles,
  CheckCircle2, Rocket, Store, Package, Megaphone, Zap, Info,
  TrendingUp, Percent, Search, ChevronRight, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Niş verisi ────────────────────────────────────────────────────────────
const NISLER = [
  { id: "Evcil Hayvan", label: "Evcil Hayvan", emoji: "🐾", desc: "Pet ürünleri" },
  { id: "Elektronik", label: "Elektronik", emoji: "📱", desc: "Teknoloji & gadget" },
  { id: "Güzellik & Bakım", label: "Güzellik", emoji: "💄", desc: "Kozmetik & cilt" },
  { id: "Spor & Fitness", label: "Spor", emoji: "💪", desc: "Spor ekipmanları" },
  { id: "Ev & Yaşam", label: "Ev & Yaşam", emoji: "🏠", desc: "Dekorasyon & mutfak" },
  { id: "Bebek & Çocuk", label: "Bebek", emoji: "🍼", desc: "Bebek & oyuncak" },
  { id: "Moda & Giyim", label: "Moda", emoji: "👗", desc: "Kıyafet & aksesuar" },
  { id: "Gıda & İçecek", label: "Gıda", emoji: "🍎", desc: "Organik & sağlıklı" },
];

// ─── Nişe göre örnek ürünler ───────────────────────────────────────────────
const NIS_ORNEKLER: Record<string, string> = {
  "Evcil Hayvan":     "kedi su pınarı, köpek tasması, kedi tarağı",
  "Elektronik":       "bluetooth kulaklık, powerbank, USB hub",
  "Güzellik & Bakım": "saç serumu, yüz maskesi, dudak balmı",
  "Spor & Fitness":   "yoga matı, direnç bandı, koşu çorabı",
  "Ev & Yaşam":       "bambu kesme tahtası, mum seti, yastık kılıfı",
  "Bebek & Çocuk":    "bebek bezi, diş kaşıyıcı, uyku tulumu",
  "Moda & Giyim":     "oversize sweatshirt, minimal kemer, keten pantolon",
  "Gıda & İçecek":    "çiğ badem, granola, organik zeytinyağı",
};

const NIS_COLORS: Record<string, [string, string]> = {
  "Evcil Hayvan":     ["#f97316", "#ea580c"],
  "Elektronik":       ["#3b82f6", "#1d4ed8"],
  "Güzellik & Bakım": ["#ec4899", "#be185d"],
  "Spor & Fitness":   ["#22c55e", "#15803d"],
  "Ev & Yaşam":       ["#14b8a6", "#0f766e"],
  "Bebek & Çocuk":    ["#f59e0b", "#b45309"],
  "Moda & Giyim":     ["#a855f7", "#7e22ce"],
  "Gıda & İçecek":    ["#ef4444", "#b91c1c"],
};

// ─── Gerçek pazar verileri ─────────────────────────────────────────────────
const NICHE_DATA: Record<string, {
  pazar: string; komisyon: string; trend: string; ipucu: string; zorluk: "Kolay" | "Orta" | "Zor"
}> = {
  "Evcil Hayvan":     { pazar: "~2.8 Milyar ₺/yıl", komisyon: "%12–18", trend: "📈 Yüksek büyüme", ipucu: "Kedi maması, köpek tasması ve oyuncaklar en çok satanlar. Tekrarlayan alışveriş oranı yüksek.", zorluk: "Kolay" },
  "Elektronik":       { pazar: "~48 Milyar ₺/yıl", komisyon: "%8–12", trend: "📊 Stabil", ipucu: "Şarj kablosu, kulaklık ve koruyucu kılıf gibi aksesuarlar düşük sermayeyle başlamak için ideal.", zorluk: "Zor" },
  "Güzellik & Bakım": { pazar: "~7.5 Milyar ₺/yıl", komisyon: "%15–22", trend: "🚀 Hızla büyüyor", ipucu: "Saç bakım serumu, cilt kremi ve doğal içerikli ürünler en popüler kategoriler.", zorluk: "Orta" },
  "Spor & Fitness":   { pazar: "~4.2 Milyar ₺/yıl", komisyon: "%12–18", trend: "📈 Büyüyor", ipucu: "Ev spor ekipmanları ve spor giyim öne çıkıyor. Pandemi sonrası talep artışı devam ediyor.", zorluk: "Orta" },
  "Ev & Yaşam":       { pazar: "~12 Milyar ₺/yıl", komisyon: "%12–18", trend: "📊 Stabil", ipucu: "Mutfak organizasyon ürünleri ve dekoratif aksesuarlar en çok aranan kategoriler.", zorluk: "Kolay" },
  "Bebek & Çocuk":    { pazar: "~5.1 Milyar ₺/yıl", komisyon: "%12–15", trend: "📊 Stabil", ipucu: "Güvenlik sertifikalı ürünler daha kolay satar. Ebeveynler kaliteye odaklanır.", zorluk: "Kolay" },
  "Moda & Giyim":     { pazar: "~22 Milyar ₺/yıl", komisyon: "%20–28", trend: "🔝 En büyük kategori", ipucu: "İade oranı yüksek (%30+). Ürün kalitesi, beden tablosu ve açıklaması kritik.", zorluk: "Zor" },
  "Gıda & İçecek":    { pazar: "~3.8 Milyar ₺/yıl", komisyon: "%10–16", trend: "📈 Büyüyor", ipucu: "Organik, glutensiz ve vegan ürünler en hızlı büyüyen segment. Soğuk zincir gereksinimi dikkat.", zorluk: "Orta" },
};

// ─── Platform verisi ────────────────────────────────────────────────────────
const PLATFORM_DATA: Record<string, { users: string; komisyon: string; onay: string; not: string }> = {
  trendyol:    { users: "66M+", komisyon: "Ort. %12–20", onay: "1–3 iş günü", not: "Türkiye'nin #1 pazaryeri. Yoğun trafik, yüksek rekabet." },
  hepsiburada: { users: "28M+", komisyon: "Ort. %14–22", onay: "2–5 iş günü", not: "Güçlü marka bilinirliği. Elektronik & ev ürünlerinde güçlü." },
  her_ikisi:   { users: "94M+", komisyon: "Her ikisi birden", onay: "Paralel süreç", not: "Maksimum erişim. İki ayrı panel yönetimi gerektirir." },
};

// ─── 9 Farklı Logo Stili ────────────────────────────────────────────────────
function makeLogoSVG(name: string, nis: string, style: number): string {
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : (name.slice(0, 2) || "S").toUpperCase();
  const firstLetter = (name[0] || "S").toUpperCase();
  const shortName = name.slice(0, 8);

  const [c1, c2] = NIS_COLORS[nis] || ["#16a34a", "#15803d"];
  const s = style % 9;

  // 0 – Daire gradyan
  if (s === 0) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><linearGradient id="g0" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient><filter id="sh0"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <circle cx="60" cy="60" r="56" fill="url(#g0)" filter="url(#sh0)"/>
    <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="42" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 1 – Yuvarlak köşeli kare
  if (s === 1) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><filter id="sh1"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <rect x="8" y="8" width="104" height="104" rx="26" fill="${c1}" filter="url(#sh1)"/>
    <rect x="8" y="88" width="104" height="24" rx="0" fill="${c2}" clip-path="url(#clip1)"/>
    <clipPath id="clip1"><rect x="8" y="8" width="104" height="104" rx="26"/></clipPath>
    <rect x="16" y="16" width="88" height="88" rx="18" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <text x="60" y="55" text-anchor="middle" dy="0.38em" fill="white" font-size="40" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 2 – Diagonal split
  if (s === 2) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><clipPath id="circ2"><circle cx="60" cy="60" r="56"/></clipPath><filter id="sh2"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c2}" flood-opacity="0.3"/></filter></defs>
    <circle cx="60" cy="60" r="56" fill="${c2}" filter="url(#sh2)"/>
    <polygon points="0,0 90,0 0,120" fill="${c1}" clip-path="url(#circ2)"/>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="42" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 3 – Hexagon
  if (s === 3) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient><filter id="sh3"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <polygon points="60,6 110,33 110,87 60,114 10,87 10,33" fill="url(#g3)" filter="url(#sh3)"/>
    <polygon points="60,16 100,39 100,81 60,104 20,81 20,39" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="36" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 4 – Wordmark (text logo)
  if (s === 4) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><filter id="sh4"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.25"/></filter></defs>
    <rect x="4" y="4" width="112" height="112" rx="22" fill="white" filter="url(#sh4)" stroke="${c1}" stroke-width="3"/>
    <rect x="4" y="78" width="112" height="38" rx="0" fill="${c1}" clip-path="url(#clip4)"/>
    <clipPath id="clip4"><rect x="4" y="4" width="112" height="112" rx="22"/></clipPath>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="${c1}" font-size="${shortName.length > 5 ? 20 : 26}" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-1">${shortName.toUpperCase()}</text>
    <text x="60" y="95" text-anchor="middle" dy="0.38em" fill="white" font-size="10" font-weight="700" font-family="-apple-system,system-ui,sans-serif" letter-spacing="2">STORE</text>
  </svg>`;

  // 5 – Shield
  if (s === 5) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><linearGradient id="g5" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient><filter id="sh5"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <path d="M60 8 L106 28 L106 68 Q106 98 60 114 Q14 98 14 68 L14 28 Z" fill="url(#g5)" filter="url(#sh5)"/>
    <path d="M60 18 L98 36 L98 66 Q98 90 60 104 Q22 90 22 66 L22 36 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="60" y="65" text-anchor="middle" dy="0.38em" fill="white" font-size="36" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 6 – Diamond / rotated square
  if (s === 6) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient><filter id="sh6"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <rect x="20" y="20" width="80" height="80" rx="12" transform="rotate(45 60 60)" fill="url(#g6)" filter="url(#sh6)"/>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="36" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 7 – Pill / rounded pill
  if (s === 7) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><filter id="sh7"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <rect x="6" y="24" width="108" height="72" rx="36" fill="${c1}" filter="url(#sh7)"/>
    <rect x="6" y="56" width="108" height="40" fill="${c2}" clip-path="url(#clip7)"/>
    <clipPath id="clip7"><rect x="6" y="24" width="108" height="72" rx="36"/></clipPath>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="40" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  // 8 – Duotone circles
  if (s === 8) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs><filter id="sh8"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c1}" flood-opacity="0.3"/></filter></defs>
    <circle cx="45" cy="60" r="44" fill="${c1}" filter="url(#sh8)"/>
    <circle cx="75" cy="60" r="44" fill="${c2}" opacity="0.85"/>
    <text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="40" font-weight="900" font-family="-apple-system,system-ui,sans-serif" letter-spacing="-2">${initials}</text>
  </svg>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="${c1}"/><text x="60" y="60" text-anchor="middle" dy="0.38em" fill="white" font-size="42" font-weight="900" font-family="sans-serif">${initials}</text></svg>`;
}

// ─── Step indicator ─────────────────────────────────────────────────────────
const STEPS = [
  { icon: "🎯", label: "Niş" },
  { icon: "📦", label: "Ürün" },
  { icon: "🏪", label: "Mağaza" },
  { icon: "🎨", label: "Logo" },
  { icon: "📣", label: "Reklam" },
  { icon: "🚀", label: "Başla!" },
];

// ─── Ana bileşen ────────────────────────────────────────────────────────────
interface WizardProps {
  onClose: () => void;
  onStoreSetup?: (data: { magazaAdi: string; nis: string; platform: string; slogan: string }) => void;
}

export default function SifirdanWizard({ onClose, onStoreSetup }: WizardProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [nis, setNis] = useState("");
  // Step 2
  const [urunler, setUrunler] = useState<any[]>([]);
  const [urunlerLoading, setUrunlerLoading] = useState(false);
  const [secilenUrun, setSecilenUrun] = useState("");
  const [urunSearch, setUrunSearch] = useState("");
  const [urunSearching, setUrunSearching] = useState(false);
  const [customUrun, setCustomUrun] = useState<any>(null);
  // Step 3
  const [magazaAdi, setMagazaAdi] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [slogan, setSlogan] = useState("");
  const [sloganLoading, setSloganLoading] = useState(false);
  // Step 4
  const [logoStyle, setLogoStyle] = useState(0);
  // Step 5
  const [reklam, setReklam] = useState<any>(null);
  const [reklamLoading, setReklamLoading] = useState(false);
  const [copied, setCopied] = useState<string>("");

  // Step 2'ye geçince ürün önerilerini çek
  useEffect(() => {
    if (step === 2 && nis && urunler.length === 0) {
      setUrunlerLoading(true);
      fetch("/api/ai/sifirdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "urunler", nis }),
      })
        .then(r => r.json())
        .then(d => { if (d.urunler) setUrunler(d.urunler); })
        .catch(() => {})
        .finally(() => setUrunlerLoading(false));
    }
  }, [step, nis]);

  // Step 5'e geçince reklam çek
  useEffect(() => {
    if (step === 5 && secilenUrun && magazaAdi && !reklam) {
      setReklamLoading(true);
      fetch("/api/ai/sifirdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reklam", nis, magaza_adi: magazaAdi, urun: secilenUrun }),
      })
        .then(r => r.json())
        .then(d => { if (d.baslik) setReklam(d); })
        .catch(() => {})
        .finally(() => setReklamLoading(false));
    }
  }, [step, secilenUrun, magazaAdi]);

  const handleUrunSearch = async () => {
    if (!urunSearch.trim()) return;
    setUrunSearching(true);
    setCustomUrun(null);
    try {
      const res = await fetch("/api/ai/sifirdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "urun_ara", query: urunSearch.trim(), nis }),
      });
      const d = await res.json();
      if (d.ad) {
        setCustomUrun(d);
        setSecilenUrun(d.ad);
      }
    } catch {}
    setUrunSearching(false);
  };

  const handleStep3Next = async () => {
    setSloganLoading(true);
    try {
      const res = await fetch("/api/ai/sifirdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "magaza", nis, magaza_adi: magazaAdi }),
      });
      const d = await res.json();
      if (d.slogan) setSlogan(d.slogan);
    } catch {}
    setSloganLoading(false);
    setStep(4);
  };

  const handleFinish = () => {
    const data = { magazaAdi, nis, platform, slogan };
    try {
      localStorage.setItem("scalevo_store", JSON.stringify(data));
    } catch {}
    onStoreSetup?.(data);
    onClose();
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const [c1] = NIS_COLORS[nis] || ["#16a34a", "#15803d"];
  const nisData = NICHE_DATA[nis];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">0'dan Mağaza Kur</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* ── Progress ── */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-1">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const done = idx < step;
              const active = idx === step;
              return (
                <div key={idx} className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                    done ? "bg-green-600 text-white" :
                    active ? "bg-green-600 text-white ring-4 ring-green-100" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {done ? <CheckCircle2 size={13} /> : s.icon}
                  </div>
                  {idx < 6 && (
                    <div className={`flex-1 h-0.5 rounded-full transition-all ${done ? "bg-green-500" : "bg-slate-100"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1 mb-3">
            {STEPS.map((s, i) => (
              <span key={i} className={`text-[10px] font-medium flex-1 text-center ${i + 1 === step ? "text-green-600" : "text-slate-400"}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── İçerik ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">

          {/* ══ STEP 1 – Niş Seç ══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Adım 1 / 6</p>
                <h2 className="text-xl font-bold text-slate-900">Hangi nişte satmak istiyorsun?</h2>
                <p className="text-slate-500 text-sm mt-1">Sana özel ürün ve mağaza önerileri hazırlayalım.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {NISLER.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setNis(n.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      nis === n.id ? "border-green-500 bg-green-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{n.emoji}</div>
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{n.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                  </button>
                ))}
              </div>

              {nis && nisData && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">📊 {nis} Pazar Analizi</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-[11px] text-slate-500 mb-1 flex items-center justify-center gap-1"><TrendingUp size={11}/> Pazar</p>
                      <p className="text-xs font-bold text-slate-800">{nisData.pazar}</p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <p className="text-[11px] text-slate-500 mb-1 flex items-center justify-center gap-1"><Percent size={11}/> Komisyon</p>
                      <p className="text-xs font-bold text-slate-800">{nisData.komisyon}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-slate-500 mb-1">Zorluk</p>
                      <p className={`text-xs font-bold ${
                        nisData.zorluk === "Kolay" ? "text-green-600" : nisData.zorluk === "Orta" ? "text-orange-500" : "text-red-500"
                      }`}>{nisData.zorluk}</p>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <p className="text-xs text-slate-600"><span className="font-medium">💡 İpucu:</span> {nisData.ipucu}</p>
                  </div>
                  <p className="text-[11px] text-slate-400">{nisData.trend} · Türkiye e-ticaret verileri</p>
                </div>
              )}

              <Button onClick={() => setStep(2)} disabled={!nis} className="w-full bg-green-600 hover:bg-green-700 h-12 gap-2 mt-2">
                Devam Et <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* ══ STEP 2 – Ürün Seç / Ara ══ */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Adım 2 / 6</p>
                <h2 className="text-xl font-bold text-slate-900">Ürününü seç veya ara</h2>
                <p className="text-slate-500 text-sm mt-1">
                  <span className="font-medium text-slate-700">{nis}</span> nişi için AI önerileri ya da kendi ürününü ara.
                </p>
              </div>

              {/* ── Arama kutusu ── */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder={`${nis} nişinde ürün ara... (örn: ${NIS_ORNEKLER[nis] || "ürün adı"})`}
                      value={urunSearch}
                      onChange={e => setUrunSearch(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && urunSearch.trim() && handleUrunSearch()}
                      className="pl-9 h-11 border-slate-300 focus-visible:ring-green-500"
                    />
                  </div>
                  <Button
                    onClick={handleUrunSearch}
                    disabled={!urunSearch.trim() || urunSearching}
                    variant="outline"
                    className="h-11 px-4 border-slate-300 gap-2 flex-shrink-0"
                  >
                    {urunSearching ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                    Ara
                  </Button>
                </div>

                {/* Arama sonucu */}
                {customUrun && (
                  <div
                    onClick={() => setSecilenUrun(customUrun.ad)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      secilenUrun === customUrun.ad ? "border-green-500 bg-green-50" : "border-green-200 bg-green-50/50 hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{customUrun.emoji || "🔍"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm">{customUrun.ad}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            customUrun.potansiyel === "Yüksek" ? "bg-green-100 text-green-700" :
                            customUrun.potansiyel === "Orta" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-600"
                          }`}>{customUrun.potansiyel} Potansiyel</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{customUrun.aciklama}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-1">💰 {customUrun.fiyat_araligi}</p>
                      </div>
                      {secilenUrun === customUrun.ad && <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />}
                    </div>
                  </div>
                )}
              </div>

              {/* Ayraç */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">veya AI önerilerinden seç</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* AI Önerileri */}
              {urunlerLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-green-600 animate-spin"></div>
                  </div>
                  <p className="text-slate-500 text-sm">AI en iyi ürünleri seçiyor...</p>
                </div>
              ) : urunler.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">Öneriler yüklenemedi.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {urunler.map((u, i) => (
                    <button
                      key={i}
                      onClick={() => { setSecilenUrun(u.ad); setCustomUrun(null); }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        secilenUrun === u.ad && !customUrun
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl flex-shrink-0">{u.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="font-semibold text-slate-900 text-sm truncate">{u.ad}</p>
                            {secilenUrun === u.ad && !customUrun && (
                              <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{u.aciklama}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              u.potansiyel === "Yüksek" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                            }`}>{u.potansiyel}</span>
                            <span className="text-[10px] text-slate-600 font-medium">{u.fiyat_araligi}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {nisData && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{nisData.ipucu}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2 h-11">
                  <ArrowLeft size={15} /> Geri
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!secilenUrun}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-11 gap-2"
                >
                  Bu ürünle devam et <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* ══ STEP 3 – Mağaza Adı ══ */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Adım 3 / 6</p>
                <h2 className="text-xl font-bold text-slate-900">Mağazana isim ver</h2>
                <p className="text-slate-500 text-sm mt-1">Seçilen ürün: <span className="font-medium text-slate-700">✦ {secilenUrun}</span></p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Mağaza Adı</label>
                  <Input
                    placeholder="örn: PawShop, TeknoMarket, GlowStore..."
                    value={magazaAdi}
                    onChange={e => setMagazaAdi(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                  {magazaAdi && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      {magazaAdi.length < 5 ? "⚠️ Daha uzun bir isim tavsiye edilir" :
                       magazaAdi.length > 20 ? "⚠️ İsim biraz uzun, kısaltmayı deneyin" :
                       "✓ Güzel bir isim!"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "trendyol", label: "Trendyol", icon: "🟠" },
                      { id: "hepsiburada", label: "Hepsiburada", icon: "🟡" },
                      { id: "her_ikisi", label: "Her İkisi", icon: "🛍️" },
                    ].map(p => {
                      const pd = PLATFORM_DATA[p.id];
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            platform === p.id ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-xl mb-1">{p.icon}</div>
                          <p className="text-xs font-semibold text-slate-700">{p.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{pd.users} kullanıcı</p>
                        </button>
                      );
                    })}
                  </div>

                  {platform && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="grid grid-cols-3 gap-2 text-center mb-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Kullanıcı</p>
                          <p className="text-xs font-bold text-slate-700">{PLATFORM_DATA[platform].users}</p>
                        </div>
                        <div className="border-x border-slate-200">
                          <p className="text-[10px] text-slate-400 uppercase">Komisyon</p>
                          <p className="text-xs font-bold text-slate-700">{PLATFORM_DATA[platform].komisyon}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Onay Süresi</p>
                          <p className="text-xs font-bold text-slate-700">{PLATFORM_DATA[platform].onay}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 text-center">{PLATFORM_DATA[platform].not}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2 h-11">
                  <ArrowLeft size={15} /> Geri
                </Button>
                <Button
                  onClick={handleStep3Next}
                  disabled={!magazaAdi || sloganLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-11 gap-2"
                >
                  {sloganLoading ? <><RefreshCw size={14} className="animate-spin" /> AI yazıyor...</> : <><Sparkles size={15} /> Logo oluştur <ArrowRight size={15} /></>}
                </Button>
              </div>
            </div>
          )}

          {/* ══ STEP 4 – Logo ══ */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Adım 4 / 6</p>
                <h2 className="text-xl font-bold text-slate-900">Logonuz hazır!</h2>
                <p className="text-slate-500 text-sm mt-1">9 farklı stil arasından seçin.</p>
              </div>

              {slogan && (
                <div className="p-4 rounded-xl border border-green-100 bg-green-50">
                  <p className="text-xs text-green-600 font-medium mb-1">✨ AI Sloganı</p>
                  <p className="text-slate-800 font-semibold text-lg leading-snug">"{slogan}"</p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl"
                  dangerouslySetInnerHTML={{ __html: makeLogoSVG(magazaAdi, nis, logoStyle) }} />
                <p className="text-sm font-semibold text-slate-800">{magazaAdi}</p>

                <div className="grid grid-cols-9 gap-1.5">
                  {Array.from({ length: 9 }, (_, s) => (
                    <button
                      key={s}
                      onClick={() => setLogoStyle(s)}
                      className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        logoStyle === s ? "border-green-500 scale-110 shadow-md" : "border-slate-200 hover:border-slate-300"
                      }`}
                      dangerouslySetInnerHTML={{ __html: makeLogoSVG(magazaAdi, nis, s) }}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">9 farklı tasarım · Tıklayarak seç</p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(3)} className="gap-2 h-11">
                  <ArrowLeft size={15} /> Geri
                </Button>
                <Button onClick={() => setStep(5)} className="flex-1 bg-green-600 hover:bg-green-700 h-11 gap-2">
                  Reklam oluştur <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* ══ STEP 5 – Reklam ══ */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Adım 5 / 6</p>
                <h2 className="text-xl font-bold text-slate-900">İlk reklamın hazır!</h2>
                <p className="text-slate-500 text-sm mt-1">
                  <strong>{magazaAdi}</strong> için <strong>{secilenUrun}</strong> reklamı:
                </p>
              </div>

              {reklamLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-green-600 animate-spin"></div>
                  </div>
                  <p className="text-slate-500 text-sm">En iyi reklamı yazıyorum...</p>
                </div>
              ) : reklam ? (
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                        dangerouslySetInnerHTML={{ __html: makeLogoSVG(magazaAdi, nis, logoStyle) }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{magazaAdi}</p>
                        <p className="text-[11px] text-slate-400">Sponsorlu · Instagram</p>
                      </div>
                    </div>
                    <div className="h-28 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${(NIS_COLORS[nis] || ["#16a34a", "#15803d"])[0]}, ${(NIS_COLORS[nis] || ["#16a34a", "#15803d"])[1]})` }}>
                      <p className="text-white font-black text-xl leading-tight drop-shadow px-4 text-center">{reklam.baslik}</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-slate-800 text-sm leading-relaxed">{reklam.metin}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {reklam.hashtags?.map((h: string, i: number) => (
                          <span key={i} className="text-[11px] text-blue-500 font-medium">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="w-full py-2.5 rounded-lg text-center text-white text-sm font-semibold"
                        style={{ background: (NIS_COLORS[nis] || ["#16a34a"])[0] }}>
                        {reklam.cta}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => copyText(reklam.baslik + "\n\n" + reklam.metin + "\n\n" + reklam.hashtags?.join(" "), "full")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium border transition-all ${
                        copied === "full" ? "bg-green-50 border-green-300 text-green-700" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {copied === "full" ? <><Check size={14} /> Kopyalandı!</> : <><Copy size={14} /> Metni Kopyala</>}
                    </button>
                    <button
                      onClick={() => copyText(reklam.hashtags?.join(" ") || "", "hashtag")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium border transition-all ${
                        copied === "hashtag" ? "bg-green-50 border-green-300 text-green-700" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {copied === "hashtag" ? <><Check size={14} /> Kopyalandı!</> : <><Copy size={14} /> Hashtagleri Al</>}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-12 text-slate-500 text-sm">Reklam oluşturulamadı.</p>
              )}

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(4)} className="gap-2 h-11">
                  <ArrowLeft size={15} /> Geri
                </Button>
                <Button onClick={() => setStep(6)} className="flex-1 bg-green-600 hover:bg-green-700 h-11 gap-2">
                  Son adım! <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* ══ STEP 6 – Başla! ══ */}
          {step === 6 && (
            <div className="space-y-5 text-center">
              <div className="pt-2">
                <div className="text-6xl mb-2 animate-bounce">🚀</div>
                <h2 className="text-2xl font-black text-slate-900">Hazırsın!</h2>
                <p className="text-slate-500 text-sm mt-1.5">Mağazan birkaç dakika içinde kurulabilir.</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Kurulum Özeti</h3>
                <div className="space-y-3">
                  <SummaryRow emoji="🎯" label="Niş" value={nis} />
                  <SummaryRow emoji="📦" label="Ürün" value={secilenUrun} />
                  <SummaryRow emoji="🏪" label="Mağaza" value={magazaAdi} />
                  <SummaryRow emoji="🛍️" label="Platform" value={platform === "trendyol" ? "Trendyol" : platform === "hepsiburada" ? "Hepsiburada" : "Her İkisi"} />
                  {slogan && <SummaryRow emoji="✨" label="Slogan" value={`"${slogan}"`} />}
                </div>
                <div className="flex items-center gap-3 pt-1 border-t border-slate-200">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0"
                    dangerouslySetInnerHTML={{ __html: makeLogoSVG(magazaAdi, nis, logoStyle) }} />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{magazaAdi}</p>
                    {slogan && <p className="text-xs text-slate-500 mt-0.5">{slogan}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-left">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">✅ Sonraki Adımlar</p>
                <div className="space-y-2">
                  {[
                    { done: true,  text: `${platform === "her_ikisi" ? "Trendyol & Hepsiburada" : platform === "trendyol" ? "Trendyol" : "Hepsiburada"}'da satıcı başvurusu yap` },
                    { done: true,  text: `İlk ürününü (${secilenUrun}) tedarikçiden bul` },
                    { done: false, text: "Ürün fotoğraflarını profesyonelce çek" },
                    { done: false, text: "Rakip fiyatları araştır ve fiyatını belirle" },
                    { done: false, text: "İlk reklamını Scalevo'dan kopyalayıp kullan" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-green-500" : "border-2 border-slate-300"}`}>
                        {item.done && <Check size={9} className="text-white" />}
                      </div>
                      <p className={item.done ? "text-green-800 font-medium" : "text-slate-600"}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <NextStepCard href="/analiz" emoji="📊" label="Ürün Analizi" />
                <NextStepCard href="/stok" emoji="📦" label="Stok Ekle" />
                <NextStepCard href="/ai-araclar" emoji="🤖" label="AI Araçlar" />
              </div>

              <Button onClick={handleFinish} className="w-full bg-green-600 hover:bg-green-700 h-12 gap-2 text-base font-semibold">
                <Rocket size={18} /> Panele Geç
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base flex-shrink-0 mt-0.5">{emoji}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function NextStepCard({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <a href={href} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-green-300 hover:bg-green-50 transition-all text-center block">
      <div className="text-xl mb-1">{emoji}</div>
      <p className="text-xs font-semibold text-slate-700">{label}</p>
    </a>
  );
}
