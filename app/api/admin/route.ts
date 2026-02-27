import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Kurucular / admin e-postalar — virgülle ayır
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

function isAdmin(email: string) {
  if (ADMIN_EMAILS.length === 0) return true; // Env set edilmemişse herkese açık (geliştirme)
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function POST(req: NextRequest) {
  try {
    const { action, email } = await req.json();

    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // Admin Supabase client (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    if (action === "stats") {
      const [
        { count: analysisCount },
        { count: orderCount },
        { count: productCount },
        { data: recentAnalyses },
        { data: recentErrors },
        { data: recentOrders },
      ] = await Promise.all([
        supabaseAdmin.from("analysis_history").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("analysis_history")
          .select("product_name, score, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
        supabaseAdmin.from("app_errors")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        supabaseAdmin.from("orders")
          .select("customer, item, price, status, date")
          .order("timestamp", { ascending: false })
          .limit(10),
      ]);

      return NextResponse.json({
        stats: {
          totalAnalyses: analysisCount || 0,
          totalOrders: orderCount || 0,
          totalProducts: productCount || 0,
        },
        recentAnalyses: recentAnalyses || [],
        recentErrors: recentErrors || [],
        recentOrders: recentOrders || [],
      });
    }

    if (action === "log_error") {
      const { message, path, stack } = await req.json().catch(() => ({}));
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
