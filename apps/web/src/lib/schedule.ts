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
  const result: ClassSession[] = [];

  for (const s of subjects) {
    if (!s.weekdays.includes(date.getDay())) continue;

    // Detecta se é um bloco duplo (duração de aproximadamente 4 horas, ex: 08:00 às 12:00 ou 14:00 às 18:00)
    const isDoubleBlock = (() => {
      if (!s.startTime || !s.endTime) return false;
      const [sh, sm] = s.startTime.split(":").map(Number);
      const [eh, em] = s.endTime.split(":").map(Number);
      const diffMin = eh * 60 + em - (sh * 60 + sm);
      // Mais de 2h30 (150 min) indica bloco duplo com intervalo de 30 min (ex: 2x 105 min + 30 min = 240 min)
      return diffMin >= 150;
    })();

    if (isDoubleBlock) {
      const [sh, sm] = s.startTime.split(":").map(Number);
      const [eh, em] = s.endTime.split(":").map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;

      // Aula 1: início até início + 105 min (1h45)
      const a1EndMin = startMin + 105;
      const a1EndH = Math.floor(a1EndMin / 60);
      const a1EndM = a1EndMin % 60;
      const a1EndStr = `${pad(a1EndH)}:${pad(a1EndM)}`;

      // Aula 2: a1EndMin + 30 min intervalo até o fim
      const a2StartMin = a1EndMin + 30;
      const a2StartH = Math.floor(a2StartMin / 60);
      const a2StartM = a2StartMin % 60;
      const a2StartStr = `${pad(a2StartH)}:${pad(a2StartM)}`;

      const stat = stats[s.id] || { situation: null, remaining: null };

      // Slot 1
      result.push({
        id: `${s.id}:${iso}:1`,
        subjectId: s.id,
        date: `${iso}:1`,
        name: `${s.name} (Aula 1)`,
        startTime: s.startTime,
        endTime: a1EndStr,
        room: s.room,
        teacher: s.teacher,
        situation: stat.situation,
        remaining: stat.remaining,
        status: statusOf(s.id, `${iso}:1`) ?? statusOf(s.id, iso),
      });

      // Slot 2
      result.push({
        id: `${s.id}:${iso}:2`,
        subjectId: s.id,
        date: `${iso}:2`,
        name: `${s.name} (Aula 2)`,
        startTime: a2StartStr,
        endTime: s.endTime,
        room: s.room,
        teacher: s.teacher,
        situation: stat.situation,
        remaining: stat.remaining,
        status: statusOf(s.id, `${iso}:2`),
      });
    } else {
      const stat = stats[s.id] || { situation: null, remaining: null };
      result.push({
        id: `${s.id}:${iso}`,
        subjectId: s.id,
        date: iso,
        name: s.name,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
        teacher: s.teacher,
        situation: stat.situation,
        remaining: stat.remaining,
        status: statusOf(s.id, iso),
      });
    }
  }

  return result.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.name.localeCompare(b.name));
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
