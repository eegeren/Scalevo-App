"use client";
import PlanGate from "@/components/PlanGate";

import { useState, useEffect, useMemo } from "react";
import {
  Users, Search, StickyNote, ShoppingBag, TrendingUp,
  ChevronRight, X, Plus, Save, RefreshCw, CheckCircle2, MessageSquare, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Order {
  id: number;
  customer: string;
  item: string;
  price: string;
  price_num: number;
  status: string;
  date: string;
  timestamp: number;
}

interface CustomerNote {
  id: number;
  customer_name: string;
  note: string;
  created_at: string;
}

interface Customer {
  name: string;
  orders: Order[];
  totalSpent: number;
  lastOrder: string;
  notes: CustomerNote[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Yeni", color: "bg-green-100 text-green-700" },
  preparing: { label: "Hazırlanıyor", color: "bg-orange-100 text-orange-700" },
  shipped: { label: "Kargoda", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Tamamlandı", color: "bg-slate-100 text-slate-600" },
};

export default function MusterilerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const getSupabase = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    return createClient();
  };

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const [{ data: ordersData }, { data: notesData }] = await Promise.all([
        supabase.from("orders").select("*").order("timestamp", { ascending: false }),
        supabase.from("customer_notes").select("*").order("created_at", { ascending: false }),
      ]);
      setOrders((ordersData || []) as Order[]);
      setNotes((notesData || []) as CustomerNote[]);
    } finally {
      setLoading(false);
    }
  };

  // Müşterileri orders'dan türet
  const customers = useMemo<Customer[]>(() => {
    const map: Record<string, Customer> = {};
    for (const order of orders) {
      if (!order.customer) continue;
      if (!map[order.customer]) {
        map[order.customer] = {
          name: order.customer,
          orders: [],
          totalSpent: 0,
          lastOrder: order.date,
          notes: notes.filter(n => n.customer_name === order.customer),
        };
      }
      map[order.customer].orders.push(order);
      map[order.customer].totalSpent += order.price_num || 0;
    }
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, notes]);

  // Seçilen müşteriyi güncelle (notes değişince)
  useEffect(() => {
    if (selected) {
      const updated = customers.find(c => c.name === selected.name);
      if (updated) setSelected(updated);
    }
  }, [customers]);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const addNote = async () => {
    if (!newNote.trim() || !selected) return;
    setSavingNote(true);
    try {
      const supabase = await getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("customer_notes").insert({
        user_id: user?.id,
        customer_name: selected.name,
        note: newNote.trim(),
      }).select().single();
      if (data) {
        setNotes(prev => [data as CustomerNote, ...prev]);
        setNewNote("");
        showToast("Not eklendi ✓");
      }
    } finally {
      setSavingNote(false);
    }
  };

  const deleteNote = async (noteId: number) => {
    const supabase = await getSupabase();
    await supabase.from("customer_notes").delete().eq("id", noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
    showToast("Not silindi.");
  };

  const deleteCustomer = async (customerName: string) => {
    if (!confirm(`"${customerName}" müşterisini ve tüm sipariş geçmişini silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`)) return;
    const supabase = await getSupabase();
    await supabase.from("orders").delete().eq("customer", customerName);
    await supabase.from("customer_notes").delete().eq("customer_name", customerName);
    setOrders(prev => prev.filter(o => o.customer !== customerName));
    setNotes(prev => prev.filter(n => n.customer_name !== customerName));
    setSelected(null);
    showToast(`"${customerName}" silindi.`);
  };

  // İstatistikler
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter(c => c.orders.length > 1).length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-slate-900">Müşteri Yönetimi</h2>
        <p className="text-slate-500 mt-1">Siparişlerden oluşan müşteri profilleri ve notlar.</p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Toplam Müşteri" value={totalCustomers} icon={<Users size={18} className="text-blue-500" />} color="bg-blue-50" />
        <StatCard label="Tekrar Alanlar" value={repeatCustomers} icon={<TrendingUp size={18} className="text-green-500" />} color="bg-green-50" />
        <StatCard label="Toplam Ciro" value={`${totalRevenue.toLocaleString("tr-TR")} ₺`} icon={<ShoppingBag size={18} className="text-emerald-500" />} color="bg-emerald-50" />
        <StatCard label="Ort. Sipariş" value={`${avgOrderValue.toLocaleString("tr-TR")} ₺`} icon={<TrendingUp size={18} className="text-violet-500" />} color="bg-violet-50" />
      </div>

      <div className="flex gap-6">
        {/* Müşteri Listesi */}
        <div className={`${selected ? "hidden md:flex" : "flex"} flex-col flex-1 gap-4`}>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Müşteri ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 bg-slate-50 border-slate-200 h-9"
            />
          </div>

          <Card className="border-slate-200 shadow-sm flex-1">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400">
                  <RefreshCw size={20} className="animate-spin mr-2" /> Yükleniyor...
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400 flex flex-col items-center">
                  <Users size={40} className="mb-3 text-slate-200" />
                  <p>Henüz müşteri yok.</p>
                  <p className="text-xs mt-1">Sipariş eklendikçe müşteriler burada görünür.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {/* Tablo başlığı */}
                  <div className="hidden md:grid grid-cols-12 px-4 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    <div className="col-span-5">Müşteri</div>
                    <div className="col-span-2 text-center">Sipariş</div>
                    <div className="col-span-3 text-right">Toplam</div>
                    <div className="col-span-2 text-right">Not</div>
                  </div>
                  {filtered.map(customer => (
                    <button
                      key={customer.name}
                      onClick={() => setSelected(customer)}
                      className={`w-full px-4 py-4 hover:bg-slate-50 transition-colors text-left ${selected?.name === customer.name ? "bg-green-50 border-r-2 border-green-500" : ""}`}
                    >
                      <div className="grid grid-cols-12 items-center gap-2">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {customer.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{customer.name}</p>
                            <p className="text-xs text-slate-400 truncate">Son: {customer.lastOrder}</p>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${customer.orders.length > 1 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                            {customer.orders.length}x
                          </span>
                        </div>
                        <div className="col-span-3 text-right">
                          <p className="font-bold text-slate-800 text-sm">{customer.totalSpent.toLocaleString("tr-TR")} ₺</p>
                        </div>
                        <div className="col-span-2 flex justify-end items-center gap-1 text-slate-400">
                          {customer.notes.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-1.5 py-0.5 font-medium">{customer.notes.length}</span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteCustomer(customer.name); }}
                            className="p-1 rounded hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Müşteriyi sil"
                          >
                            <Trash2 size={12} />
                          </button>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Müşteri Detayı */}
        {selected && (
          <div className="flex-1 md:max-w-sm space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">{selected.name}</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteCustomer(selected.name)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  title="Müşteriyi sil"
                >
                  <Trash2 size={15} />
                </button>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Özet */}
            <Card className="border-green-100 bg-green-50 shadow-sm">
              <CardContent className="p-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-green-700 font-medium">Toplam Harcama</p>
                  <p className="font-bold text-green-900">{selected.totalSpent.toLocaleString("tr-TR")} ₺</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 font-medium">Sipariş Sayısı</p>
                  <p className="font-bold text-green-900">{selected.orders.length}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-green-700 font-medium">Son Sipariş</p>
                  <p className="font-bold text-green-900 text-sm">{selected.lastOrder}</p>
                </div>
              </CardContent>
            </Card>

            {/* Sipariş Geçmişi */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingBag size={14} className="text-green-600" /> Sipariş Geçmişi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {selected.orders.map(o => {
                  const st = STATUS_LABELS[o.status] || STATUS_LABELS.new;
                  return (
                    <div key={o.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="text-xs font-semibold text-slate-800 truncate">{o.item}</p>
                        <p className="text-xs text-slate-400">{o.date}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                        <span className="text-xs font-bold text-slate-700">{o.price}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Notlar */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <StickyNote size={14} className="text-blue-600" /> Notlar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Not ekle..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addNote()}
                    className="bg-slate-50 border-slate-200 text-sm h-9"
                  />
                  <Button onClick={addNote} disabled={savingNote || !newNote.trim()} className="bg-green-600 hover:bg-green-700 h-9 px-3 gap-1 flex-shrink-0">
                    {savingNote ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
                  </Button>
                </div>

                {selected.notes.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Henüz not yok.</p>
                ) : (
                  <div className="space-y-2">
                    {selected.notes.map(note => (
                      <div key={note.id} className="group flex items-start justify-between gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-blue-900 leading-relaxed">{note.note}</p>
                          <p className="text-xs text-blue-400 mt-1">
                            {new Date(note.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-200 rounded text-blue-400 hover:text-blue-700 transition-all flex-shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-lg font-bold text-slate-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
