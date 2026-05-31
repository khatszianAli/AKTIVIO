"use client";

import dynamic from "next/dynamic";
import type { Challenge, LiveActivity, MissionCategory } from "@/lib/types";

const CityMapInner = dynamic(
  () => import("@/components/map/CityMap").then((m) => m.CityMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[52dvh] rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Загружаем карту Бишкека...</p>
        </div>
      </div>
    ),
  }
);

interface MapRadarProps {
  challenges: Challenge[];
  liveActivities: LiveActivity[];
  filter: MissionCategory | "all";
  onSelectChallenge: (c: Challenge) => void;
  onSelectActivity: (a: LiveActivity) => void;
}

export function MapRadar(props: MapRadarProps) {
  return <CityMapInner {...props} />;
}
