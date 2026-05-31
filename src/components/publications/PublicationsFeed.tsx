"use client";

import { usePublications } from "@/hooks/usePublications";
import { PostComposer } from "./PostComposer";
import { PublicationCard } from "./PublicationCard";

export function PublicationsFeed() {
  const { publications, reactToPublication } = usePublications();

  return (
    <div className="max-w-lg mx-auto px-4 pt-safe-top pt-4 pb-4 space-y-4">
      <header>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Live Feed</p>
        <h1 className="text-2xl font-black">Публикации 📣</h1>
        <p className="text-sm text-slate-400 mt-1">
          Результаты миссий, топовые места и летний вайб Бишкека — от реальных людей
        </p>
      </header>

      <PostComposer />

      <div className="space-y-3">
        {publications.map((post) => (
          <PublicationCard
            key={post.id}
            post={post}
            onReact={reactToPublication}
          />
        ))}
      </div>
    </div>
  );
}
