import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Kurucular / admin e-postalar — virgülle ayır
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

function isAdmin(email: string) {
  if (ADMIN_EMAILS.length === 0) return true; // Env set edilmemişse herkese açık (geliştirme)
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

function isMissingTable(error: any) {
  return error?.code === "42P01";
}

function normalizeOrderStatus(status: string | null | undefined) {
  const s = (status || "").toLowerCase();
  if (["new", "preparing", "shipped", "completed", "returned"].includes(s)) return s;
  return "new";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, message, path, stack } = body || {};

    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // Admin Supabase client (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    if (action === "stats") {
      const dayAgoIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const sevenDaysAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const dayAgoTimestamp = Date.now() - 24 * 60 * 60 * 1000;

      const startedAt = Date.now();
      const dbPing = await supabaseAdmin.from("analysis_history").select("id").limit(1);
      const dbLatencyMs = Date.now() - startedAt;

      const [
        analysisCountRes,
        orderCountRes,
        productCountRes,
        userCountRes,
        marketplaceOrderCountRes,
        recentAnalysesRes,
        recentErrorsRes,
        errors24hRes,
        recentOrdersRes,
        recentMarketplaceOrdersRes,
        orderStatusRowsRes,
        orderRevenueRowsRes,
        analyses24hRes,
        analyses7dRes,
        orders24hRes,
      ] = await Promise.all([
        supabaseAdmin.from("analysis_history").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("marketplace_orders").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("analysis_history")
          .select("product_name, score, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
        supabaseAdmin.from("app_errors")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        supabaseAdmin.from("app_errors")
          .select("*", { count: "exact", head: true })
          .gte("created_at", dayAgoIso),
        supabaseAdmin.from("orders")
          .select("customer, item, price, price_num, status, date, timestamp")
          .order("timestamp", { ascending: false })
          .limit(10),
        supabaseAdmin.from("marketplace_orders")
          .select("platform, customer_name, total_price, status, created_at")
          .order("updated_at", { ascending: false })
          .limit(10),
        supabaseAdmin.from("orders").select("status").limit(5000),
        supabaseAdmin.from("orders").select("price_num").limit(5000),
        supabaseAdmin.from("analysis_history")
          .select("*", { count: "exact", head: true })
          .gte("created_at", dayAgoIso),
        supabaseAdmin.from("analysis_history")
          .select("created_at")
          .gte("created_at", sevenDaysAgoIso)
          .order("created_at", { ascending: true }),
        supabaseAdmin.from("orders")
          .select("*", { count: "exact", head: true })
          .gte("timestamp", dayAgoTimestamp),
      ]);

      const infraItems = [
        {
          name: "Supabase DB",
          status: dbPing.error ? "error" : "ok",
          detail: dbPing.error ? (isMissingTable(dbPing.error) ? "Tablo eksik" : dbPing.error.message) : `${dbLatencyMs}ms`,
        },
        {
          name: "Supabase URL",
          status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "ok" : "error",
          detail: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Tanımlı" : "Eksik env",
        },
        {
          name: "Supabase Service Role",
          status: process.env.SUPABASE_SERVICE_ROLE_KEY ? "ok" : "warn",
          detail: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Aktif" : "Anon key fallback",
        },
        {
          name: "OpenAI API Key",
          status: process.env.OPENAI_API_KEY ? "ok" : "warn",
          detail: process.env.OPENAI_API_KEY ? "Tanımlı" : "Eksik env",
        },
      ];

      const orderStatusCounts = { new: 0, preparing: 0, shipped: 0, completed: 0, returned: 0 };
      for (const row of orderStatusRowsRes.data || []) {
        const key = normalizeOrderStatus(row.status) as keyof typeof orderStatusCounts;
        orderStatusCounts[key] += 1;
      }

      const localRecentOrders = (recentOrdersRes.data || []).map((o: any) => ({
        customer: o.customer || "—",
        item: o.item || "Sipariş",
        price: o.price || `${Number(o.price_num || 0).toLocaleString("tr-TR")}₺`,
        status: normalizeOrderStatus(o.status),
        date: o.date || "",
        timestamp: Number(o.timestamp || 0),
        source: "app",
      }));

      const marketplaceRecentOrders = (recentMarketplaceOrdersRes.data || []).map((o: any) => ({
        customer: o.customer_name || "—",
        item: `${(o.platform || "marketplace").toUpperCase()} Siparişi`,
        price: `${Number(o.total_price || 0).toLocaleString("tr-TR")}₺`,
        status: normalizeOrderStatus(o.status),
        date: o.created_at ? new Date(o.created_at).toLocaleDateString("tr-TR") : "",
        timestamp: o.created_at ? new Date(o.created_at).getTime() : 0,
        source: o.platform || "marketplace",
      }));

      const recentOrders = [...localRecentOrders, ...marketplaceRecentOrders]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      const totalRevenue = (orderRevenueRowsRes.data || []).reduce((sum: number, r: any) => {
        return sum + Number(r.price_num || 0);
      }, 0);

      const analysesByDay: Record<string, number> = {};
      for (const row of analyses7dRes.data || []) {
        const key = new Date(row.created_at).toISOString().slice(0, 10);
        analysesByDay[key] = (analysesByDay[key] || 0) + 1;
      }

      const missingTables = [
        analysisCountRes,
        orderCountRes,
        productCountRes,
        userCountRes,
        marketplaceOrderCountRes,
        recentErrorsRes,
      ]
        .filter((r) => isMissingTable((r as any).error))
        .map((r: any) => r.error?.message || "Eksik tablo");

      const [
        analysisCount,
        orderCount,
        productCount,
        userCount,
        marketplaceOrdersCount,
        analyses24h,
        orders24h,
        errors24h,
      ] = [
        analysisCountRes.count || 0,
        orderCountRes.count || 0,
        productCountRes.count || 0,
        userCountRes.count || 0,
        marketplaceOrderCountRes.count || 0,
        analyses24hRes.count || 0,
        orders24hRes.count || 0,
        errors24hRes.count || 0,
      ];

      return NextResponse.json({
        stats: {
          totalAnalyses: analysisCount,
          totalOrders: orderCount + marketplaceOrdersCount,
          totalProducts: productCount,
          totalUsers: userCount,
          totalRevenue: totalRevenue,
          analyses24h,
          orders24h,
          errors24h,
        },
        trends: {
          analysesByDay,
        },
        health: {
          dbPingOk: !dbPing.error,
          dbLatencyMs,
          missingTables,
        },
        infrastructure: infraItems,
        orderStatusCounts,
        recentAnalyses: recentAnalysesRes.data || [],
        recentErrors: recentErrorsRes.data || [],
        recentOrders,
      });
    }

    if (action === "log_error") {
      await supabaseAdmin.from("app_errors").insert({
        message, path, stack,
        user_email: email,
        created_at: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Sunucu hatası" }, { status: 500 });
  }
}
