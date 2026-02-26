import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TRENDYOL_BASE = "https://api.trendyol.com/sapigw/suppliers";

// Trendyol API isteği gönder
async function trendyolRequest(
  endpoint: string,
  supplierId: string,
  apiKey: string,
  apiSecret: string,
  method = "GET",
  body?: object
) {
  const token = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const url = `${TRENDYOL_BASE}/${supplierId}/${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
      "User-Agent": `${supplierId} - SelfIntegration`,
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

  const { action, supplierId, apiKey, apiSecret, payload } = await req.json();

  if (!supplierId || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Trendyol kimlik bilgileri eksik" }, { status: 400 });
  }

  try {
    switch (action) {
      // Siparişleri çek
      case "getOrders": {
        const { ok, data } = await trendyolRequest(
          "orders?status=Created&size=50&page=0",
          supplierId, apiKey, apiSecret
        );
        if (!ok) return NextResponse.json({ error: "Siparişler alınamadı", detail: data }, { status: 400 });

        // Siparişleri Supabase'e kaydet
        const orders = data.content || [];
        for (const o of orders) {
          await supabase.from("marketplace_orders").upsert({
            user_id: user.id,
            platform: "trendyol",
            external_id: String(o.orderNumber),
            status: o.status,
            customer_name: `${o.shipmentAddress?.firstName} ${o.shipmentAddress?.lastName}`,
            total_price: o.totalPrice,
            currency: "TRY",
            items: o.lines,
            raw_data: o,
            created_at: o.orderDate,
          }, { onConflict: "platform,external_id" });
        }

        return NextResponse.json({ orders, total: data.totalElements });
      }

      // Ürünleri çek
      case "getProducts": {
        const { ok, data } = await trendyolRequest(
          "products?size=50&page=0",
          supplierId, apiKey, apiSecret
        );
        if (!ok) return NextResponse.json({ error: "Ürünler alınamadı", detail: data }, { status: 400 });

        const products = data.content || [];
        for (const p of products) {
          await supabase.from("marketplace_products").upsert({
            user_id: user.id,
            platform: "trendyol",
            external_id: String(p.id),
            barcode: p.barcode,
            title: p.title,
            price: p.salePrice,
            stock: p.quantity,
            status: p.approved ? "active" : "passive",
            raw_data: p,
          }, { onConflict: "platform,external_id" });
        }

        return NextResponse.json({ products, total: data.totalElements });
      }

      // Stok & fiyat güncelle
      case "updateStock": {
        const { barcode, quantity, salePrice } = payload;
        const { ok, data } = await trendyolRequest(
          "products/price-and-inventory",
          supplierId, apiKey, apiSecret,
          "POST",
          { items: [{ barcode, quantity, salePrice }] }
        );
        if (!ok) return NextResponse.json({ error: "Güncelleme başarısız", detail: data }, { status: 400 });
        return NextResponse.json({ success: true, data });
      }

      // Sipariş durumu güncelle (kargo bilgisi gönder)
      case "shipOrder": {
        const { orderLineId, shipmentPackageId, trackingNumber, cargoProvider } = payload;
        const { ok, data } = await trendyolRequest(
          `shipment-packages/${shipmentPackageId}`,
          supplierId, apiKey, apiSecret,
          "PUT",
          {
            lines: [{ lineId: orderLineId, quantity: 1 }],
            params: { trackingNumber, cargoProvider },
          }
        );
        if (!ok) return NextResponse.json({ error: "Kargo gönderilemedi", detail: data }, { status: 400 });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Trendyol API hatası", detail: err.message }, { status: 500 });
  }
}
