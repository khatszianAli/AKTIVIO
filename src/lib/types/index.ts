export type District =
  | "sverdlovsky"
  | "pervomaisky"
  | "oktyabrsky"
  | "leninsky";

export type MissionCategory = "sport" | "creative" | "nature" | "social";

export type BudgetTier = "free" | "low" | "medium";

export type TimeAvailable = 15 | 30 | 60;

export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  district: District;
  level: UserLevel;
  xp: number;
  xpToNextLevel: number;
  totalMissions: number;
  streak: number;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  xpReward: number;
  coordinates: Coordinates;
  locationName: string;
  district: District;
  budget: BudgetTier;
  timeMinutes: TimeAvailable;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  expiresAt: string;
  hostId: string;
}

export interface LiveActivity {
  id: string;
  title: string;
  category: MissionCategory;
  coordinates: Coordinates;
  locationName: string;
  district: District;
  participants: User[];
  maxParticipants: number;
  startedAt: string;
  xpReward: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  location: string;
  district: District;
  budget: BudgetTier;
  timeMinutes: TimeAvailable;
  xpReward: number;
  tips: string[];
  verificationHint: string;
}

export type ThreadReaction = "cringe_legend" | "summer_vibe" | "powerful";

export interface ThreadPost {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  category?: MissionCategory;
  placeName?: string;
  placeCoordinates?: Coordinates;
  challengeId?: string;
  reactions: Record<ThreadReaction, number>;
  userReaction?: ThreadReaction;
  aiTags: string[];
  createdAt: string;
}

export interface DistrictStats {
  district: District;
  totalXp: number;
  activeUsers: number;
  weeklyWins: number;
  rank: number;
  trend: "up" | "down" | "stable";
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  weeklyXp: number;
  missionsCompleted: number;
}

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  detectedElements: string[];
  xpEarned: number;
  message: string;
}

export interface LevelInfo {
  level: UserLevel;
  title: string;
  minXp: number;
  maxXp: number;
  color: string;
}
