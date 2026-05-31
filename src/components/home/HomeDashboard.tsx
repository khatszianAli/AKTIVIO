"use client";

import { useState } from "react";
import type { MissionCategory } from "@/lib/types";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { MapFilterBar } from "@/components/home/MapFilterBar";
import { MapRadar } from "@/components/map/MapRadar";
import { NearbyActivities } from "@/components/home/NearbyActivities";
import { DistrictWarMini } from "@/components/home/DistrictWarMini";
import { ActivitySheet } from "@/components/map/ActivitySheet";
import { useMapActivities } from "@/hooks/useMapActivities";
import { SalkynFloatingButton } from "@/components/ai-assistant/SalkynFloatingButton";
import { ChatAssistant } from "@/components/ai-assistant/ChatAssistant";

export function HomeDashboard() {
  const [filter, setFilter] = useState<MissionCategory | "all">("all");
  const [salkynOpen, setSalkynOpen] = useState(false);
  const {
    challenges,
    liveActivities,
    selectedChallenge,
    selectedActivity,
    setSelectedChallenge,
    setSelectedActivity,
    joinChallenge,
    joinActivity,
    isJoined,
  } = useMapActivities();

  const filteredChallenges =
    filter === "all" ? challenges : challenges.filter((c) => c.category === filter);

  const liveCount =
    challenges.filter((c) => c.isLive).length + liveActivities.length;

  const handleJoin = () => {
    if (selectedChallenge) {
      joinChallenge(selectedChallenge.id);
    } else if (selectedActivity) {
      joinActivity(selectedActivity.id);
    }
  };

  const handleClose = () => {
    setSelectedChallenge(null);
    setSelectedActivity(null);
  };

  const joinedId = selectedChallenge?.id ?? selectedActivity?.id ?? "";
  const joined = joinedId ? isJoined(joinedId) : false;

  return (
    <div className="max-w-lg mx-auto">
      <DashboardHeader />

      <div className="px-4">
        <MapFilterBar active={filter} onChange={setFilter} liveCount={liveCount} />
        <MapRadar
          challenges={filteredChallenges}
          liveActivities={liveActivities}
          filter={filter}
          onSelectChallenge={setSelectedChallenge}
          onSelectActivity={setSelectedActivity}
        />
      </div>

      <NearbyActivities
        challenges={filteredChallenges}
        onSelect={setSelectedChallenge}
      />

      <DistrictWarMini />

      {(selectedChallenge || selectedActivity) && (
        <ActivitySheet
          challenge={selectedChallenge}
          activity={selectedActivity}
          isJoined={joined}
          onJoin={handleJoin}
          onClose={handleClose}
        />
      )}

      <SalkynFloatingButton
        onClick={() => setSalkynOpen((v) => !v)}
        isOpen={salkynOpen}
      />

      <ChatAssistant
        isOpen={salkynOpen}
        onClose={() => setSalkynOpen(false)}
        liveChallenges={challenges}
        liveActivities={liveActivities}
      />
    </div>
  );
}
