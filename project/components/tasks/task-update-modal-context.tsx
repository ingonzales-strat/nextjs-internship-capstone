// UpdateTaskModalContext.tsx
"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { Task } from "@/types";

type UpdateTaskModalContextType = {
  //isOpen: boolean;
  //setIsOpen: (open: boolean) => void;
  taskToEdit: Task | null;
  setTaskToEdit: (task: Task | null) => void;
};

const UpdateTaskModalContext = createContext<UpdateTaskModalContextType | undefined>(undefined);

export function UpdateTaskModalProvider({ children }: { children: ReactNode }) {
  //const [isOpen, setIsOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  return (
    <UpdateTaskModalContext.Provider value={{  taskToEdit, setTaskToEdit }}>
      {children}
    </UpdateTaskModalContext.Provider>
  );
}

export function useUpdateTaskModal() {
  const ctx = useContext(UpdateTaskModalContext);
  if (!ctx) throw new Error("useUpdateTaskModal must be used inside UpdateTaskModalProvider");
  return ctx;
}
