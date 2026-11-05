// Fonte da verdade dos tipos do UniHub.

export type AttendanceSituation = "SAFE" | "WARNING" | "CRITICAL";
export type AttendanceStatus = "present" | "absent" | "justified" | "cancelled";
export type ReminderKind = "exam" | "assignment" | "other";

export interface Subject {
  id: string;
  name: string;
  /** "" = não informado */
  teacher: string;
  /** "" = não informado */
  room: string;
  /** "AAAA.N", ex.: "2026.1" */
  semester: string;
  /** 0 = domingo ... 6 = sábado. [] = sem horário (não aparece em Hoje nem no Calendário). */
  weekdays: number[];
  /** "HH:mm"; "" quando não há horário. */
  startTime: string;
  endTime: string;
  /** Aulas previstas no semestre completo. null = não informado. */
  totalClasses: number | null;
  /** Contagens anteriores aos registros feitos no app. null = não informado (NUNCA vira zero). */
  baseline: { held: number | null; absences: number | null };
  /** Limite de faltas informado. null = derivar do total (se houver). */
  absenceLimit: number | null;
  /** Frequência (%) informada diretamente. Só vale quando não há aulas dadas para calcular. */
  reportedFrequency?: number;
}

export interface NewSubjectInput {
  name: string;
  teacher: string;
  room: string;
  semester: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
  totalClasses: number | null;
  heldClasses: number | null;
  absences: number | null;
  absenceLimit: number | null;
}

export interface AttendanceRecord {
  subjectId: string;
  /** "YYYY-MM-DD" (data local) */
  date: string;
  status: AttendanceStatus;
}

export interface Reminder {
  id: string;
  date: string;
  title: string;
  kind: ReminderKind;
  subjectId?: string;
  /** "HH:mm" (opcional) */
  time?: string;
}

export type NewReminderInput = Omit<Reminder, "id">;

export interface UserSession {
  name: string;
  email: string;
}

/** Todas as métricas podem ser null (dado ausente). A tela mostra "—", nunca zero. */
export interface AttendanceStats {
  /** Aulas previstas no semestre. */
  total: number | null;
  /** Aulas dadas. */
  held: number | null;
  /** Faltas. */
  absences: number | null;
  /** Limite de faltas do semestre. */
  limit: number | null;
  /** limite − faltas (negativo se o limite estourou). */
  remaining: number | null;
  /** (dadas − faltas) ÷ dadas × 100, ou a frequência informada diretamente. */
  frequency: number | null;
  /** Frequência no fim do semestre se não houver mais faltas. */
  projected: number | null;
  situation: AttendanceSituation | null;
}

/** Uma aula de uma disciplina em uma data específica (visão da tela "Hoje"). */
export interface ClassSession {
  /** `${subjectId}:${date}` */
  id: string;
  subjectId: string;
  /** "YYYY-MM-DD" */
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  room: string;
  teacher: string;
  situation: AttendanceSituation | null;
  remaining: number | null;
  status?: AttendanceStatus;
}
