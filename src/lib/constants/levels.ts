import type { LevelInfo } from "@/lib/types";

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Beginner", minXp: 0, maxXp: 500, color: "#94A3B8" },
  { level: 2, title: "Explorer", minXp: 500, maxXp: 1500, color: "#06B6D4" },
  { level: 3, title: "Adventurer", minXp: 1500, maxXp: 3500, color: "#10B981" },
  { level: 4, title: "Champion", minXp: 3500, maxXp: 7000, color: "#6366F1" },
  { level: 5, title: "Hero", minXp: 7000, maxXp: 12000, color: "#F59E0B" },
  { level: 6, title: "Legend", minXp: 12000, maxXp: 99999, color: "#EC4899" },
];

export function getLevelInfo(xp: number): LevelInfo {
  const level = [...LEVELS].reverse().find((l) => xp >= l.minXp) ?? LEVELS[0];
  return level;
}

export function getXpProgress(xp: number): { current: number; max: number; percent: number } {
  const level = getLevelInfo(xp);
  const current = xp - level.minXp;
  const max = level.maxXp - level.minXp;
  const percent = Math.min(100, Math.round((current / max) * 100));
  return { current, max, percent };
}
