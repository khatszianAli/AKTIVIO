import type { User, MissionCategory, ProfileUpdate } from "@/lib/types";
import { getLevelInfo } from "@/lib/constants/levels";
import { getNewlyUnlocked } from "@/lib/constants/achievements";

export const CURRENT_USER: User = {
  id: "user-001",
  username: "nurlan_aktiv",
  displayName: "Nurlan K.",
  bio: "Дзержинка native 🏃 Люблю Legenda Sprint и ночные забеги. Ищу команду на District War!",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nurlan",
  district: "sverdlovsky",
  interests: ["sport", "social"],
  level: 3,
  xp: 2840,
  xpToNextLevel: 660,
  totalMissions: 47,
  streak: 5,
  unlockedAchievements: ["first_challenge", "summer_survivor", "king_dzerzhinka", "mountain_soul"],
  isOnline: true,
};

function withDefaults(partial: Omit<User, "bio" | "interests" | "unlockedAchievements"> & Partial<Pick<User, "bio" | "interests" | "unlockedAchievements">>): User {
  return {
    bio: "",
    interests: ["sport"],
    unlockedAchievements: ["first_challenge"],
    ...partial,
  };
}

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  withDefaults({
    id: "user-002",
    username: "aizada_vibe",
    displayName: "Aizada",
    bio: "Летний вайб only ☀️ Pervomaisky represent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aizada",
    district: "pervomaisky",
    interests: ["sport", "nature"],
    level: 4,
    xp: 5200,
    xpToNextLevel: 1800,
    totalMissions: 89,
    streak: 12,
    unlockedAchievements: ["first_challenge", "summer_survivor", "social_butterfly"],
    isOnline: true,
  }),
  withDefaults({
    id: "user-003",
    username: "bekzat_run",
    displayName: "Bekzat",
    bio: "Run or die 💨",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bekzat",
    district: "oktyabrsky",
    interests: ["sport"],
    level: 2,
    xp: 980,
    xpToNextLevel: 520,
    totalMissions: 23,
    streak: 3,
    isOnline: true,
  }),
  withDefaults({
    id: "user-004",
    username: "dina_creative",
    displayName: "Dina",
    bio: "Chalk-art queen 🎨 DM for collabs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dina",
    district: "leninsky",
    interests: ["creative", "social"],
    level: 5,
    xp: 8900,
    xpToNextLevel: 3100,
    totalMissions: 134,
    streak: 21,
    unlockedAchievements: ["first_challenge", "street_artist", "summer_legend", "district_hero"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000).toISOString(),
  }),
  withDefaults({
    id: "user-005",
    username: "erlan_skate",
    displayName: "Erlan",
    bio: "Skate · Магистраль · always outside",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=erlan",
    district: "sverdlovsky",
    interests: ["sport", "creative"],
    level: 2,
    xp: 1100,
    xpToNextLevel: 400,
    totalMissions: 31,
    streak: 7,
    unlockedAchievements: ["first_challenge", "district_hero"],
    isOnline: true,
  }),
  withDefaults({
    id: "user-006",
    username: "gulnara_nature",
    displayName: "Gulnara",
    bio: "Горы > всё 🏔️",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gulnara",
    district: "oktyabrsky",
    interests: ["nature", "social"],
    level: 3,
    xp: 3100,
    xpToNextLevel: 400,
    totalMissions: 56,
    streak: 4,
    unlockedAchievements: ["first_challenge", "mountain_soul"],
    isOnline: true,
  }),
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function syncUserLevel(user: User): User {
  const levelInfo = getLevelInfo(user.xp);
  const nextLevel = levelInfo.level < 6 ? levelInfo.maxXp - user.xp : 0;
  const newlyUnlocked = getNewlyUnlocked(user, user.unlockedAchievements);
  const achievementIds = [
    ...user.unlockedAchievements,
    ...newlyUnlocked.map((a) => a.id),
  ];
  return {
    ...user,
    level: levelInfo.level,
    xpToNextLevel: Math.max(0, nextLevel),
    unlockedAchievements: [...new Set(achievementIds)],
  };
}

export function applyProfileUpdate(user: User, update: ProfileUpdate): User {
  return syncUserLevel({
    ...user,
    ...update,
  });
}

export function applyInterestsUpdate(user: User, interests: MissionCategory[]): User {
  if (interests.length === 0) return user;
  return syncUserLevel({ ...user, interests });
}
