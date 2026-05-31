"use client";

import type { Challenge, LiveActivity } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Users, MapPin, Clock, Zap } from "lucide-react";

interface ActivitySheetProps {
  challenge?: Challenge | null;
  activity?: LiveActivity | null;
  isJoined: boolean;
  onJoin: () => void;
  onClose: () => void;
}

export function ActivitySheet({
  challenge,
  activity,
  isJoined,
  onJoin,
  onClose,
}: ActivitySheetProps) {
  const item = challenge ?? activity;
  if (!item) return null;

  const category = item.category;
  const catConfig = CATEGORIES[category];
  const isChallenge = !!challenge;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 animate-slide-up">
        <div
          className="rounded-3xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl max-w-lg mx-auto"
          style={{ boxShadow: `0 -8px 40px ${catConfig.color}22` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <CategoryIcon category={category} size="lg" />
              <Badge color={catConfig.color} pulse={isChallenge && challenge.isLive}>
                {isChallenge && challenge.isLive ? "LIVE" : "ACTIVE"}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-black text-white mb-1">{item.title}</h3>
          {isChallenge && (
            <p className="text-sm text-slate-400 mb-3 leading-relaxed">
              {challenge.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {item.locationName}
            </span>
            {isChallenge && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {challenge.timeMinutes} мин
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {isChallenge
                ? `${challenge.participants}/${challenge.maxParticipants}`
                : `${activity!.participants.length}/${activity!.maxParticipants}`}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              +{item.xpReward} XP
            </span>
          </div>

          {!isChallenge && activity && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {activity.participants.slice(0, 4).map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar}
                    alt={p.displayName}
                    className="w-8 h-8 rounded-full border-2 border-slate-900"
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                {activity.participants.map((p) => p.displayName).join(", ")} уже тут
              </span>
            </div>
          )}

          <Button
            variant={isJoined ? "secondary" : "neon"}
            fullWidth
            size="lg"
            onClick={onJoin}
            disabled={isJoined}
          >
            {isJoined ? "✓ Ты в игре!" : "Join Activity 🚀"}
          </Button>
        </div>
      </div>
    </>
  );
}
