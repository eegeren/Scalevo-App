import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIErrorMessage } from "@/lib/openai-error";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { magazaAdi, nis, slogan } = await req.json();

  if (!magazaAdi || !nis) {
    return NextResponse.json({ error: "Mağaza bilgisi eksik" }, { status: 400 });
  }

  const sloganMetni = slogan ? ` Slogan: "${slogan}".` : "";

  const prompt = `Sen bir Türk e-ticaret pazarlama uzmanısın.
Mağaza adı: "${magazaAdi}"
Kategori/niş: ${nis}${sloganMetni}

Bu mağaza için 3 farklı reklam metni yaz:
1. Trendyol/Hepsiburada ürün açıklaması için kısa ve güçlü bir tanıtım cümlesi
2. Instagram/Facebook için emoji destekli sosyal medya paylaşımı
3. Müşteri güveni oluşturan bir slogan alternatifi

Her birini net şekilde numaralandır. Türkçe yaz. Samimi ve satış odaklı ol.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 400,
    });

    const reklam = response.choices[0].message.content || "";
    return NextResponse.json({ reklam });
  } catch (err: any) {
    return NextResponse.json(
      { error: getOpenAIErrorMessage(err, "Reklam üretilemedi.") },
      { status: err?.status === 429 ? 429 : 500 }
    );
  }
}
