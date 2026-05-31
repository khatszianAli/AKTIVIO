"use client";

import { CATEGORIES } from "@/lib/constants/categories";
import type { MissionCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MapFilterBarProps {
  active: MissionCategory | "all";
  onChange: (category: MissionCategory | "all") => void;
  liveCount: number;
}

const FILTERS: Array<{ id: MissionCategory | "all"; label: string }> = [
  { id: "all", label: "Все" },
  { id: "sport", label: "⚽ Спорт" },
  { id: "creative", label: "🎨 Креатив" },
  { id: "nature", label: "🏔️ Природа" },
  { id: "social", label: "🤝 Социал" },
];

export function MapFilterBar({ active, onChange, liveCount }: MapFilterBarProps) {
  return (
    <div className="px-4 pb-2 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200">The Radar 🎯</h2>
        <span className="text-xs text-emerald-400 font-semibold animate-pulse">
          {liveCount} live сейчас
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {FILTERS.map(({ id, label }) => {
          const isActive = active === id;
          const color = id !== "all" ? CATEGORIES[id].color : "#94A3B8";
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                isActive
                  ? "text-white"
                  : "text-slate-400 border-slate-700 bg-slate-800/50 hover:border-slate-600"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `${color}33`,
                      borderColor: `${color}66`,
                      color,
                    }
                  : undefined
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
