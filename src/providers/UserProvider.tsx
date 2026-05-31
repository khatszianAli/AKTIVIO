"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/lib/types";
import { CURRENT_USER } from "@/lib/mock/users";

interface UserContextValue {
  user: User;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(CURRENT_USER);

  const addXp = useCallback((amount: number) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      totalMissions: prev.totalMissions + 1,
    }));
  }, []);

  const incrementStreak = useCallback(() => {
    setUser((prev) => ({ ...prev, streak: prev.streak + 1 }));
  }, []);

  return (
    <UserContext.Provider value={{ user, addXp, incrementStreak }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
