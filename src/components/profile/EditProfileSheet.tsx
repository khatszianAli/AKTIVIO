"use client";

import { useState } from "react";
import type { ProfileUpdate } from "@/lib/types";
import { AVATAR_PRESETS, avatarUrlFromSeed } from "@/lib/constants/achievements";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface EditProfileSheetProps {
  displayName: string;
  username: string;
  bio: string;
  avatar: string;
  onSave: (update: ProfileUpdate) => void;
  onClose: () => void;
}

export function EditProfileSheet({
  displayName,
  username,
  bio,
  avatar,
  onSave,
  onClose,
}: EditProfileSheetProps) {
  const [name, setName] = useState(displayName);
  const [nick, setNick] = useState(username);
  const [bioText, setBioText] = useState(bio);
  const [avatarUrl, setAvatarUrl] = useState(avatar);

  const handleSave = () => {
    onSave({
      displayName: name.trim() || displayName,
      username: nick.trim().replace(/\s/g, "_") || username,
      bio: bioText.trim(),
      avatar: avatarUrl,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-24 animate-slide-up">
        <div className="rounded-3xl bg-slate-900 border border-slate-700 p-5 max-w-lg mx-auto space-y-4 max-h-[80dvh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Редактировать профиль</h2>
            <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full border-4 border-emerald-500/50 mx-auto mb-3"
            />
            <p className="text-[10px] text-slate-500 mb-2">Выбери аватар</p>
            <div className="flex flex-wrap justify-center gap-2">
              {AVATAR_PRESETS.map(({ seed }) => {
                const url = avatarUrlFromSeed(seed);
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`rounded-full border-2 transition-all ${
                      avatarUrl === url ? "border-emerald-400 scale-110" : "border-transparent opacity-70"
                    }`}
                  >
                    <img src={url} alt={seed} className="w-10 h-10 rounded-full" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Имя</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Никнейм</label>
              <input
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Био</label>
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Кто ты, что любишь, какой район..."
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
              <p className="text-[10px] text-slate-600 text-right mt-0.5">{bioText.length}/160</p>
            </div>
          </div>

          <Button variant="neon" fullWidth size="lg" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </>
  );
}
