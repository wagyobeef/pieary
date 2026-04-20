import { Area, getAreas } from "@/db/areas";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AreasContextType {
  areas: Area[];
  refreshAreas: () => void;
  isLoading: boolean;
}

const AreasContext = createContext<AreasContextType | undefined>(undefined);

export function AreasProvider({ children }: { children: ReactNode }) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAreas = () => {
    try {
      console.log('Fetching areas from database...');
      const fetchedAreas = getAreas();
      console.log('Fetched areas:', fetchedAreas);
      setAreas(fetchedAreas);
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAreas();
  }, []);

  return (
    <AreasContext.Provider value={{ areas, refreshAreas, isLoading }}>
      {children}
    </AreasContext.Provider>
  );
}

export function useAreas() {
  const context = useContext(AreasContext);
  if (context === undefined) {
    throw new Error("useAreas must be used within an AreasProvider");
  }
  return context;
}
