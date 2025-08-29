// TaskSheetContext.tsx
"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { Task } from "@/types";

type SheetContextType = {
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  return (
    <SheetContext.Provider value={{ activeTask, setActiveTask }}>
      {children}
    </SheetContext.Provider>
  );
}

export function useTaskSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useTaskSheet must be used inside SheetProvider");
  return ctx;
}
