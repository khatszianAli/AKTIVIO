import type { Achievement } from "@/lib/types";
import { RARITY_GLOW, RARITY_LABELS } from "@/lib/constants/achievements";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  compact?: boolean;
}

export function AchievementCard({ achievement, unlocked, compact }: AchievementCardProps) {
  const glow = RARITY_GLOW[achievement.rarity];

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border transition-all",
        compact ? "p-3" : "p-4",
        unlocked ? "opacity-100" : "opacity-45 grayscale"
      )}
      style={{
        borderColor: unlocked ? `${glow}55` : "#334155",
        boxShadow: unlocked ? `0 0 24px ${glow}33` : undefined,
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${achievement.gradient[0]}, ${achievement.gradient[1]})`,
        }}
      />
      <div className="relative space-y-2">
        <div className="flex items-start justify-between">
          <span className={compact ? "text-2xl" : "text-3xl"}>{achievement.emoji}</span>
          {!unlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
        </div>
        <div>
          <p
            className={cn("font-black leading-tight", compact ? "text-xs" : "text-sm")}
            style={{ color: unlocked ? glow : "#64748B" }}
          >
            {achievement.titleRu}
          </p>
          {!compact && (
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              {achievement.description}
            </p>
          )}
        </div>
        <span
          className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${glow}22`,
            color: glow,
          }}
        >
          {RARITY_LABELS[achievement.rarity]}
        </span>
      </div>
    </div>
  );
}
