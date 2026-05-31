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
  bio: string;
  avatar: string;
  district: District;
  interests: MissionCategory[];
  level: UserLevel;
  xp: number;
  xpToNextLevel: number;
  totalMissions: number;
  streak: number;
  unlockedAchievements: string[];
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

export type PublicationReaction = "cringe_legend" | "summer_vibe" | "powerful";

export type PublicationType = "mission_result" | "place_tip" | "general";

export interface Publication {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  type: PublicationType;
  category?: MissionCategory;
  placeName?: string;
  placeCoordinates?: Coordinates;
  missionId?: string;
  missionTitle?: string;
  xpEarned?: number;
  reactions: Record<PublicationReaction, number>;
  userReaction?: PublicationReaction;
  aiTags: string[];
  createdAt: string;
}

/** @deprecated Use Publication */
export type ThreadReaction = PublicationReaction;
/** @deprecated Use Publication */
export type ThreadPost = Publication;

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

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  emoji: string;
  rarity: AchievementRarity;
  gradient: [string, string];
  condition: (user: User) => boolean;
}

export interface ProfileUpdate {
  displayName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface CreatePublicationInput {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  type?: PublicationType;
  category?: MissionCategory;
  placeName?: string;
  placeCoordinates?: Coordinates;
  missionId?: string;
  missionTitle?: string;
  xpEarned?: number;
}
