"use client";

import { useState } from "react";
import { MOCK_DISTRICT_STATS, MOCK_CITY_LEADERBOARD, MOCK_FRIENDS_LEADERBOARD } from "@/lib/mock/leaderboard";
import { DISTRICTS } from "@/lib/constants/districts";
import { formatXp } from "@/lib/utils";
import { Trophy, Users, Zap } from "lucide-react";

type Tab = "district" | "city" | "friends";

export function LeaderboardView() {
  const [tab, setTab] = useState<Tab>("district");

  const tabs: { id: Tab; label: string }[] = [
    { id: "district", label: "District War" },
    { id: "city", label: "City" },
    { id: "friends", label: "Friends" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-safe-top pt-4 pb-4 space-y-4">
      <header>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Rankings</p>
        <h1 className="text-2xl font-black">Leaderboards 🏆</h1>
      </header>

      <div className="flex gap-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
              tab === id
                ? "border-amber-500 bg-amber-500/20 text-amber-400"
                : "border-slate-700 text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "district" && (
        <div className="space-y-3">
          {MOCK_DISTRICT_STATS.sort((a, b) => a.rank - b.rank).map((stat) => {
            const d = DISTRICTS[stat.district];
            return (
              <div
                key={stat.district}
                className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4"
                style={{ boxShadow: stat.rank === 1 ? `0 0 24px ${d.color}22` : undefined }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black"
                    style={{ backgroundColor: `${d.color}22` }}
                  >
                    {stat.rank === 1 ? "👑" : `#${stat.rank}`}
                  </div>
                  <div className="flex-1">
                    <p className="font-black" style={{ color: d.color }}>
                      {d.emoji} {d.nameRu}
                    </p>
                    <div className="flex gap-3 mt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {formatXp(stat.totalXp)} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {stat.activeUsers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {stat.weeklyWins} wins
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(stat.totalXp / 50000) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(tab === "city" || tab === "friends") && (
        <div className="space-y-2">
          {(tab === "city" ? MOCK_CITY_LEADERBOARD : MOCK_FRIENDS_LEADERBOARD).map(
            (entry) => (
              <div
                key={entry.user.id}
                className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-slate-700/40 px-3 py-3"
              >
                <span
                  className={`w-7 text-center font-black text-sm ${
                    entry.rank <= 3 ? "text-amber-400" : "text-slate-600"
                  }`}
                >
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                </span>
                <img
                  src={entry.user.avatar}
                  alt={entry.user.displayName}
                  className="w-9 h-9 rounded-full border border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{entry.user.displayName}</p>
                  <p className="text-[10px] text-slate-500">
                    {DISTRICTS[entry.user.district].nameRu} · Lvl {entry.user.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">
                    +{entry.weeklyXp} XP
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {entry.missionsCompleted} missions
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
