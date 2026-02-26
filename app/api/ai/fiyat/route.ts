import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { urun, maliyet, hedefMarj, kategori } = await req.json();
  if (!urun) return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });

  const prompt = `Sen bir e-ticaret fiyatlandırma uzmanısın. Trendyol ve Hepsiburada için fiyat stratejisi belirle.

Ürün: "${urun}"
Kategori: "${kategori || "Belirtilmedi"}"
Maliyet (₺): ${maliyet || "Belirtilmedi"}
Hedef kar marjı: %${hedefMarj || "Belirtilmedi"}

Türk e-ticaret pazarını, rakip fiyatları ve komisyon oranlarını göz önünde bulundurarak sadece JSON döndür:
{
  "onerilenenFiyat": <Önerilen satış fiyatı, sayı, ₺>,
  "minFiyat": <Rekabetçi minimum fiyat, sayı>,
  "maxFiyat": <Üst segment maksimum fiyat, sayı>,
  "trendyolKomisyon": <Tahmini Trendyol komisyon oranı, %, sayı>,
  "hepsiburadaKomisyon": <Tahmini Hepsiburada komisyon oranı, %, sayı>,
  "karMarji": <Bu fiyatta gerçekleşen tahmini kar marjı, %, sayı>,
  "strateji": "<Hangi fiyat stratejisini kullanmalı: penetrasyon/premium/rekabetçi — 1-2 cümle>",
  "uyari": "<Varsa dikkat edilmesi gereken fiyat riski, yoksa null>",
  "rakipAnaliz": "<Piyasadaki rakip fiyat aralığı ve konumlanma tavsiyesi — 2 cümle>"
}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    const data = JSON.parse(response.choices[0].message.content!);
    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.status === 429) return NextResponse.json({ error: "OpenAI kota aşıldı." }, { status: 429 });
    return NextResponse.json({ error: "Fiyat analizi yapılamadı." }, { status: 500 });
  }
}
