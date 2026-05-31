"use client";

import { MOCK_DISTRICT_STATS } from "@/lib/mock/leaderboard";
import { DISTRICTS } from "@/lib/constants/districts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function DistrictWarMini() {
  const sorted = [...MOCK_DISTRICT_STATS].sort((a, b) => a.rank - b.rank);

  return (
    <section className="px-4 pt-2 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-200">District War ⚔️</h2>
        <span className="text-xs text-slate-500">эта неделя</span>
      </div>
      <div className="space-y-2">
        {sorted.map((stat) => {
          const district = DISTRICTS[stat.district];
          const TrendIcon =
            stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;
          const trendColor =
            stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-red-400" : "text-slate-500";

          return (
            <div
              key={stat.district}
              className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-slate-700/40 px-3 py-2.5"
            >
              <span className="text-lg font-black text-slate-600 w-5">#{stat.rank}</span>
              <span className="text-base">{district.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: district.color }}>
                  {district.nameRu}
                </p>
                <p className="text-[10px] text-slate-500">
                  {(stat.totalXp / 1000).toFixed(1)}k XP · {stat.activeUsers} online
                </p>
              </div>
              <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
