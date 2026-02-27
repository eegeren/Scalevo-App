"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpRight, Filter, BarChart2, TrendingUp, Star, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HistoryItem {
  id: number;
  name: string;
  score: number;
  date: string;
  status: string;
  competition?: string;
}

export default function AnalizPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("analysis_history")
        .select("*")
        .order("created_at", { ascending: false });

      setHistory(
        (data || []).map(item => ({
          id: item.id,
          name: item.product_name,
          score: item.score,
          date: new Date(item.created_at).toLocaleString("tr-TR", {
            hour: "2-digit", minute: "2-digit", day: "numeric", month: "long",
          }),
          status: item.score >= 75 ? "Yüksek Potansiyel" : item.score >= 50 ? "Orta Potansiyel" : "Düşük Potansiyel",
          competition: item.competition,
        }))
      );
    };
    load();
  }, []);

  const deleteAnalysis = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`"${name}" analizini silmek istediğinize emin misiniz?`)) return;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("analysis_history").delete().eq("id", id);
    setHistory(prev => prev.filter(h => h.id !== id));
    showToast(`"${name}" silindi.`);
  };

  const filtered = history.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const avgScore = history.length > 0 ? Math.round(history.reduce((s, i) => s + i.score, 0) / history.length) : 0;
  const highPotential = history.filter(i => i.score >= 75).length;
  const lowPotential = history.filter(i => i.score < 50).length;

  const handleRowClick = (productName: string) => {
    const urlFriendlyName = productName.toLowerCase().replace(/ /g, "-");
    router.push(`/analiz/${urlFriendlyName}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Analiz Geçmişi</h2>
          <p className="text-slate-500 mt-2">Daha önce incelediğin ürünlerin detaylı raporları.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/")}>
          + Yeni Analiz Başlat
        </Button>
      </div>

      {/* ÖZET METRİKLER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-xl"><BarChart2 size={18} className="text-green-600" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Toplam Analiz</p>
              <p className="text-2xl font-bold text-slate-800">{history.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl"><TrendingUp size={18} className="text-blue-600" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Ort. Skor</p>
              <p className="text-2xl font-bold text-slate-800">{avgScore || "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl"><Star size={18} className="text-emerald-600" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Yüksek Pot.</p>
              <p className="text-2xl font-bold text-slate-800">{highPotential}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-xl"><AlertTriangle size={18} className="text-red-500" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Düşük Pot.</p>
              <p className="text-2xl font-bold text-slate-800">{lowPotential}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <Input
            placeholder="Geçmiş analizlerde ara..."
            className="pl-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 text-slate-600">
          <Filter size={16} /> Filtrele
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-700">Son Analizler</CardTitle>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              {filtered.length} sonuç
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
              <BarChart2 size={48} className="text-slate-200" />
              <p className="font-medium">Henüz analiz yapılmadı.</p>
              <p className="text-sm">Ana sayfadan bir ürün analiz et, burada görünecek.</p>
              <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700" onClick={() => router.push("/")}>
                Analiz Başlat
              </Button>
            </div>
          ) : (
            <div>
              {filtered.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleRowClick(item.name)}
                  className="flex items-center justify-between p-4 hover:bg-green-50 transition-colors cursor-pointer group rounded-xl border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      item.score >= 75 ? 'bg-green-100 text-green-700' :
                      item.score >= 50 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {item.score}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={`text-xs font-medium border-0 ${
                      item.score >= 75 ? 'bg-green-100 text-green-700' :
                      item.score >= 50 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {item.status}
                    </Badge>
                    <button
                      onClick={(e) => deleteAnalysis(item.id, item.name, e)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                      title="Analizi sil"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-green-600 transition-colors flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
