import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { kategori } = await req.json();

  const tarih = new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  const prompt = `Sen bir Türk e-ticaret trend analistisin. Trendyol ve Hepsiburada'daki güncel trendleri analiz et.

Tarih: ${tarih}
Kategori filtresi: "${kategori || "Tüm kategoriler"}"

Türkiye e-ticaret pazarı için güncel ve gerçekçi trend ürünler belirle. Mevsim, bayramlar, popüler tüketici davranışları ve sosyal medya trendlerini göz önünde bulundur.

Sadece JSON döndür:
{
  "trendler": [
    {
      "urun": "<Trend ürün adı>",
      "kategori": "<Kategori>",
      "trendsSkoru": <1-100 arası trend gücü>,
      "buyumePotansiyeli": <"Düşük" | "Orta" | "Yüksek" | "Patlama Noktasında">,
      "tahminiRekabet": <"Düşük" | "Orta" | "Yüksek">,
      "neden": "<Bu ürünün neden trend olduğu — 1 cümle>",
      "tahminiIlgiSuresi": "<Bu trendin tahmini süresi>"
    }
  ],
  "mevsimselUyari": "<Bu ay için önemli bir mevsimsel not>",
  "altinFirsat": "<Düşük rekabetli, yüksek potansiyelli en iyi fırsat ürünü ve gerekçesi>"
}

Not: Tam olarak 8 ürün listele.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });
    const data = JSON.parse(response.choices[0].message.content!);
    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.status === 429) return NextResponse.json({ error: "OpenAI kota aşıldı." }, { status: 429 });
    return NextResponse.json({ error: "Trend analizi yapılamadı." }, { status: 500 });
  }
}
