import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { urunler } = await req.json(); // string[]
  if (!urunler || urunler.length < 2) {
    return NextResponse.json({ error: "En az 2 ürün gerekli" }, { status: 400 });
  }

  const prompt = `Sen bir Türk e-ticaret uzmanısın. Aşağıdaki ${urunler.length} ürünü Trendyol ve Hepsiburada pazarı için karşılaştır.

Ürünler: ${urunler.map((u: string, i: number) => `${i + 1}. "${u}"`).join(", ")}

Sadece JSON döndür:
{
  "kazanan": "<Hangisi en iyi seçim? Ürün adı>",
  "kazananNeden": "<2 cümle gerekçe>",
  "urunler": [
    {
      "ad": "<ürün adı>",
      "score": <0-100>,
      "rekabet": <"Düşük" | "Orta" | "Yüksek">,
      "fiyatAraligi": "<örn: 150₺ - 400₺>",
      "kargoZorluk": <"Kolay" | "Orta" | "Zor">,
      "trend": <"Yükselen" | "Stabil" | "Düşen">,
      "pazarBuyuklugu": <"Küçük" | "Orta" | "Büyük">,
      "baslamaSuresi": "<Bu ürünle satışa başlamak ne kadar sürer>",
      "gucluYonler": ["<güçlü yön 1>", "<güçlü yön 2>", "<güçlü yön 3>"],
      "zayifYonler": ["<zayıf yön 1>", "<zayıf yön 2>"],
      "ozet": "<Bu ürün hakkında 1 cümle özet tavsiye>"
    }
  ],
  "karsilastirmaOzeti": "<Tüm ürünleri değerlendiren genel 2-3 cümle sonuç>"
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
    return NextResponse.json({ error: "Karşılaştırma yapılamadı." }, { status: 500 });
  }
}
