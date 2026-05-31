import type { Achievement, User } from "@/lib/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_challenge",
    title: "First Challenge",
    titleRu: "Первый челлендж",
    description: "Заверши свою первую миссию в Aktivio",
    emoji: "🎯",
    rarity: "common",
    gradient: ["#64748B", "#475569"],
    condition: (u) => u.totalMissions >= 1,
  },
  {
    id: "summer_survivor",
    title: "Summer Survivor",
    titleRu: "Летний выживший",
    description: "5 дней подряд активен — жара не победит!",
    emoji: "☀️",
    rarity: "rare",
    gradient: ["#F59E0B", "#EF4444"],
    condition: (u) => u.streak >= 5,
  },
  {
    id: "king_dzerzhinka",
    title: "King of Dzerzhinka",
    titleRu: "Король Дзержинки",
    description: "20+ миссий в Сверdlovsky — ты знаешь каждый двор",
    emoji: "👑",
    rarity: "epic",
    gradient: ["#F59E0B", "#8B5CF6"],
    condition: (u) => u.district === "sverdlovsky" && u.totalMissions >= 20,
  },
  {
    id: "street_artist",
    title: "Street Artist",
    titleRu: "Уличный художник",
    description: "Креатив — твоя стихия. 10+ креативных миссий",
    emoji: "🎨",
    rarity: "rare",
    gradient: ["#6366F1", "#EC4899"],
    condition: (u) => u.interests.includes("creative") && u.totalMissions >= 10,
  },
  {
    id: "mountain_soul",
    title: "Mountain Soul",
    titleRu: "Горная душа",
    description: "Природа зовёт — достигни 3000 XP",
    emoji: "🏔️",
    rarity: "epic",
    gradient: ["#06B6D4", "#10B981"],
    condition: (u) => u.xp >= 3000,
  },
  {
    id: "social_butterfly",
    title: "Social Butterfly",
    titleRu: "Социальная бабочка",
    description: "30+ миссий — ты знаешь пол-Bishkek",
    emoji: "🤝",
    rarity: "rare",
    gradient: ["#F472B6", "#EC4899"],
    condition: (u) => u.totalMissions >= 30,
  },
  {
    id: "summer_legend",
    title: "Summer Legend",
    titleRu: "Летняя легенда",
    description: "Level 5+ — ты легенда этого лета",
    emoji: "⚡",
    rarity: "legendary",
    gradient: ["#EC4899", "#F59E0B"],
    condition: (u) => u.level >= 5,
  },
  {
    id: "district_hero",
    title: "District Hero",
    titleRu: "Герой района",
    description: "7-дневный streak — район гордится тобой",
    emoji: "🏆",
    rarity: "epic",
    gradient: ["#10B981", "#06B6D4"],
    condition: (u) => u.streak >= 7,
  },
];

export const RARITY_LABELS: Record<Achievement["rarity"], string> = {
  common: "Обычная",
  rare: "Редкая",
  epic: "Эпическая",
  legendary: "Легендарная",
};

export const RARITY_GLOW: Record<Achievement["rarity"], string> = {
  common: "#94A3B8",
  rare: "#06B6D4",
  epic: "#8B5CF6",
  legendary: "#F59E0B",
};

export function getUnlockedAchievements(user: User): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.condition(user));
}

export function getNewlyUnlocked(user: User, previousIds: string[]): Achievement[] {
  return getUnlockedAchievements(user).filter((a) => !previousIds.includes(a.id));
}

export const AVATAR_PRESETS = [
  { seed: "nurlan", label: "Nurlan" },
  { seed: "aizada", label: "Aizada" },
  { seed: "bekzat", label: "Bekzat" },
  { seed: "dina", label: "Dina" },
  { seed: "erlan", label: "Erlan" },
  { seed: "gulnara", label: "Gulnara" },
  { seed: "asyl", label: "Asyl" },
  { seed: "janara", label: "Janara" },
];

export function avatarUrlFromSeed(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}
