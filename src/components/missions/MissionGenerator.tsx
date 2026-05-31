"use client";

import { useState, useEffect } from "react";
import type { Mission, MissionCategory, BudgetTier, TimeAvailable } from "@/lib/types";
import { BISHKEK_LOCATIONS } from "@/lib/constants/locations";
import { BUDGET_OPTIONS, TIME_OPTIONS, CATEGORY_LIST } from "@/lib/constants/categories";
import { generateMissionAsync, pickCategoryFromInterests } from "@/lib/services/missionGenerator";
import { verifyMissionEvidence } from "@/lib/services/xpService";
import { useUser } from "@/hooks/useUser";
import { usePublications } from "@/hooks/usePublications";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CATEGORIES } from "@/lib/constants/categories";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  Upload,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

export function MissionGenerator() {
  const { user, addXp } = useUser();
  const { addPublication } = usePublications();
  const defaultCategory = pickCategoryFromInterests(user.interests);

  const [location, setLocation] = useState(BISHKEK_LOCATIONS[0].nameRu);
  const [budget, setBudget] = useState<BudgetTier>("low");
  const [timeMinutes, setTimeMinutes] = useState<TimeAvailable>(30);
  const [category, setCategory] = useState<MissionCategory>(defaultCategory);
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);

  useEffect(() => {
    setCategory(pickCategoryFromInterests(user.interests));
  }, [user.interests]);

  const handleGenerate = async () => {
    setLoading(true);
    setMission(null);
    setVerificationResult(null);
    setVerified(null);
    setEvidencePreview(null);
    try {
      const generated = await generateMissionAsync({
        location,
        budget,
        timeMinutes,
        category,
        district: user.district,
        interests: user.interests,
      });
      setMission(generated);
    } catch {
      setVerificationResult("Ошибка генерации. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !mission) return;

    const previewUrl = URL.createObjectURL(file);
    setEvidencePreview(previewUrl);

    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyMissionEvidence(file, mission.verificationHint);
      setVerified(result.verified);
      setVerificationResult(result.message);
      if (result.verified) {
        addXp(result.xpEarned);
        addPublication({
          content: `✅ Миссия выполнена: «${mission.title}» на ${mission.location}! +${result.xpEarned} XP 🔥`,
          imageUrl: previewUrl,
          type: "mission_result",
          category: mission.category,
          placeName: mission.location,
          missionId: mission.id,
          missionTitle: mission.title,
          xpEarned: result.xpEarned,
        });
      }
    } catch {
      setVerificationResult("Ошибка верификации. Попробуй другое фото.");
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-safe-top pt-4 pb-4 space-y-4">
      <header>
        <p className="text-xs text-slate-500 uppercase tracking-widest">AI Engine</p>
        <h1 className="text-2xl font-black">Mission Generator ⚡</h1>
        <p className="text-sm text-slate-400 mt-1">
          Контекстные миссии под твой район, бюджет и интересы
        </p>
        {user.interests.length > 0 && (
          <p className="text-[10px] text-emerald-500/80 mt-1">
            AI учитывает: {user.interests.map((i) => CATEGORIES[i].labelRu).join(", ")}
          </p>
        )}
      </header>

      <Card className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5" /> Локация
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            {BISHKEK_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.nameRu}>
                {loc.nameRu} — {loc.vibe}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-2">
            <Wallet className="w-3.5 h-3.5" /> Бюджет
          </label>
          <div className="flex gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setBudget(opt.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  budget === opt.id
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-2">
            <Clock className="w-3.5 h-3.5" /> Время
          </label>
          <div className="flex gap-2">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeMinutes(opt.value)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  timeMinutes === opt.value
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Категория</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_LIST.map((cat) => {
              const isInterest = user.interests.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`relative flex items-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat.id
                      ? `${cat.bgClass} ${cat.borderClass} ${cat.textClass}`
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <CategoryIcon category={cat.id} size="sm" />
                  {cat.labelRu}
                  {isInterest && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Button variant="neon" fullWidth size="lg" onClick={handleGenerate} disabled={loading}>
          <Sparkles className="w-4 h-4" />
          {loading ? "AI генерирует..." : "Generate Mission 🎯"}
        </Button>
      </Card>

      {mission && (
        <Card glow={CATEGORIES[mission.category].color} className="space-y-3">
          <div className="flex items-center gap-2">
            <CategoryIcon category={mission.category} />
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${CATEGORIES[mission.category].color}22`,
                color: CATEGORIES[mission.category].color,
              }}
            >
              +{mission.xpReward} XP
            </span>
          </div>
          <h2 className="text-lg font-black">{mission.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{mission.description}</p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>📍 {mission.location}</p>
            <p>💡 {mission.tips.join(" · ")}</p>
          </div>

          <div className="pt-2 border-t border-slate-700/50">
            <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-600 text-sm text-slate-400 cursor-pointer hover:border-emerald-500 hover:text-emerald-400 transition-all">
              <Upload className="w-4 h-4" />
              {verifying ? "AI проверяет..." : "Загрузить доказательство → Публикации"}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleVerify}
                disabled={verifying}
              />
            </label>
          </div>

          {evidencePreview && (
            <img src={evidencePreview} alt="Evidence" className="w-full rounded-xl max-h-40 object-cover" />
          )}

          {verificationResult && (
            <div
              className={`flex items-center gap-2 text-sm font-semibold ${
                verified ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {verified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {verificationResult}
            </div>
          )}

          {verified && (
            <Link
              href="/publications"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-sm font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Смотреть в Публикациях
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
