"use client";

import { useCallback } from "react";
import type { NewReminderInput, Reminder } from "@/types";
import { buildDemoReminder, DEMO_REMINDER_ID } from "@/data/demo";
import { usePersistentState } from "./usePersistentState";

export function useReminders(scope: string) {
  const [reminders, setReminders, hydrated] = usePersistentState<Reminder[]>(
    `unihub:${scope}:reminders`,
    [],
  );

  const addReminder = useCallback(
    (input: NewReminderInput) => {
      setReminders((prev) => [...prev, { ...input, id: crypto.randomUUID() }]);
    },
    [setReminders],
  );

  const removeReminder = useCallback(
    (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id)),
    [setReminders],
  );

  /** Quando a disciplina é excluída, o lembrete continua, só perde o vínculo. */
  const unlinkSubject = useCallback(
    (subjectId: string) =>
      setReminders((prev) =>
        prev.map((r) => (r.subjectId === subjectId ? { ...r, subjectId: undefined } : r)),
      ),
    [setReminders],
  );

  const loadDemoReminder = useCallback(
    (from: Date) =>
      setReminders((prev) =>
        prev.some((r) => r.id === DEMO_REMINDER_ID) ? prev : [...prev, buildDemoReminder(from)],
      ),
    [setReminders],
  );

  return { reminders, hydrated, addReminder, removeReminder, unlinkSubject, loadDemoReminder };
}
