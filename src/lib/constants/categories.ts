import type { MissionCategory, BudgetTier, TimeAvailable } from "@/lib/types";

export interface CategoryConfig {
  id: MissionCategory;
  label: string;
  labelRu: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  emoji: string;
}

export const CATEGORIES: Record<MissionCategory, CategoryConfig> = {
  sport: {
    id: "sport",
    label: "Sport",
    labelRu: "Спорт",
    color: "#10B981",
    bgClass: "bg-emerald-500/20",
    borderClass: "border-emerald-500/50",
    textClass: "text-emerald-400",
    emoji: "⚽",
  },
  creative: {
    id: "creative",
    label: "Creative",
    labelRu: "Креатив",
    color: "#6366F1",
    bgClass: "bg-indigo-500/20",
    borderClass: "border-indigo-500/50",
    textClass: "text-indigo-400",
    emoji: "🎨",
  },
  nature: {
    id: "nature",
    label: "Nature",
    labelRu: "Природа",
    color: "#06B6D4",
    bgClass: "bg-cyan-500/20",
    borderClass: "border-cyan-500/50",
    textClass: "text-cyan-400",
    emoji: "🏔️",
  },
  social: {
    id: "social",
    label: "Social",
    labelRu: "Социал",
    color: "#F472B6",
    bgClass: "bg-pink-500/20",
    borderClass: "border-pink-500/50",
    textClass: "text-pink-400",
    emoji: "🤝",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const BUDGET_OPTIONS: { id: BudgetTier; label: string; maxKgs: number }[] = [
  { id: "free", label: "0 KGS — бесплатно", maxKgs: 0 },
  { id: "low", label: "до 100 KGS", maxKgs: 100 },
  { id: "medium", label: "до 500 KGS", maxKgs: 500 },
];

export const TIME_OPTIONS: { value: TimeAvailable; label: string }[] = [
  { value: 15, label: "15 мин" },
  { value: 30, label: "30 мин" },
  { value: 60, label: "1 час" },
];

export const REACTIONS = {
  cringe_legend: { label: "Кринж, но легендарно", emoji: "😬🔥" },
  summer_vibe: { label: "Летний вайб", emoji: "☀️✨" },
  powerful: { label: "Мощно", emoji: "💪🔥" },
} as const;
