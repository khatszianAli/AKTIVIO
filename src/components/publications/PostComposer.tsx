"use client";

import { useState, useRef } from "react";
import type { MissionCategory } from "@/lib/types";
import { BISHKEK_LOCATIONS } from "@/lib/constants/locations";
import { CATEGORY_LIST } from "@/lib/constants/categories";
import { usePublications } from "@/hooks/usePublications";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ImagePlus, MapPin, Send, X } from "lucide-react";

export function PostComposer() {
  const { addPublication } = usePublications();
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [category, setCategory] = useState<MissionCategory | "">("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      addPublication({
        content: content.trim(),
        imageUrl: imagePreview ?? undefined,
        type: placeName ? "place_tip" : "general",
        category: category || undefined,
        placeName: placeName || undefined,
      });
      setContent("");
      setPlaceName("");
      setCategory("");
      setImagePreview(null);
      setExpanded(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full text-left rounded-2xl bg-slate-800/80 border border-slate-700/50 px-4 py-3.5 text-sm text-slate-500 hover:border-emerald-500/40 transition-all"
      >
        Что нового в Бишкеке? Напиши, прикрепи фото, отметь место...
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-800/80 border border-emerald-500/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Новая публикация</p>
        <button
          onClick={() => setExpanded(false)}
          className="p-1 rounded-full text-slate-500 hover:text-slate-300"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Нашёл топчик, выполнил миссию, делюсь вайбом..."
        rows={3}
        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
      />

      <div>
        <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 mb-1.5">
          <MapPin className="w-3 h-3" /> Место (опционально)
        </label>
        <select
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="">— без места —</option>
          {BISHKEK_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.nameRu}>
              {loc.nameRu}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(category === cat.id ? "" : cat.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all ${
              category === cat.id
                ? `${cat.bgClass} ${cat.borderClass} ${cat.textClass}`
                : "border-slate-700 text-slate-500"
            }`}
          >
            <CategoryIcon category={cat.id} size="sm" />
            {cat.labelRu}
          </button>
        ))}
      </div>

      {imagePreview && (
        <div className="relative">
          <img src={imagePreview} alt="Preview" className="w-full rounded-xl max-h-40 object-cover" />
          <button
            onClick={() => setImagePreview(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:border-slate-600"
        >
          <ImagePlus className="w-4 h-4" />
          Фото/видео
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleImage}
        />
        <Button
          variant="neon"
          size="sm"
          className="ml-auto"
          onClick={handleSubmit}
          disabled={!content.trim() || submitting}
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? "..." : "Опубликовать"}
        </Button>
      </div>
    </div>
  );
}
