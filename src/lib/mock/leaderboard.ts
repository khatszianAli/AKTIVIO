import type { DistrictStats, LeaderboardEntry } from "@/lib/types";
import { MOCK_USERS } from "./users";

export const MOCK_DISTRICT_STATS: DistrictStats[] = [
  {
    district: "sverdlovsky",
    totalXp: 48200,
    activeUsers: 234,
    weeklyWins: 3,
    rank: 1,
    trend: "up",
  },
  {
    district: "leninsky",
    totalXp: 45100,
    activeUsers: 198,
    weeklyWins: 2,
    rank: 2,
    trend: "up",
  },
  {
    district: "pervomaisky",
    totalXp: 42800,
    activeUsers: 176,
    weeklyWins: 1,
    rank: 3,
    trend: "stable",
  },
  {
    district: "oktyabrsky",
    totalXp: 38900,
    activeUsers: 152,
    weeklyWins: 0,
    rank: 4,
    trend: "down",
  },
];

export const MOCK_CITY_LEADERBOARD: LeaderboardEntry[] = MOCK_USERS.map((user, i) => ({
  rank: i + 1,
  user,
  weeklyXp: [890, 720, 540, 480, 390, 310][i] ?? 200,
  missionsCompleted: [18, 14, 11, 9, 8, 6][i] ?? 5,
})).sort((a, b) => b.weeklyXp - a.weeklyXp).map((entry, i) => ({ ...entry, rank: i + 1 }));

export const MOCK_FRIENDS_LEADERBOARD: LeaderboardEntry[] = MOCK_CITY_LEADERBOARD.slice(0, 4);
