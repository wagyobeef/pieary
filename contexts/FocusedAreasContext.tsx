import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAreas } from "./AreasContext";

const STORAGE_KEY = "focusedAreaIds";

interface FocusedAreasContextType {
  isAreaFocused: (areaId: number) => boolean;
  toggleArea: (areaId: number) => void;
}

const FocusedAreasContext = createContext<FocusedAreasContextType | undefined>(undefined);

export function FocusedAreasProvider({ children }: { children: ReactNode }) {
  const { areas } = useAreas();
  // null = not yet loaded from storage; default to all focused until then
  const [focusedIds, setFocusedIds] = useState<Set<number> | null>(null);

  useEffect(() => {
    if (areas.length === 0) return;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === null) {
        setFocusedIds(new Set(areas.map((a) => a.id)));
      } else {
        setFocusedIds(new Set(JSON.parse(stored) as number[]));
      }
    });
  }, [areas]);

  const isAreaFocused = (areaId: number) =>
    focusedIds === null ? true : focusedIds.has(areaId);

  const toggleArea = (areaId: number) => {
    setFocusedIds((prev) => {
      const base = prev ?? new Set(areas.map((a) => a.id));
      const next = new Set(base);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <FocusedAreasContext.Provider value={{ isAreaFocused, toggleArea }}>
      {children}
    </FocusedAreasContext.Provider>
  );
}

export function useFocusedAreas() {
  const context = useContext(FocusedAreasContext);
  if (context === undefined) {
    throw new Error("useFocusedAreas must be used within a FocusedAreasProvider");
  }
  return context;
}
