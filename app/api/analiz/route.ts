import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { urun } = await req.json();

  if (!urun) {
    return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });
  }

  const prompt = `Sen bir e-ticaret danışmanısın. Kullanıcının sattığı ürün: "${urun}"

Aşağıdaki bilgileri JSON formatında döndür (başka hiçbir şey yazma, sadece JSON):
{
  "score": <0-100 arası satılabilirlik skoru, sayı>,
  "competition": <"Düşük", "Orta" veya "Yüksek">,
  "priceMin": <Türk pazarında tahmini minimum satış fiyatı, sadece sayı>,
  "priceMax": <Türk pazarında tahmini maksimum satış fiyatı, sadece sayı>,
  "shippingDifficulty": <"Kolay", "Orta" veya "Zor">,
  "trend": <"Yükselen Trend 🔥" veya "Evergreen (Daimi) 🌲">,
  "suggestion": <Bu ürün için 2-3 cümlelik Türkçe satış tavsiyesi>
}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const data = JSON.parse(content!);

    return NextResponse.json({
      score: data.score,
      competition: data.competition,
      priceRange: `${data.priceMin}₺ - ${data.priceMax}₺`,
      shippingDifficulty: data.shippingDifficulty,
      trend: data.trend,
      suggestion: data.suggestion,
    });
  } catch (err: any) {
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "OpenAI kota aşıldı. Lütfen platform.openai.com/billing adresinden kredi yükle." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Analiz yapılamadı. Lütfen tekrar dene." }, { status: 500 });
  }
}
