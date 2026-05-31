"use client";

import { useState, useCallback } from "react";
import type { Challenge, LiveActivity } from "@/lib/types";
import { MOCK_CHALLENGES, MOCK_LIVE_ACTIVITIES } from "@/lib/mock/challenges";

export function useMapActivities() {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [liveActivities] = useState<LiveActivity[]>(MOCK_LIVE_ACTIVITIES);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<LiveActivity | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const joinChallenge = useCallback((challengeId: string) => {
    setJoinedIds((prev) => new Set(prev).add(challengeId));
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId && c.participants < c.maxParticipants
          ? { ...c, participants: c.participants + 1 }
          : c
      )
    );
  }, []);

  const joinActivity = useCallback((activityId: string) => {
    setJoinedIds((prev) => new Set(prev).add(activityId));
  }, []);

  const isJoined = useCallback(
    (id: string) => joinedIds.has(id),
    [joinedIds]
  );

  return {
    challenges,
    liveActivities,
    selectedChallenge,
    selectedActivity,
    setSelectedChallenge,
    setSelectedActivity,
    joinChallenge,
    joinActivity,
    isJoined,
  };
}
