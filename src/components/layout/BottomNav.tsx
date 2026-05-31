"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Zap, MessageCircle, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Радар", icon: Map },
  { href: "/missions", label: "Миссии", icon: Zap },
  { href: "/threads", label: "Threads", icon: MessageCircle },
  { href: "/leaderboard", label: "Рейтинг", icon: Trophy },
  { href: "/profile", label: "Профиль", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px]",
                isActive
                  ? "text-emerald-400"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon
                className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
