"use client";

import { useState } from "react";
import type { ThreadPost, ThreadReaction } from "@/lib/types";
import { MOCK_THREADS } from "@/lib/mock/threads";
import { REACTIONS } from "@/lib/constants/categories";
import { CATEGORIES } from "@/lib/constants/categories";
import { formatTimeAgo } from "@/lib/utils";
import { MapPin } from "lucide-react";

export function ThreadsFeed() {
  const [posts, setPosts] = useState<ThreadPost[]>(MOCK_THREADS);

  const handleReaction = (postId: string, reaction: ThreadReaction) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const prevReaction = post.userReaction;
        const reactions = { ...post.reactions };
        if (prevReaction) reactions[prevReaction] = Math.max(0, reactions[prevReaction] - 1);
        if (prevReaction !== reaction) {
          reactions[reaction] = reactions[reaction] + 1;
          return { ...post, reactions, userReaction: reaction };
        }
        return { ...post, reactions, userReaction: undefined };
      })
    );
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-safe-top pt-4 pb-4 space-y-4">
      <header>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Live Feed</p>
        <h1 className="text-2xl font-black">Vibe Threads 💬</h1>
        <p className="text-sm text-slate-400 mt-1">
          Кто что сделал, где нашёл топчик, и летний вайб Бишкека
        </p>
      </header>

      <div className="space-y-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4 space-y-3"
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
              {post.category && (
                <span className="text-lg">{CATEGORIES[post.category].emoji}</span>
              )}
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post evidence"
                className="w-full rounded-xl object-cover max-h-48"
              />
            )}

            {post.placeName && (
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

            <div className="flex gap-2 pt-1">
              {(Object.entries(REACTIONS) as [ThreadReaction, { label: string; emoji: string }][]).map(
                ([key, { label, emoji }]) => (
                  <button
                    key={key}
                    onClick={() => handleReaction(post.id, key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
                      post.userReaction === key
                        ? "border-pink-500 bg-pink-500/20 text-pink-300"
                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="hidden sm:inline">{label}</span>
                    <span className="text-slate-500">{post.reactions[key]}</span>
                  </button>
                )
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
