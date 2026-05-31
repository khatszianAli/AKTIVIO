"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getLevelInfo, getXpProgress } from "@/lib/constants/levels";
import { DISTRICTS } from "@/lib/constants/districts";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";
import { CATEGORIES } from "@/lib/constants/categories";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AchievementCard } from "./AchievementCard";
import { EditProfileSheet } from "./EditProfileSheet";
import { InterestsPicker } from "./InterestsPicker";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Flame, Target, Zap, Award, Pencil } from "lucide-react";

export function ProfileView() {
  const { user, updateProfile, updateInterests } = useUser();
  const [editing, setEditing] = useState(false);
  const levelInfo = getLevelInfo(user.xp);
  const progress = getXpProgress(user.xp);
  const district = DISTRICTS[user.district];

  const stats = [
    { icon: Zap, label: "Total XP", value: user.xp.toLocaleString(), color: "#10B981" },
    { icon: Target, label: "Missions", value: String(user.totalMissions), color: "#6366F1" },
    { icon: Flame, label: "Streak", value: `${user.streak} days`, color: "#F59E0B" },
    { icon: Award, label: "Level", value: levelInfo.title, color: levelInfo.color },
  ];

  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    user.unlockedAchievements.includes(a.id)
  ).length;

  return (
    <div className="max-w-lg mx-auto px-4 pt-safe-top pt-4 pb-4 space-y-4">
      <header className="text-center space-y-3 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0"
          onClick={() => setEditing(true)}
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <img
          src={user.avatar}
          alt={user.displayName}
          className="w-24 h-24 rounded-full border-4 mx-auto"
          style={{ borderColor: district.color }}
        />
        <div>
          <h1 className="text-xl font-black">{user.displayName}</h1>
          <p className="text-sm text-slate-400">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-slate-300 mt-2 px-4 leading-relaxed">{user.bio}</p>
          )}
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
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORIES[interest].bgClass} ${CATEGORIES[interest].textClass}`}
            >
              <CategoryIcon category={interest} size="sm" />
              {CATEGORIES[interest].labelRu}
            </span>
          ))}
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
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 text-right">
          {progress.current} / {progress.max} XP до след. уровня
        </p>
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
        <h2 className="text-sm font-bold mb-3">Интересы 🎯</h2>
        <InterestsPicker selected={user.interests} onSave={updateInterests} />
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Achievements 🎖️</h2>
          <span className="text-xs text-slate-500">
            {unlockedCount}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={user.unlockedAchievements.includes(achievement.id)}
            />
          ))}
        </div>
      </Card>

      {editing && (
        <EditProfileSheet
          displayName={user.displayName}
          username={user.username}
          bio={user.bio}
          avatar={user.avatar}
          onSave={updateProfile}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
