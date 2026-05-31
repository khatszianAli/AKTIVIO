import type { District } from "@/lib/types";

export interface DistrictConfig {
  id: District;
  name: string;
  nameRu: string;
  color: string;
  emoji: string;
}

export const DISTRICTS: Record<District, DistrictConfig> = {
  sverdlovsky: {
    id: "sverdlovsky",
    name: "Sverdlovsky",
    nameRu: "Свердловский",
    color: "#F59E0B",
    emoji: "🔥",
  },
  pervomaisky: {
    id: "pervomaisky",
    name: "Pervomaisky",
    nameRu: "Первомайский",
    color: "#EC4899",
    emoji: "⚡",
  },
  oktyabrsky: {
    id: "oktyabrsky",
    name: "Oktyabrsky",
    nameRu: "Октябрьский",
    color: "#8B5CF6",
    emoji: "🌊",
  },
  leninsky: {
    id: "leninsky",
    name: "Leninsky",
    nameRu: "Ленинский",
    color: "#10B981",
    emoji: "🏔️",
  },
};

export const DISTRICT_LIST = Object.values(DISTRICTS);
