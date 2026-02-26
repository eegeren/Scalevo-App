"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
  user: { name: string; email: string } | null;
}

export default function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/giris" || pathname === "/kayit" || pathname === "/tanitim";

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar user={user} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
