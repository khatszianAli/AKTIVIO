"use client";

import { SalkynAvatar } from "./SalkynAvatar";
import { cn } from "@/lib/utils";

interface SalkynFloatingButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function SalkynFloatingButton({ onClick, isOpen }: SalkynFloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Открыть AI Ассистент Салкын"
      className={cn(
        "fixed z-40 right-4 bottom-24 flex items-center gap-2 rounded-2xl pl-2 pr-4 py-2",
        "bg-slate-900/95 backdrop-blur-xl border-2 shadow-lg transition-all active:scale-95",
        isOpen
          ? "border-cyan-400/60 shadow-cyan-500/20"
          : "border-cyan-500/40 shadow-cyan-500/30 hover:border-cyan-400"
      )}
      style={{ boxShadow: "0 0 24px rgba(6, 182, 212, 0.25)" }}
    >
      <div className="relative">
        <SalkynAvatar size="sm" />
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
        )}
      </div>
      <div className="text-left">
        <p className="text-[10px] font-bold text-cyan-400 leading-none">AI Advisor</p>
        <p className="text-xs font-black text-white leading-tight">Салкын 🧊</p>
      </div>
    </button>
  );
}
