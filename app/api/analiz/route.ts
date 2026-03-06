import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIErrorMessage } from "@/lib/openai-error";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { urun, kategori } = await req.json();

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: sub } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).single();

      const isPro = sub?.plan === "pro";

      if (!isPro) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await supabase
          .from("analysis_history")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString());

        if ((count || 0) >= 20) {
          return NextResponse.json(
            {
              error: "Ücretsiz planın aylık 20 analiz hakkını doldurdun. Pro'ya geçerek sınırsız analiz yapabilirsin.",
              limitReached: true,
            },
            { status: 403 }
          );
        }
      }
    }
  } catch {
    // DB kaynaklı hata kullanıcı akışını bloklamasın.
  }

  if (!urun) {
    return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });
  }

  const kategoriMetni = kategori ? ` (Kategori: ${kategori})` : "";

  const prompt = `Sen bir Türk e-ticaret danışmanısın. Kullanıcının sattığı ürün: "${urun}"${kategoriMetni}

Ürünü bu kategoride değerlendir. Fiyatlar Türkiye pazarına ve güncel piyasaya uygun olmalı.

Aşağıdaki bilgileri JSON formatında döndür (başka hiçbir şey yazma, sadece JSON):
{
  "score": <Bu spesifik ürün için 0-100 arası satılabilirlik skoru - rekabet, talep ve kar marjını göz önünde bulundur, sayı>,
  "competition": <"Düşük", "Orta" veya "Yüksek">,
  "priceMin": <Trendyol/Hepsiburada'da bu ürünün gerçekçi minimum satış fiyatı (TL), sadece sayı>,
  "priceMax": <Trendyol/Hepsiburada'da bu ürünün gerçekçi maksimum satış fiyatı (TL), sadece sayı>,
  "shippingDifficulty": <"Kolay", "Orta" veya "Zor">,
  "trend": <"Yükselen Trend" veya "Evergreen (Daimi)">,
  "suggestion": <Bu ürün ve kategori için 2-3 cümlelik özgün, spesifik Türkçe satış tavsiyesi>
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
    return NextResponse.json(
      { error: getOpenAIErrorMessage(err, "Analiz yapılamadı. Lütfen tekrar dene.") },
      { status: err?.status === 429 ? 429 : 500 }
    );
  }
}
