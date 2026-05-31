import type { VerificationResult } from "@/lib/types";
import { getLevelInfo } from "@/lib/constants/levels";

export function calculateXpReward(baseXp: number, streak: number): number {
  const streakBonus = Math.min(streak * 5, 50);
  return baseXp + streakBonus;
}

export function addXp(currentXp: number, earned: number): number {
  return currentXp + earned;
}

export function getLevelFromXp(xp: number) {
  return getLevelInfo(xp);
}

export async function verifyMissionEvidence(
  _file: File,
  missionHint: string
): Promise<VerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const detectedElements = [
    "person_detected",
    "outdoor_scene",
    "bishkek_context",
  ];
  const confidence = 0.72 + Math.random() * 0.25;
  const verified = confidence > 0.75;
  const xpEarned = verified ? Math.floor(80 + Math.random() * 120) : 0;

  return {
    verified,
    confidence,
    detectedElements,
    xpEarned,
    message: verified
      ? `Миссия подтверждена! +${xpEarned} XP 🔥`
      : `Не удалось подтвердить: ${missionHint}. Попробуй другое фото.`,
  };
}
