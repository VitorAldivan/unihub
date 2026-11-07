// Regras de negócio da frequência — funções puras (AGENTS.md, Parte D).
// Dado ausente (null) NUNCA vira zero: o resultado fica null e a tela mostra "—".
import type {
  AttendanceRecord,
  AttendanceSituation,
  AttendanceStats,
  Subject,
} from "@/types";
import {
  CRITICAL_USAGE_PCT,
  JUSTIFIED_COUNTS_AS_ABSENCE,
  MIN_ATTENDANCE_PCT,
  WARNING_USAGE_PCT,
} from "./constants";

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** Limite informado; sem ele, deriva do total e do mínimo de presença configurado. */
export function resolveAbsenceLimit(total: number | null, explicit: number | null): number | null {
  if (explicit !== null) return explicit;
  if (total === null) return null;
  return Math.floor((total * (100 - MIN_ATTENDANCE_PCT)) / 100);
}

/** (dadas − faltas) ÷ dadas × 100. Sem aulas dadas ou sem faltas informadas: null. */
export function calcFrequency(held: number | null, absences: number | null): number | null {
  if (held === null || absences === null || held <= 0) return null;
  return clamp(((held - absences) * 100) / held);
}

/** (total − faltas) ÷ total × 100: onde a frequência termina se não houver mais faltas. */
export function calcProjected(total: number | null, absences: number | null): number | null {
  if (total === null || absences === null || total <= 0) return null;
  return clamp(((total - absences) * 100) / total);
}

/** Situação pelo uso do limite de faltas. Sem faltas ou sem limite: null (não inventa classificação). */
export function resolveSituation(absences: number | null, limit: number | null): AttendanceSituation | null {
  if (absences === null || limit === null) return null;
  if (limit <= 0) return "CRITICAL";
  if (absences * 100 >= limit * CRITICAL_USAGE_PCT) return "CRITICAL";
  if (absences * 100 >= limit * WARNING_USAGE_PCT) return "WARNING";
  return "SAFE";
}

const RANK: Record<AttendanceSituation, number> = { SAFE: 0, WARNING: 1, CRITICAL: 2 };

export function worseSituation(
  a: AttendanceSituation | null,
  b: AttendanceSituation | null,
): AttendanceSituation | null {
  if (a === null) return b;
  if (b === null) return a;
  return RANK[a] >= RANK[b] ? a : b;
}

export function getSubjectStats(subject: Subject, records: AttendanceRecord[]): AttendanceStats {
  let recHeld = 0;
  let recAbs = 0;
  for (const r of records) {
    if (r.subjectId !== subject.id || r.status === "cancelled") continue;
    recHeld += 1; // a aula aconteceu (present, absent ou justified)
    if (r.status === "absent" || (r.status === "justified" && JUSTIFIED_COUNTS_AS_ABSENCE)) recAbs += 1;
  }

  const { held: baseHeld, absences: baseAbs } = subject.baseline;
  // Sem nenhuma contagem inicial, o app conta a partir dos registros.
  // Com só uma delas, a outra segue desconhecida: contar a partir de hoje daria uma frequência errada.
  const fromScratch = baseHeld === null && baseAbs === null && recHeld > 0;
  const held = baseHeld !== null ? baseHeld + recHeld : fromScratch ? recHeld : null;
  const absences = baseAbs !== null ? baseAbs + recAbs : fromScratch ? recAbs : null;

  const limit = resolveAbsenceLimit(subject.totalClasses, subject.absenceLimit);

  return {
    total: subject.totalClasses,
    held,
    absences,
    limit,
    remaining: limit !== null && absences !== null ? limit - absences : null,
    frequency: calcFrequency(held, absences) ?? subject.reportedFrequency ?? null,
    projected: calcProjected(subject.totalClasses, absences),
    situation: resolveSituation(absences, limit),
  };
}

/** Frequência média geral: média das frequências disponíveis. null se nenhuma estiver disponível. */
export function averageFrequency(list: AttendanceStats[]): number | null {
  const values = list.map((s) => s.frequency).filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

/** Dá para recalcular a frequência? Exige aulas dadas e faltas conhecidas. */
export function isSimulable(stats: AttendanceStats): boolean {
  return stats.held !== null && stats.absences !== null;
}

/** Simulação pura: não grava nada. `n` aulas a mais, todas com falta. */
export function simulateAbsences(stats: AttendanceStats, n: number): AttendanceStats {
  const held = stats.held === null ? null : stats.held + n;
  const absences = stats.absences === null ? null : stats.absences + n;
  return {
    ...stats,
    held,
    absences,
    remaining: stats.limit !== null && absences !== null ? stats.limit - absences : null,
    frequency: calcFrequency(held, absences),
    projected: calcProjected(stats.total, absences),
    situation: resolveSituation(absences, stats.limit),
  };
}

/** Aulas que ainda podem acontecer (limite superior do simulador). null se não dá para saber. */
export function remainingClasses(stats: AttendanceStats): number | null {
  if (stats.total === null || stats.held === null) return null;
  return Math.max(0, stats.total - stats.held);
}

/** Junta disciplinas: frequência = média; contagens somadas só quando TODAS informam. */
export function combineStats(list: AttendanceStats[]): AttendanceStats | null {
  if (list.length === 0) return null;
  const sum = (pick: (s: AttendanceStats) => number | null): number | null => {
    let total = 0;
    for (const s of list) {
      const v = pick(s);
      if (v === null) return null;
      total += v;
    }
    return total;
  };
  const mean = (pick: (s: AttendanceStats) => number | null): number | null => {
    const values = list.map(pick);
    if (values.some((v) => v === null)) return null;
    return (values as number[]).reduce((acc, v) => acc + v, 0) / values.length;
  };
  return {
    total: sum((s) => s.total),
    held: sum((s) => s.held),
    absences: sum((s) => s.absences),
    limit: sum((s) => s.limit),
    remaining: sum((s) => s.remaining),
    frequency: averageFrequency(list),
    projected: mean((s) => s.projected),
    situation: list.map((s) => s.situation).reduce<AttendanceSituation | null>(worseSituation, null),
  };
}
