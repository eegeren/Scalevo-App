import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { urun, kategori } = await req.json();
  if (!urun) return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });

  const prompt = `Sen bir Türk e-ticaret müşteri analisti ve ürün geliştirme uzmanısın.

Ürün: "${urun}"
Kategori: "${kategori || "Belirtilmedi"}"

Trendyol ve Hepsiburada'daki bu ürün kategorisinde müşterilerin tipik olarak ne gibi şikayetler ve övgüler yazdığını analiz et. Bu bilgiyi kullanarak rakiplerden nasıl öne çıkılabileceğini belirle.

Sadece JSON döndür:
{
  "sikayetler": [
    { "baslik": "<Şikayet başlığı>", "detay": "<Müşterilerin ne dediği>", "sıklık": <"Çok Sık" | "Sık" | "Orta"> }
  ],
  "ovguler": [
    { "baslik": "<Övgü başlığı>", "detay": "<Müşterilerin ne dediği>" }
  ],
  "fırsatlar": [
    { "baslik": "<Rakip boşluğu>", "aciklama": "<Bu boşluğu nasıl doldurabilirsin>", "oncelik": <"Kritik" | "Önemli" | "İyi Olur"> }
  ],
  "idealMusteri": "<Bu ürünü genellikle kim alıyor — 1 cümle profil>",
  "kazanmaFormulu": "<Rakipleri geçmek için 2-3 maddelik somut aksiyon planı>"
}

Not: Şikayetler için 4-5 madde, övgüler için 3-4 madde, fırsatlar için 3-4 madde listele.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });
    const data = JSON.parse(response.choices[0].message.content!);
    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.status === 429) return NextResponse.json({ error: "OpenAI kota aşıldı." }, { status: 429 });
    return NextResponse.json({ error: "Yorum analizi yapılamadı." }, { status: 500 });
  }
}
