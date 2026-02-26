"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Check, Box, Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderStatus = 'new' | 'preparing' | 'shipped' | 'completed' | 'returned';

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

      setOrders((dbOrders || []).map(o => ({
        id: o.id, code: o.code, customer: o.customer, item: o.item,
        price: o.price, priceNum: o.price_num || 0,
        status: o.status as OrderStatus, date: o.date, timestamp: o.timestamp,
      })));
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
    returned: orders.filter(o => o.status === 'returned').length,
  };

  const currentOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Operasyon Merkezi</h2>
        <p className="text-slate-500 mt-2">Siparişlerini onayla, hazırla ve kargola.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatusCard label="Yeni Sipariş" count={stats.new} icon={<Package className="text-green-600"/>} active={activeTab === 'new'} activeColor="ring-2 ring-green-500 bg-green-50" onClick={() => setActiveTab('new')} />
        <StatusCard label="Hazırlanıyor" count={stats.preparing} icon={<Clock className="text-orange-600"/>} active={activeTab === 'preparing'} activeColor="ring-2 ring-orange-500 bg-orange-50" onClick={() => setActiveTab('preparing')} />
        <StatusCard label="Kargoda" count={stats.shipped} icon={<Truck className="text-blue-600"/>} active={activeTab === 'shipped'} activeColor="ring-2 ring-blue-500 bg-blue-50" onClick={() => setActiveTab('shipped')} />
        <StatusCard label="Tamamlandı" count={stats.completed} icon={<CheckCircle className="text-green-600"/>} active={activeTab === 'completed'} activeColor="ring-2 ring-green-500 bg-green-50" onClick={() => setActiveTab('completed')} />
        <StatusCard label="İade" count={stats.returned} icon={<RotateCcw className="text-red-500"/>} active={activeTab === 'returned'} activeColor="ring-2 ring-red-400 bg-red-50" onClick={() => setActiveTab('returned')} />
      </div>

      <Card className="border-slate-200 shadow-sm min-h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            {activeTab === 'new' && "📦 Onay Bekleyen Siparişler"}
            {activeTab === 'preparing' && "⏳ Hazırlanması Gerekenler"}
            {activeTab === 'shipped' && "🚚 Yoldaki Kargolar"}
            {activeTab === 'completed' && "✅ Tamamlanan Sipariş Geçmişi"}
            {activeTab === 'returned' && "↩️ İade Edilen Siparişler"}
          </CardTitle>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            {currentOrders.length} Adet
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-0 divide-y divide-slate-100">
            {currentOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                {activeTab === 'completed' ? <Archive size={48} className="mb-4 text-slate-200"/> : activeTab === 'returned' ? <RotateCcw size={48} className="mb-4 text-slate-200"/> : <Box size={48} className="mb-4 text-slate-200" />}
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
                      order.status === 'returned' ? 'bg-red-100' :
                      'bg-green-100'
                    }`}>
                      {order.status === 'new' ? '📦' : order.status === 'preparing' ? '⏳' : order.status === 'shipped' ? '🚚' : order.status === 'returned' ? '↩️' : '✅'}
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">Tamamlandı</span>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => updateStatus(order.id, 'returned')}>
                          <RotateCcw size={13} /> İade
                        </Button>
                      </div>
                    )}
                    {order.status === 'returned' && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">↩️ İade Edildi</span>
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
