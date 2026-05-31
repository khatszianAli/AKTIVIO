import { CATEGORIES } from "@/lib/constants/categories";
import type { MissionCategory } from "@/lib/types";

interface CategoryIconProps {
  category: MissionCategory;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

export function CategoryIcon({ category, size = "md" }: CategoryIconProps) {
  const config = CATEGORIES[category];
  return (
    <span className={sizeMap[size]} role="img" aria-label={config.labelRu}>
      {config.emoji}
    </span>
  );
}

export function getCategoryColor(category: MissionCategory): string {
  return CATEGORIES[category].color;
}
