import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { action, user } = await req.json();

  if (action === "login") {
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth_user", JSON.stringify(user), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  }

  if (action === "logout") {
    const res = NextResponse.json({ success: true });
    res.cookies.delete("auth_user");
    return res;
  }

  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}
