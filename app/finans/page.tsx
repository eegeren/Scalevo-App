"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";

interface Order {
  id: number;
  price: string;
  priceNum: number;
  status: string;
  date: string;
  customer: string;
  item: string;
  timestamp: number;
}

const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function FinansPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("id, price, price_num, status, date, customer, item, timestamp");
      setOrders(
        (data || []).map(o => ({
          id: o.id, price: o.price, priceNum: o.price_num || 0,
          status: o.status, date: o.date, customer: o.customer,
          item: o.item, timestamp: o.timestamp,
        }))
      );
    };
    load();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.priceNum || 0), 0);
  const netProfit = Math.round(totalRevenue * 0.42);
  const adSpend = Math.round(totalRevenue * 0.10);
  const growthPercent = 12;

  // Weekly bar chart: group orders by day of week using timestamps
  const weeklyRevenue = Array(7).fill(0);
  orders.forEach(order => {
    if (order.timestamp) {
      const dayIndex = new Date(order.timestamp).getDay();
      weeklyRevenue[dayIndex] += order.priceNum || 0;
    }
  });
  const maxWeekly = Math.max(...weeklyRevenue, 1);
  const today = new Date().getDay();

  // Last 4 orders as transactions (sorted by timestamp desc)
  const recentOrders = [...orders]
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 4);

  const formatCurrency = (n: number) => n.toLocaleString("tr-TR") + " ₺";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Finansal Durum</h2>
        <p className="text-slate-500 mt-2">Nakit akışın ve karlılık raporların.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 text-white border-none shadow-md">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm mb-1">Toplam Ciro (Tüm Siparişler)</p>
            <h3 className="text-4xl font-bold">{formatCurrency(totalRevenue)}</h3>
            <div className="flex items-center gap-2 mt-4 text-green-400 text-sm font-medium">
              <TrendingUp size={16} /> <span>%{growthPercent} Artış</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm mb-1">Net Kar</p>
            <h3 className="text-4xl font-bold text-slate-800">{formatCurrency(netProfit)}</h3>
            <div className="flex items-center gap-2 mt-4 text-slate-600 text-sm font-medium">
              <Wallet size={16} /> <span>Marj: %42</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm mb-1">Tahmini Reklam Gideri</p>
            <h3 className="text-4xl font-bold text-slate-800">{formatCurrency(adSpend)}</h3>
            <div className="flex items-center gap-2 mt-4 text-red-600 text-sm font-medium">
              <TrendingDown size={16} /> <span>Limitin altında</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 font-bold">Haftalık Sipariş Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4 h-64 w-full px-4 pb-2">
              {DAYS.map((day, i) => (
                <Bar
                  key={day}
                  height={`${Math.max((weeklyRevenue[i] / maxWeekly) * 80, 5)}%`}
                  day={day}
                  active={i === today}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 font-bold">Son İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Henüz sipariş yok.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <TransactionRow
                    key={order.id}
                    title={order.item}
                    date={order.date}
                    amount={`+ ${order.price}`}
                    type="income"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Bar({ height, day, active }: any) {
  return (
    <div className="flex flex-col items-center gap-3 w-full group cursor-pointer">
      <div className="w-full h-[200px] flex items-end justify-center rounded-lg bg-slate-50 relative overflow-hidden">
        <div
          className={`w-full rounded-t-md transition-all duration-700 ease-out ${
            active
              ? 'bg-green-600 shadow-lg shadow-green-200'
              : 'bg-slate-300 group-hover:bg-green-400'
          }`}
          style={{ height: height }}
        ></div>
      </div>
      <span className={`text-xs font-bold ${active ? 'text-green-700' : 'text-slate-500'}`}>
        {day}
      </span>
    </div>
  );
}

function TransactionRow({ title, date, amount, type }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <DollarSign size={16} />
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm truncate max-w-[130px]">{title}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>
      <span className={`font-bold text-sm ${type === 'income' ? 'text-green-700' : 'text-slate-900'}`}>
        {amount}
      </span>
    </div>
  );
}
