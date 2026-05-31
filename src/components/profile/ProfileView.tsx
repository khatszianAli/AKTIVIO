"use client";

import { useUser } from "@/hooks/useUser";
import { getLevelInfo, getXpProgress } from "@/lib/constants/levels";
import { DISTRICTS } from "@/lib/constants/districts";
import { Card } from "@/components/ui/Card";
import { Flame, Target, Zap, Award } from "lucide-react";

export function ProfileView() {
  const { user } = useUser();
  const levelInfo = getLevelInfo(user.xp);
  const progress = getXpProgress(user.xp);
  const district = DISTRICTS[user.district];

  const stats = [
    { icon: Zap, label: "Total XP", value: user.xp.toLocaleString(), color: "#10B981" },
    { icon: Target, label: "Missions", value: String(user.totalMissions), color: "#6366F1" },
    { icon: Flame, label: "Streak", value: `${user.streak} days`, color: "#F59E0B" },
    { icon: Award, label: "Level", value: levelInfo.title, color: levelInfo.color },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-safe-top pt-4 pb-4 space-y-4">
      <header className="text-center space-y-3">
        <img
          src={user.avatar}
          alt={user.displayName}
          className="w-24 h-24 rounded-full border-4 mx-auto"
          style={{ borderColor: district.color }}
        />
        <div>
          <h1 className="text-xl font-black">{user.displayName}</h1>
          <p className="text-sm text-slate-400">@{user.username}</p>
        </div>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
          style={{
            backgroundColor: `${district.color}22`,
            color: district.color,
            border: `1px solid ${district.color}44`,
          }}
        >
          {district.emoji} {district.nameRu}
        </div>
      </header>

      <Card className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: levelInfo.color }}>
            Level {levelInfo.level} — {levelInfo.title}
          </span>
          <span className="text-xs text-slate-500">{progress.percent}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} glow={color} className="text-center space-y-1">
            <Icon className="w-5 h-5 mx-auto" style={{ color }} />
            <p className="text-lg font-black">{value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-sm font-bold mb-3">Achievements 🎖️</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: "🏃", name: "First Run", unlocked: true },
            { emoji: "🎨", name: "Street Artist", unlocked: true },
            { emoji: "☀️", name: "Summer Legend", unlocked: user.level >= 5 },
            { emoji: "🤝", name: "Social Butterfly", unlocked: user.totalMissions >= 30 },
            { emoji: "🏔️", name: "Mountain Soul", unlocked: false },
            { emoji: "👑", name: "District Hero", unlocked: user.streak >= 7 },
          ].map((ach) => (
            <div
              key={ach.name}
              className={`text-center p-2 rounded-xl ${
                ach.unlocked
                  ? "bg-slate-700/50"
                  : "bg-slate-800/30 opacity-40 grayscale"
              }`}
            >
              <span className="text-2xl">{ach.emoji}</span>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold">{ach.name}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
