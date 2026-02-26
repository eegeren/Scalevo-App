import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { urun, kategori, ozellikler } = await req.json();
  if (!urun) return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });

  const prompt = `Sen bir Trendyol SEO uzmanısın. Aşağıdaki ürün için optimize edilmiş içerik üret.

Ürün: "${urun}"
Kategori: "${kategori || "Belirtilmedi"}"
Öne çıkan özellikler: "${ozellikler || "Belirtilmedi"}"

Sadece JSON döndür:
{
  "baslik1": "<60 karakter, anahtar kelime başta, güçlü Trendyol başlığı>",
  "baslik2": "<60 karakter, farklı açıdan alternatif başlık>",
  "baslik3": "<60 karakter, fayda odaklı üçüncü seçenek>",
  "aciklama": "<150-200 kelime, SEO uyumlu, madde madde özellikler içeren Türkçe ürün açıklaması>",
  "etiketler": ["<anahtar kelime 1>", "<anahtar kelime 2>", "<anahtar kelime 3>", "<anahtar kelime 4>", "<anahtar kelime 5>"],
  "ipucu": "<Bu ürünü listelerken dikkat edilmesi gereken 1-2 cümle pratik tavsiye>"
}`;

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
    return NextResponse.json({ error: "İçerik üretilemedi." }, { status: 500 });
  }
}
