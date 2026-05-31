import type { Coordinates, MissionCategory } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants/categories";
import { MapPin, Navigation } from "lucide-react";

interface PlaceCardProps {
  name: string;
  coordinates: Coordinates;
  category?: MissionCategory;
}

export function PlaceCard({ name, coordinates, category }: PlaceCardProps) {
  const color = category ? CATEGORIES[category].color : "#06B6D4";
  const mapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border p-3 transition-all active:scale-[0.98]"
      style={{
        backgroundColor: `${color}11`,
        borderColor: `${color}33`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}22` }}
      >
        <MapPin className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate" style={{ color }}>
          {name}
        </p>
        <p className="text-[10px] text-slate-500">
          {coordinates.lat.toFixed(3)}, {coordinates.lng.toFixed(3)} · Bishkek
        </p>
      </div>
      <Navigation className="w-4 h-4 text-slate-500 shrink-0" />
    </a>
  );
}
