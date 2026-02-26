"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function UrunDetayPage() {
  const params = useParams();
  const router = useRouter();
  
  const productName = decodeURIComponent(params.urunId as string).replace(/-/g, " ");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        className="gap-2 text-slate-500 hover:text-slate-900 pl-0"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} /> Geri Dön
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 capitalize">{productName}</h1>
          <p className="text-slate-500 mt-2">Bu ürün için detaylı pazar analizi raporu.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Raporu İndir (PDF)</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Aylık Aranma" value="12.5K" icon={<Users className="text-blue-500" />} />
        <StatsCard title="Ort. Fiyat" value="450 ₺" icon={<DollarSign className="text-green-500" />} />
        <StatsCard title="Rekabet" value="%42" icon={<Activity className="text-orange-500" />} />
        <StatsCard title="Büyüme" value="+%15" icon={<TrendingUp className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Fiyat Geçmişi (12 Aylık)</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceChart />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Rakip Analizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CompetitorRow name="Trendyol Mağazası A" price="440 ₺" />
              <CompetitorRow name="Hepsiburada Satıcı B" price="465 ₺" />
              <CompetitorRow name="Amazon Prime" price="450 ₺" />
              <CompetitorRow name="Pazarama" price="455 ₺" />
              <CompetitorRow name="Çiçeksepeti" price="480 ₺" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PriceChart() {
  const data = [420, 415, 430, 445, 440, 460, 455, 475, 490, 485, 510, 530];
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  const getCoordinates = (val: number, i: number) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 95 - ((val - min) / (max - min)) * 80; 
    return { x, y };
  };

  const points = data.map((val, i) => {
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-64 relative pt-4 pr-2">
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-slate-400 font-medium py-2 pr-2 border-r border-slate-100">
        <span>550 ₺</span>
        <span>500 ₺</span>
        <span>450 ₺</span>
        <span>400 ₺</span>
      </div>
      
      <div className="ml-10 h-full relative">
        <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {data.slice(0, data.length - 1).map((val, i) => {
             const currentPoint = getCoordinates(val, i);
             const nextPoint = getCoordinates(data[i+1], i+1);

             const midX = (currentPoint.x + nextPoint.x) / 2;
             const midY = (currentPoint.y + nextPoint.y) / 2;

             return (
               <line 
                 key={`grid-${i}`}
                 x1={midX} 
                 y1={95}    
                 x2={midX} 
                 y2={midY}  
                 stroke="#cbd5e1" 
                 strokeWidth="0.2"
                 strokeDasharray="2 2"
               />
             )
          })}
          
          <path d={`M0,95 L${points.replace(/ /g, " L")} L100,95 Z`} fill="url(#gradient)" />
          
          <polyline 
            points={points} 
            fill="none" 
            stroke="#6366f1" 
            strokeWidth="0.25"
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {data.map((val, i) => {
              const { x, y } = getCoordinates(val, i);
              return (
                <circle 
                  key={i} 
                  cx={x} 
                  cy={y} 
                  r="0.75"
                  className="fill-white stroke-indigo-600 stroke-[0.5] transition-all hover:r-2 cursor-pointer" 
                />
              )
          })}
        </svg>
        <div className="absolute bottom-6 left-0 w-full h-4">
          {months.map((m, i) => {
             const leftPos = (i / (months.length - 1)) * 100;
             return (
               <span 
                key={i} 
                className="absolute text-[10px] font-bold text-slate-500 whitespace-nowrap"
                style={{ 
                    left: `${leftPos}%`, 
                    transform: 'translateX(-50%)' 
                }}
               >
                 {m}
               </span>
             )
          })}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon }: any) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}

function CompetitorRow({ name, price }: any) {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <span className="text-sm font-medium text-slate-700">{name}</span>
      <span className="text-sm font-bold text-slate-900">{price}</span>
    </div>
  )
}