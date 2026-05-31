"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Publication,
  PublicationReaction,
  CreatePublicationInput,
} from "@/lib/types";
import { MOCK_PUBLICATIONS } from "@/lib/mock/publications";
import { buildPublication } from "@/lib/services/publicationService";
import { useUserContext } from "@/providers/UserProvider";

interface PublicationsContextValue {
  publications: Publication[];
  addPublication: (input: CreatePublicationInput) => Publication;
  reactToPublication: (postId: string, reaction: PublicationReaction) => void;
}

const PublicationsContext = createContext<PublicationsContextValue | null>(null);

export function PublicationsProvider({ children }: { children: ReactNode }) {
  const { user } = useUserContext();
  const [publications, setPublications] = useState<Publication[]>(MOCK_PUBLICATIONS);

  const addPublication = useCallback(
    (input: CreatePublicationInput): Publication => {
      const post = buildPublication(user, input);
      setPublications((prev) => [post, ...prev]);
      return post;
    },
    [user]
  );

  const reactToPublication = useCallback(
    (postId: string, reaction: PublicationReaction) => {
      setPublications((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          const prevReaction = post.userReaction;
          const reactions = { ...post.reactions };
          if (prevReaction) {
            reactions[prevReaction] = Math.max(0, reactions[prevReaction] - 1);
          }
          if (prevReaction !== reaction) {
            reactions[reaction] = reactions[reaction] + 1;
            return { ...post, reactions, userReaction: reaction };
          }
          return { ...post, reactions, userReaction: undefined };
        })
      );
    },
    []
  );

  return (
    <PublicationsContext.Provider
      value={{ publications, addPublication, reactToPublication }}
    >
      {children}
    </PublicationsContext.Provider>
  );
}

export function usePublications() {
  const ctx = useContext(PublicationsContext);
  if (!ctx) throw new Error("usePublications must be used within PublicationsProvider");
  return ctx;
}
