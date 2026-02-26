import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scalevo",
  description: "E-Ticaret Yönetim Paneli",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const appUser = user
    ? { name: user.user_metadata?.name || user.email || "Kullanıcı", email: user.email || "" }
    : null;

  return (
    <html lang="tr">
      <body className={inter.className}>
        <AppShell user={appUser}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
