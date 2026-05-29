// Single-profile local persistence (no auth). Stores the player's name and earned stamps in
// AsyncStorage, hydrated on launch. Exposes setName / addStamp / wipeAll.

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const NAME_KEY = '@sakura/name';
const STAMPS_KEY = '@sakura/stamps';
export const DEFAULT_NAME = 'さくら';

export type Stamps = Record<string, boolean>;

interface ProfileContextValue {
  ready: boolean;
  name: string;
  stamps: Stamps;
  setName: (name: string) => void;
  addStamp: (id: string) => void;
  wipeAll: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [name, setNameState] = useState(DEFAULT_NAME);
  const [stamps, setStamps] = useState<Stamps>({});

  // Hydrate once on launch.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedName, storedStamps] = await Promise.all([
          AsyncStorage.getItem(NAME_KEY),
          AsyncStorage.getItem(STAMPS_KEY),
        ]);
        if (cancelled) return;
        if (storedName) setNameState(storedName);
        if (storedStamps) setStamps(JSON.parse(storedStamps) as Stamps);
      } catch {
        // ignore corrupt/missing storage — start fresh
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setName = useCallback((next: string) => {
    const trimmed = next.trim();
    if (!trimmed) return;
    setNameState(trimmed);
    AsyncStorage.setItem(NAME_KEY, trimmed).catch(() => {});
  }, []);

  const addStamp = useCallback((id: string) => {
    setStamps((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      AsyncStorage.setItem(STAMPS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const wipeAll = useCallback(() => {
    setNameState(DEFAULT_NAME);
    setStamps({});
    AsyncStorage.multiRemove([NAME_KEY, STAMPS_KEY]).catch(() => {});
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({ ready, name, stamps, setName, addStamp, wipeAll }),
    [ready, name, stamps, setName, addStamp, wipeAll]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
