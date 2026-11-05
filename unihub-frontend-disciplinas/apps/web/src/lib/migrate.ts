import type { Subject } from "@/types";
import { getSemesterLabel } from "./calendar";

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Lê disciplinas salvas por versões anteriores do app e entrega o formato atual.
 * Descarta itens inválidos e os dados de exemplo antigos (ids "demo-…" sem semestre),
 * que o botão "Carregar dados de exemplo" recria no formato novo.
 */
export function normalizeSubjects(raw: unknown, now: Date = new Date()): Subject[] {
  if (!Array.isArray(raw)) return [];
  const fallbackSemester = getSemesterLabel(now);
  const result: Subject[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (typeof r.id !== "string" || typeof r.name !== "string") continue;

    const hasSemester = typeof r.semester === "string";
    if (!hasSemester && r.id.startsWith("demo-")) continue;

    const baseline = (r.baseline && typeof r.baseline === "object" ? r.baseline : {}) as Record<string, unknown>;
    // Total estimado por versões antigas (dias × semanas) era um número inventado: volta a "não informado".
    const totalWasEstimated = r.totalClassesEstimated === true;

    result.push({
      id: r.id,
      name: r.name,
      teacher: str(r.teacher),
      room: str(r.room),
      semester: hasSemester ? (r.semester as string) : fallbackSemester,
      weekdays: Array.isArray(r.weekdays) ? r.weekdays.filter((d): d is number => typeof d === "number") : [],
      startTime: str(r.startTime),
      endTime: str(r.endTime),
      totalClasses: totalWasEstimated ? null : num(r.totalClasses),
      baseline: { held: num(baseline.held), absences: num(baseline.absences) },
      absenceLimit: num(r.absenceLimit),
      ...(num(r.reportedFrequency) !== null ? { reportedFrequency: num(r.reportedFrequency) as number } : {}),
    });
  }
  return result;
}
