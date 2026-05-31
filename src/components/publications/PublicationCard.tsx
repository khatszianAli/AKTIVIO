"use client";

import type { Publication } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants/categories";
import { REACTIONS } from "@/lib/constants/categories";
import type { PublicationReaction } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";
import { MapPin, Zap, CheckCircle2 } from "lucide-react";
import { PlaceCard } from "./PlaceCard";

interface PublicationCardProps {
  post: Publication;
  onReact: (postId: string, reaction: PublicationReaction) => void;
}

const TYPE_LABELS = {
  mission_result: { label: "Миссия", color: "#10B981" },
  place_tip: { label: "Место", color: "#06B6D4" },
  general: { label: "Пост", color: "#6366F1" },
};

export function PublicationCard({ post, onReact }: PublicationCardProps) {
  const typeMeta = TYPE_LABELS[post.type];

  return (
    <article
      className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4 space-y-3"
      style={{ boxShadow: post.type === "mission_result" ? "0 0 20px #10B98111" : undefined }}
    >
      <div className="flex items-center gap-3">
        <img
          src={post.author.avatar}
          alt={post.author.displayName}
          className="w-10 h-10 rounded-full border-2 border-slate-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100">{post.author.displayName}</p>
          <p className="text-[10px] text-slate-500">
            @{post.author.username} · {formatTimeAgo(post.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{
              backgroundColor: `${typeMeta.color}22`,
              color: typeMeta.color,
            }}
          >
            {typeMeta.label}
          </span>
          {post.category && (
            <span className="text-lg">{CATEGORIES[post.category].emoji}</span>
          )}
        </div>
      </div>

      {post.type === "mission_result" && post.missionTitle && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-2.5 py-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="font-semibold">{post.missionTitle}</span>
          {post.xpEarned && (
            <span className="ml-auto flex items-center gap-0.5 font-black">
              <Zap className="w-3 h-3 fill-emerald-400" />+{post.xpEarned} XP
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Publication media"
          className="w-full rounded-xl object-cover max-h-52"
        />
      )}

      {post.placeName && post.placeCoordinates && (
        <PlaceCard
          name={post.placeName}
          coordinates={post.placeCoordinates}
          category={post.category}
        />
      )}

      {post.placeName && !post.placeCoordinates && (
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 rounded-lg px-2.5 py-1.5 w-fit">
          <MapPin className="w-3.5 h-3.5" />
          {post.placeName}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {post.aiTags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {(Object.entries(REACTIONS) as [PublicationReaction, { label: string; emoji: string }][]).map(
          ([key, { label, emoji }]) => (
            <button
              key={key}
              onClick={() => onReact(post.id, key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
                post.userReaction === key
                  ? "border-pink-500 bg-pink-500/20 text-pink-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span>{emoji}</span>
              <span className="max-w-[80px] truncate">{label}</span>
              <span className="text-slate-500">{post.reactions[key]}</span>
            </button>
          )
        )}
      </div>
    </article>
  );
}
