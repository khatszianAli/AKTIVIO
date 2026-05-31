"use client";

import type { Challenge } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ChevronRight, Users } from "lucide-react";

interface NearbyActivitiesProps {
  challenges: Challenge[];
  onSelect: (c: Challenge) => void;
}

export function NearbyActivities({ challenges, onSelect }: NearbyActivitiesProps) {
  const nearby = challenges.filter((c) => c.isLive).slice(0, 4);

  return (
    <section className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-200">Рядом с тобой 🔥</h2>
        <span className="text-xs text-slate-500">{nearby.length} активных</span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
        {nearby.map((challenge) => {
          const cat = CATEGORIES[challenge.category];
          return (
            <button
              key={challenge.id}
              onClick={() => onSelect(challenge)}
              className="flex-shrink-0 w-44 rounded-2xl bg-slate-800/80 border border-slate-700/50 p-3 text-left hover:border-slate-600 transition-all active:scale-[0.98]"
              style={{ boxShadow: `0 0 16px ${cat.color}11` }}
            >
              <div className="flex items-center justify-between mb-2">
                <CategoryIcon category={challenge.category} size="sm" />
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                >
                  +{challenge.xpReward} XP
                </span>
              </div>
              <p className="text-xs font-bold text-slate-100 line-clamp-2 mb-1">
                {challenge.title}
              </p>
              <p className="text-[10px] text-slate-500 mb-2">{challenge.locationName}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Users className="w-3 h-3" />
                  {challenge.participants}/{challenge.maxParticipants}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
