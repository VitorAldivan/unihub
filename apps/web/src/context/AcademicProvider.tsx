"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type {
  AttendanceStats,
  AttendanceStatus,
  NewReminderInput,
  NewSubjectInput,
  Reminder,
  Subject,
} from "@/types";
import { useReminders } from "@/hooks/useReminders";
import { useSubjects } from "@/hooks/useSubjects";
import { useCurrentUser } from "./SessionContext";

interface AcademicValue {
  /** Disciplinas do semestre selecionado. */
  subjects: Subject[];
  hasAnySubjects: boolean;
  semester: string;
  semesters: string[];
  setSemester: (semester: string) => void;
  reminders: Reminder[];
  /** Estatísticas de TODAS as disciplinas, por id. */
  stats: Record<string, AttendanceStats>;
  /** Frequência média geral do semestre selecionado (null se não houver dado). */
  overallFrequency: number | null;
  getAttendanceStatus: (subjectId: string, date: string) => AttendanceStatus | undefined;
  markAttendance: (subjectId: string, date: string, status: AttendanceStatus) => void;
  addSubject: (input: NewSubjectInput) => void;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, input: NewSubjectInput) => void;
  addReminder: (input: NewReminderInput) => void;
  removeReminder: (id: string) => void;
  loadDemoData: () => void;
}

const AcademicContext = createContext<AcademicValue | null>(null);

/** Estado acadêmico compartilhado entre todas as telas, isolado por usuário. */
export function AcademicProvider({ children }: { children: ReactNode }) {
  const { user } = useCurrentUser();
  const s = useSubjects(user.email);
  const r = useReminders(user.email);

  const { removeSubject: removeSubjectOnly } = s;
  const { unlinkSubject } = r;
  const removeSubject = useCallback(
    (id: string) => {
      removeSubjectOnly(id);
      unlinkSubject(id);
    },
    [removeSubjectOnly, unlinkSubject],
  );

  const { loadDemoData: loadDemoSubjects } = s;
  const { loadDemoReminder } = r;
  const loadDemoData = useCallback(() => {
    loadDemoSubjects();
    loadDemoReminder(new Date());
  }, [loadDemoSubjects, loadDemoReminder]);

  const value = useMemo<AcademicValue>(
    () => ({
      subjects: s.subjects,
      hasAnySubjects: s.hasAnySubjects,
      semester: s.semester,
      semesters: s.semesters,
      setSemester: s.setSemester,
      reminders: r.reminders,
      stats: s.stats,
      overallFrequency: s.overallFrequency,
      getAttendanceStatus: s.getAttendanceStatus,
      markAttendance: s.markAttendance,
      addSubject: s.addSubject,
      removeSubject,
      updateSubject: s.updateSubject,
      addReminder: r.addReminder,
      removeReminder: r.removeReminder,
      loadDemoData,
    }),
    [s, r, removeSubject, loadDemoData],
  );

  if (!s.hydrated || !r.hydrated) return null;
  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
}

export function useAcademic(): AcademicValue {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error("useAcademic deve ser usado dentro de <AcademicProvider>");
  return ctx;
}
