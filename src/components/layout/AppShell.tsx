import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100 flex flex-col">
      <main className={hideNav ? "flex-1" : "flex-1 pb-20"}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
