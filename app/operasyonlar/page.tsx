"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Check, Box, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderStatus = 'new' | 'preparing' | 'shipped' | 'completed';

interface Order {
  id: number;
  code: string;
  customer: string;
  item: string;
  price: string;
  priceNum: number;
  status: OrderStatus;
  date: string;
  timestamp: number;
}

const DEMO_ORDERS: Order[] = [
  { id: 1, code: "#2024192", customer: "Ahmet Yılmaz", item: "2 Adet Bebek Törpüsü", price: "1.250 ₺", priceNum: 1250, status: 'new', date: "10 dk önce", timestamp: Date.now() - 10 * 60000 },
  { id: 2, code: "#2024292", customer: "Ayşe Demir", item: "1 Adet Bluetooth Bere", price: "450 ₺", priceNum: 450, status: 'new', date: "30 dk önce", timestamp: Date.now() - 30 * 60000 },
  { id: 3, code: "#2024392", customer: "Mehmet Kaya", item: "3 Adet Kedi Su Pınarı", price: "2.100 ₺", priceNum: 2100, status: 'preparing', date: "1 saat önce", timestamp: Date.now() - 60 * 60000 },
  { id: 4, code: "#2024395", customer: "Canan Erkin", item: "1 Adet Galaxy Projektör", price: "850 ₺", priceNum: 850, status: 'preparing', date: "2 saat önce", timestamp: Date.now() - 2 * 60 * 60000 },
  { id: 5, code: "#2024401", customer: "Zeynep Şen", item: "1 Adet Projektör", price: "850 ₺", priceNum: 850, status: 'shipped', date: "Dün", timestamp: Date.now() - 28 * 60 * 60000 },
  { id: 6, code: "#2024101", customer: "Burak Öz", item: "2 Adet Törpü", price: "1.100 ₺", priceNum: 1100, status: 'completed', date: "25 Ocak", timestamp: new Date("2026-01-25").getTime() },
  { id: 7, code: "#2024098", customer: "Selin Yurt", item: "1 Adet Bere", price: "420 ₺", priceNum: 420, status: 'completed', date: "24 Ocak", timestamp: new Date("2026-01-24").getTime() },
];

export default function OperasyonlarPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: dbOrders } = await supabase
        .from("orders")
        .select("*")
        .order("timestamp", { ascending: false });

      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders.map(o => ({
          id: o.id, code: o.code, customer: o.customer, item: o.item,
          price: o.price, priceNum: o.price_num || 0,
          status: o.status as OrderStatus, date: o.date, timestamp: o.timestamp,
        })));
      } else {
        const demoData = DEMO_ORDERS.map(({ id: _id, ...o }) => ({
          user_id: user.id, code: o.code, customer: o.customer, item: o.item,
          price: o.price, price_num: o.priceNum, status: o.status,
          date: o.date, timestamp: o.timestamp,
        }));
        const { data: inserted } = await supabase.from("orders").insert(demoData).select();
        if (inserted) {
          setOrders(inserted.map(o => ({
            id: o.id, code: o.code, customer: o.customer, item: o.item,
            price: o.price, priceNum: o.price_num || 0,
            status: o.status as OrderStatus, date: o.date, timestamp: o.timestamp,
          })));
        }
      }
    };
    load();
  }, []);

  const updateStatus = async (id: number, newStatus: OrderStatus) => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const currentOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Operasyon Merkezi</h2>
        <p className="text-slate-500 mt-2">Siparişlerini onayla, hazırla ve kargola.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard label="Yeni Sipariş" count={stats.new} icon={<Package className="text-green-600"/>} active={activeTab === 'new'} activeColor="ring-2 ring-green-500 bg-green-50" onClick={() => setActiveTab('new')} />
        <StatusCard label="Hazırlanıyor" count={stats.preparing} icon={<Clock className="text-orange-600"/>} active={activeTab === 'preparing'} activeColor="ring-2 ring-orange-500 bg-orange-50" onClick={() => setActiveTab('preparing')} />
        <StatusCard label="Kargoda" count={stats.shipped} icon={<Truck className="text-blue-600"/>} active={activeTab === 'shipped'} activeColor="ring-2 ring-blue-500 bg-blue-50" onClick={() => setActiveTab('shipped')} />
        <StatusCard label="Tamamlandı" count={stats.completed} icon={<CheckCircle className="text-green-600"/>} active={activeTab === 'completed'} activeColor="ring-2 ring-green-500 bg-green-50" onClick={() => setActiveTab('completed')} />
      </div>

      <Card className="border-slate-200 shadow-sm min-h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            {activeTab === 'new' && "📦 Onay Bekleyen Siparişler"}
            {activeTab === 'preparing' && "⏳ Hazırlanması Gerekenler"}
            {activeTab === 'shipped' && "🚚 Yoldaki Kargolar"}
            {activeTab === 'completed' && "✅ Tamamlanan Sipariş Geçmişi"}
          </CardTitle>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            {currentOrders.length} Adet
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-0 divide-y divide-slate-100">
            {currentOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                {activeTab === 'completed' ? <Archive size={48} className="mb-4 text-slate-200"/> : <Box size={48} className="mb-4 text-slate-200" />}
                <p>Bu kategoride sipariş bulunmuyor.</p>
              </div>
            ) : (
              currentOrders.map((order) => (
                <div key={order.id} className="py-4 flex items-center justify-between group hover:bg-slate-50 px-2 rounded-lg transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm ${
                      order.status === 'new' ? 'bg-green-100' :
                      order.status === 'preparing' ? 'bg-orange-100' :
                      order.status === 'shipped' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {order.status === 'new' ? '📦' : order.status === 'preparing' ? '⏳' : order.status === 'shipped' ? '🚚' : '✅'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">{order.code}</p>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{order.date}</span>
                      </div>
                      <p className="text-sm text-slate-500">{order.customer} • <span className="text-slate-700 font-medium">{order.item}</span></p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-6">
                    <p className="font-bold text-slate-900 text-lg">{order.price}</p>

                    {order.status === 'new' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm" onClick={() => updateStatus(order.id, 'preparing')}>
                        <Check size={16} /> Onayla
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm" onClick={() => updateStatus(order.id, 'shipped')}>
                        <Package size={16} /> Kargolandı
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 gap-2" onClick={() => updateStatus(order.id, 'completed')}>
                        <CheckCircle size={16} /> Teslim Edildi
                      </Button>
                    )}
                    {order.status === 'completed' && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        Tamamlandı
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusCard({ label, count, icon, active, activeColor, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border border-slate-200 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md bg-white ${active ? activeColor : ''}`}
    >
      <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{count}</p>
      </div>
    </div>
  );
}
