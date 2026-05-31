"use client";

import { useUser } from "@/hooks/useUser";
import { getLevelInfo, getXpProgress } from "@/lib/constants/levels";
import { DISTRICTS } from "@/lib/constants/districts";
import { formatXp } from "@/lib/utils";
import { Flame, Zap } from "lucide-react";

export function DashboardHeader() {
  const { user } = useUser();
  const levelInfo = getLevelInfo(user.xp);
  const progress = getXpProgress(user.xp);
  const district = DISTRICTS[user.district];

  return (
    <header className="px-4 pt-safe-top pt-4 pb-3 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
            Summer Vibe Edition ☀️
          </p>
          <h1 className="text-2xl font-black tracking-tight">
            Aktivio
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Привет, {user.displayName.split(" ")[0]} 👋
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${district.color}22`,
              color: district.color,
              border: `1px solid ${district.color}44`,
            }}
          >
            <span>{district.emoji}</span>
            <span>{district.nameRu}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>{user.streak} дней</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
              style={{ backgroundColor: `${levelInfo.color}33`, color: levelInfo.color }}
            >
              {levelInfo.level}
            </div>
            <div>
              <p className="text-xs text-slate-400">Уровень {levelInfo.level}</p>
              <p className="text-sm font-bold" style={{ color: levelInfo.color }}>
                {levelInfo.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span className="font-black text-lg">{formatXp(user.xp)}</span>
            <span className="text-xs text-slate-500">XP</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 text-right">
            {progress.current} / {progress.max} XP до след. уровня
          </p>
        </div>
      </div>
    </header>
  );
}
