import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface StudentMarksEntry { cie1: string; cie2: string; cie3: string; cie4: string; see1: string; }

interface MarksContextType {
  marksData: Record<number, Record<number, StudentMarksEntry>>;
  getStudentMarks: (classId: number, studentId: number) => StudentMarksEntry;
  updateStudentMark: (classId: number, studentId: number, field: keyof StudentMarksEntry, value: string) => void;
  saveMarks: (classId: number, className: string) => void;
}

const MarksContext = createContext<MarksContextType | null>(null);

export function MarksProvider({ children }: { children: ReactNode }) {
  const [marksData, setMarksData] = useState<Record<number, Record<number, StudentMarksEntry>>>({});

  const getStudentMarks = (classId: number, studentId: number): StudentMarksEntry =>
    marksData[classId]?.[studentId] ?? { cie1: "", cie2: "", cie3: "", cie4: "", see1: "" };

  const updateStudentMark = (classId: number, studentId: number, field: keyof StudentMarksEntry, value: string) => {
    const clamped = value === "" ? "" : String(Math.min(100, Math.max(0, Number(value))));
    setMarksData((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [studentId]: { ...getStudentMarks(classId, studentId), [field]: clamped },
      },
    }));
  };

  const saveMarks = (classId: number, className: string) => {
    toast.success(`Marks saved for ${className}`);
  };

  return (
    <MarksContext.Provider value={{ marksData, getStudentMarks, updateStudentMark, saveMarks }}>
      {children}
    </MarksContext.Provider>
  );
}

export function useMarks() {
  const ctx = useContext(MarksContext);
  if (!ctx) throw new Error("useMarks must be used within MarksProvider");
  return ctx;
}
