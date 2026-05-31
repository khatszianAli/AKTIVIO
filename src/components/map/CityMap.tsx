"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import type { Challenge, LiveActivity, MissionCategory } from "@/lib/types";
import { BISHKEK_CENTER, MAP_DEFAULT_ZOOM } from "@/lib/constants/locations";
import { CATEGORIES } from "@/lib/constants/categories";
import "leaflet/dist/leaflet.css";

interface CityMapProps {
  challenges: Challenge[];
  liveActivities: LiveActivity[];
  filter: MissionCategory | "all";
  onSelectChallenge: (c: Challenge) => void;
  onSelectActivity: (a: LiveActivity) => void;
}

function createIcon(color: string, emoji: string, isLive?: boolean) {
  return L.divIcon({
    className: "aktivio-marker",
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: ${color}33;
        border: 2px solid ${color};
        border-radius: 50%;
        font-size: 18px;
        box-shadow: 0 0 16px ${color}66;
        ${isLive ? `animation: pulse-ring 2s infinite;` : ""}
      ">
        ${emoji}
        ${isLive ? `<span style="position:absolute;top:-2px;right:-2px;width:10px;height:10px;background:#ef4444;border-radius:50%;border:2px solid #0f172a;"></span>` : ""}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      map.setView(center, MAP_DEFAULT_ZOOM);
      initialized.current = true;
    }
  }, [map, center]);

  return null;
}

export function CityMap({
  challenges,
  liveActivities,
  filter,
  onSelectChallenge,
  onSelectActivity,
}: CityMapProps) {
  const filteredChallenges =
    filter === "all" ? challenges : challenges.filter((c) => c.category === filter);
  const filteredActivities =
    filter === "all" ? liveActivities : liveActivities.filter((a) => a.category === filter);

  const center: [number, number] = [BISHKEK_CENTER.lat, BISHKEK_CENTER.lng];

  return (
    <div className="relative w-full h-[52dvh] rounded-2xl overflow-hidden border border-slate-700/50 mx-auto">
      <MapContainer
        center={center}
        zoom={MAP_DEFAULT_ZOOM}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapController center={center} />

        {filteredChallenges.map((challenge) => {
          const cat = CATEGORIES[challenge.category];
          return (
            <Marker
              key={challenge.id}
              position={[challenge.coordinates.lat, challenge.coordinates.lng]}
              icon={createIcon(cat.color, cat.emoji, challenge.isLive)}
              eventHandlers={{ click: () => onSelectChallenge(challenge) }}
            >
              <Popup>
                <div className="text-slate-900 text-sm font-semibold">{challenge.title}</div>
              </Popup>
            </Marker>
          );
        })}

        {filteredActivities.map((activity) => {
          const cat = CATEGORIES[activity.category];
          return (
            <CircleMarker
              key={activity.id}
              center={[activity.coordinates.lat, activity.coordinates.lng]}
              radius={14}
              pathOptions={{
                color: cat.color,
                fillColor: cat.color,
                fillOpacity: 0.4,
                weight: 2,
              }}
              eventHandlers={{ click: () => onSelectActivity(activity) }}
            />
          );
        })}
      </MapContainer>

      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
          📍 Бишкек
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-[1000] flex gap-2">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-[10px] text-slate-400 border border-slate-700">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
          Челленджи
        </div>
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-[10px] text-slate-400 border border-slate-700">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-1 animate-pulse" />
          Live teams
        </div>
      </div>
    </div>
  );
}
