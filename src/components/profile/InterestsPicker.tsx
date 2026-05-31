"use client";

import { useState } from "react";
import type { MissionCategory } from "@/lib/types";
import { CATEGORY_LIST } from "@/lib/constants/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

interface InterestsPickerProps {
  selected: MissionCategory[];
  onSave: (interests: MissionCategory[]) => void;
}

export function InterestsPicker({ selected, onSave }: InterestsPickerProps) {
  const [local, setLocal] = useState<MissionCategory[]>(selected);
  const [saved, setSaved] = useState(false);

  const toggle = (cat: MissionCategory) => {
    setLocal((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
    setSaved(false);
  };

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 leading-relaxed">
        AI Mission Generator будет чаще предлагать миссии из выбранных категорий
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORY_LIST.map((cat) => {
          const active = local.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className={`flex items-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
                active
                  ? `${cat.bgClass} ${cat.borderClass} ${cat.textClass}`
                  : "border-slate-700 text-slate-500 hover:border-slate-600"
              }`}
            >
              <CategoryIcon category={cat.id} size="sm" />
              {cat.labelRu}
            </button>
          );
        })}
      </div>
      <Button variant="secondary" fullWidth size="sm" onClick={handleSave}>
        <Sparkles className="w-3.5 h-3.5" />
        {saved ? "Сохранено ✓" : "Сохранить интересы"}
      </Button>
    </div>
  );
}
