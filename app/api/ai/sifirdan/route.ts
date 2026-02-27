import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { action, nis, magaza_adi, urun, query } = await req.json();

  try {
    if (action === "urunler") {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.8,
        messages: [{
          role: "user",
          content: `Sen bir Türkiye e-ticaret uzmanısın. "${nis}" nişinde şu anda Trendyol veya Hepsiburada'da potansiyeli yüksek, gerçekçi ve satılabilir 6 farklı ürün öner. Her ürün farklı bir alt kategori veya segmentten olsun.
JSON formatında döndür (başka hiçbir şey yazma):
{"urunler": [
  {"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta", "fiyat_araligi": string, "aciklama": string},
  {"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta", "fiyat_araligi": string, "aciklama": string},
  {"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta", "fiyat_araligi": string, "aciklama": string},
  {"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta", "fiyat_araligi": string, "aciklama": string},
  {"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta", "fiyat_araligi": string, "aciklama": string},
  {"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta", "fiyat_araligi": string, "aciklama": string}
]}`
        }],
      });
      return NextResponse.json(JSON.parse(response.choices[0].message.content!));
    }

    // Ürün arama/değerlendirme
    if (action === "urun_ara") {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.5,
        messages: [{
          role: "user",
          content: `Sen bir Türkiye e-ticaret uzmanısın. Kullanıcı "${query}" ürününü ${nis ? `"${nis}" nişinde` : "e-ticarette"} satmayı düşünüyor.
Bu ürünün satış potansiyelini kısaca değerlendir ve ürün bilgilerini ver.
JSON formatında döndür (başka hiçbir şey yazma):
{"ad": string, "emoji": string, "potansiyel": "Yüksek"|"Orta"|"Düşük", "fiyat_araligi": string, "aciklama": string}`
        }],
      });
      return NextResponse.json(JSON.parse(response.choices[0].message.content!));
    }

    if (action === "magaza") {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.8,
        messages: [{
          role: "user",
          content: `"${magaza_adi}" adlı Türkiye e-ticaret mağazası "${nis}" nişinde satış yapıyor.
Bu mağaza için çarpıcı bir slogan ve kısa açıklama yaz.
JSON (başka hiçbir şey yazma):
{"slogan": string, "aciklama": string}`
        }],
      });
      return NextResponse.json(JSON.parse(response.choices[0].message.content!));
    }

    if (action === "reklam") {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.9,
        messages: [{
          role: "user",
          content: `"${magaza_adi}" mağazası için "${urun}" ürününe yönelik Instagram/Facebook reklamı yaz.
Samimi, dikkat çekici ve Türk alışveriş kültürüne uygun olsun.
JSON (başka hiçbir şey yazma):
{"baslik": string, "metin": string, "cta": string, "hashtags": [string, string, string, string, string]}`
        }],
      });
      return NextResponse.json(JSON.parse(response.choices[0].message.content!));
    }

    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  } catch (err: any) {
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "OpenAI kota aşıldı. Lütfen platform.openai.com/billing adresinden kredi yükle." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "İşlem başarısız. Lütfen tekrar dene." }, { status: 500 });
  }
}
