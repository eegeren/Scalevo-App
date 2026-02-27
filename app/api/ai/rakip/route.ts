import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { urun, platform } = await req.json();
  if (!urun) return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });

  const platformMetni = platform === "hepsiburada" ? "Hepsiburada" : "Trendyol";

  const prompt = `Sen bir Türk e-ticaret fiyat analisti. 
${platformMetni} pazaryerinde "${urun}" ürününü araştır.

Türkiye piyasasındaki güncel fiyat verilerini JSON formatında döndür:
{
  "enDusuk": <bu ürünün ${platformMetni}'daki tipik en düşük fiyatı, sadece sayı (TL)>,
  "enYuksek": <bu ürünün ${platformMetni}'daki tipik en yüksek fiyatı, sadece sayı (TL)>,
  "ortalamaFiyat": <bu ürünün ${platformMetni}'daki ortalama satış fiyatı, sadece sayı (TL)>,
  "saticiSayisi": <bu kategoride yaklaşık kaç satıcı var, sayı>,
  "trend": <"artıyor", "stabil" veya "düşüyor">,
  "tavsiye": <bu fiyat aralığında rekabet etmek için 1-2 cümlelik Türkçe tavsiye>
}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });
    const data = JSON.parse(response.choices[0].message.content!);
    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.status === 429) return NextResponse.json({ error: "OpenAI kota aşıldı." }, { status: 429 });
    return NextResponse.json({ error: "Fiyat analizi yapılamadı." }, { status: 500 });
  }
}
