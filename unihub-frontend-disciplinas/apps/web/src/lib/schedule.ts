// Visão "aulas do dia" e aviso de avaliação — funções puras.
import type { AttendanceStats, AttendanceStatus, ClassSession, Reminder, Subject } from "@/types";
import { daysUntil, formatShortDate, toISODate } from "./calendar";

const pad = (n: number) => String(n).padStart(2, "0");

export function buildSessionsForDate(
  subjects: Subject[],
  stats: Record<string, AttendanceStats>,
  statusOf: (subjectId: string, date: string) => AttendanceStatus | undefined,
  date: Date,
): ClassSession[] {
  const iso = toISODate(date);
  return subjects
    .filter((s) => s.weekdays.includes(date.getDay()))
    .map((s) => ({
      id: `${s.id}:${iso}`,
      subjectId: s.id,
      date: iso,
      name: s.name,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
      teacher: s.teacher,
      situation: stats[s.id].situation,
      remaining: stats[s.id].remaining,
      status: statusOf(s.id, iso),
    }))
    .sort((a, b) => a.startTime.localeCompare(b.startTime) || a.name.localeCompare(b.name));
}

export type SessionPhase = "ongoing" | "upcoming" | "pending";

/**
 * Aula em destaque:
 * 1) a que está acontecendo agora; 2) a próxima do dia;
 * 3) se o dia acabou, a primeira ainda sem registro de presença; 4) nenhuma.
 */
export function pickFeatured(
  sessions: ClassSession[],
  now: Date,
): { session: ClassSession; phase: SessionPhase } | null {
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const ongoing = sessions.find((s) => s.startTime <= hhmm && hhmm < s.endTime);
  if (ongoing) return { session: ongoing, phase: "ongoing" };

  const upcoming = sessions.find((s) => s.startTime > hhmm);
  if (upcoming) return { session: upcoming, phase: "upcoming" };

  const pending = sessions.find((s) => !s.status);
  if (pending) return { session: pending, phase: "pending" };

  return null;
}

export interface AssessmentNotice {
  id: string;
  title: string;
  detail: string;
}

/** Próxima prova/trabalho a partir de hoje. */
export function getNextAssessment(
  reminders: Reminder[],
  subjects: Subject[],
  now: Date,
): AssessmentNotice | null {
  const todayISO = toISODate(now);
  const next = reminders
    .filter((r) => (r.kind === "exam" || r.kind === "assignment") && r.date >= todayISO)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""))[0];
  if (!next) return null;

  const days = daysUntil(next.date, now);
  const when = days === 0 ? "hoje" : days === 1 ? "amanhã" : `em ${days} dias`;
  const room = subjects.find((s) => s.id === next.subjectId)?.room;

  return {
    id: next.id,
    title: `${next.title} ${when}`,
    detail: [formatShortDate(next.date), next.time, room].filter(Boolean).join(" · "),
  };
}
