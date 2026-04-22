import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";

interface CompletionsContextType {
  completionsVersion: number;
  notifyCompletionChange: () => void;
}

const CompletionsContext = createContext<CompletionsContextType | undefined>(
  undefined,
);

export function CompletionsProvider({ children }: { children: ReactNode }) {
  const [completionsVersion, setCompletionsVersion] = useState(0);

  const notifyCompletionChange = useCallback(() => {
    setCompletionsVersion((prev) => prev + 1);
  }, []);

  return (
    <CompletionsContext.Provider
      value={{ completionsVersion, notifyCompletionChange }}
    >
      {children}
    </CompletionsContext.Provider>
  );
}

export function useCompletions() {
  const context = useContext(CompletionsContext);
  if (context === undefined) {
    throw new Error("useCompletions must be used within a CompletionsProvider");
  }
  return context;
}
