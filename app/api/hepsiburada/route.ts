import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HB_BASE = "https://mpop.hepsiburada.com/api";

// Hepsiburada API isteği
async function hbRequest(
  endpoint: string,
  username: string,
  password: string,
  method = "GET",
  body?: object
) {
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  const url = `${HB_BASE}/${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { action, username, password, merchantId, payload } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Hepsiburada kimlik bilgileri eksik" }, { status: 400 });
  }

  try {
    switch (action) {
      // Siparişleri çek
      case "getOrders": {
        const { ok, data } = await hbRequest(
          `orders?status=Created&limit=50&offset=0`,
          username, password
        );
        if (!ok) return NextResponse.json({ error: "Siparişler alınamadı", detail: data }, { status: 400 });

        const orders = data.data || [];
        for (const o of orders) {
          await supabase.from("marketplace_orders").upsert({
            user_id: user.id,
            platform: "hepsiburada",
            external_id: String(o.id),
            status: o.status,
            customer_name: o.customer?.name,
            total_price: o.totalAmount,
            currency: "TRY",
            items: o.orderLines,
            raw_data: o,
            created_at: o.createdAt,
          }, { onConflict: "platform,external_id" });
        }

        return NextResponse.json({ orders, total: data.totalCount });
      }

      // Ürün listinglerini çek
      case "getListings": {
        const { ok, data } = await hbRequest(
          `listings/merchantid/${merchantId}?limit=50&offset=0`,
          username, password
        );
        if (!ok) return NextResponse.json({ error: "Listing alınamadı", detail: data }, { status: 400 });

        const listings = data.listings || [];
        for (const l of listings) {
          await supabase.from("marketplace_products").upsert({
            user_id: user.id,
            platform: "hepsiburada",
            external_id: l.hepsiburadaSku,
            barcode: l.merchantSku,
            title: l.productName,
            price: l.price,
            stock: l.availableStock,
            status: l.isSalable ? "active" : "passive",
            raw_data: l,
          }, { onConflict: "platform,external_id" });
        }

        return NextResponse.json({ listings, total: data.totalCount });
      }

      // Stok & fiyat güncelle
      case "updateListing": {
        const { sku, price, stock } = payload;
        const { ok, data } = await hbRequest(
          "listings/merchantid/" + merchantId,
          username, password,
          "POST",
          { listings: [{ hepsiburadaSku: sku, price, availableStock: stock }] }
        );
        if (!ok) return NextResponse.json({ error: "Güncelleme başarısız", detail: data }, { status: 400 });
        return NextResponse.json({ success: true });
      }

      // Kargo bilgisi gönder
      case "shipOrder": {
        const { packageNumber, trackingNumber, cargoCompany } = payload;
        const { ok, data } = await hbRequest(
          `packages/${packageNumber}/send-cargo`,
          username, password,
          "POST",
          { trackingNumber, cargoCompany }
        );
        if (!ok) return NextResponse.json({ error: "Kargo gönderilemedi", detail: data }, { status: 400 });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Hepsiburada API hatası", detail: err.message }, { status: 500 });
  }
}
