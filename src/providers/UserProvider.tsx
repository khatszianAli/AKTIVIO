"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  User,
  ProfileUpdate,
  MissionCategory,
} from "@/lib/types";
import {
  CURRENT_USER,
  applyProfileUpdate,
  applyInterestsUpdate,
  syncUserLevel,
} from "@/lib/mock/users";

interface UserContextValue {
  user: User;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  updateProfile: (update: ProfileUpdate) => void;
  updateInterests: (interests: MissionCategory[]) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(syncUserLevel(CURRENT_USER));

  const addXp = useCallback((amount: number) => {
    setUser((prev) =>
      syncUserLevel({
        ...prev,
        xp: prev.xp + amount,
        totalMissions: prev.totalMissions + 1,
      })
    );
  }, []);

  const incrementStreak = useCallback(() => {
    setUser((prev) => syncUserLevel({ ...prev, streak: prev.streak + 1 }));
  }, []);

  const updateProfile = useCallback((update: ProfileUpdate) => {
    setUser((prev) => applyProfileUpdate(prev, update));
  }, []);

  const updateInterests = useCallback((interests: MissionCategory[]) => {
    setUser((prev) => applyInterestsUpdate(prev, interests));
  }, []);

  return (
    <UserContext.Provider
      value={{ user, addXp, incrementStreak, updateProfile, updateInterests }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
