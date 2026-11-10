import type { NewSubjectInput } from "@/types";
import { isValidSemester } from "./semester";

export interface SubjectFormValues {
  name: string;
  teacher: string;
  room: string;
  semester: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
  total: string;
  held: string;
  absences: string;
  limit: string;
}

export type SubjectFormField = "name" | "semester" | "schedule" | "total" | "held" | "absences" | "limit";
export type SubjectFormErrors = Partial<Record<SubjectFormField, string>>;

export type Count = number | null | "invalid";

/** "" → null (ausente, NÃO zero) · "12" → 12 · "-1", "1,5", "abc" → "invalid". */
export function parseCount(raw: string): Count {
  const text = raw.trim();
  if (text === "") return null;
  if (!/^\d+$/.test(text)) return "invalid";
  const n = Number(text);
  return Number.isSafeInteger(n) ? n : "invalid";
}

export const COUNT_ERROR = "Use um número inteiro maior ou igual a zero.";

export function validateSubjectForm(v: SubjectFormValues): {
  errors: SubjectFormErrors;
  input: NewSubjectInput | null;
} {
  const errors: SubjectFormErrors = {};

  const name = v.name.trim();
  if (!name) errors.name = "Digite o nome da disciplina.";

  const semester = v.semester.trim();
  if (!isValidSemester(semester)) errors.semester = "Use o formato 2026.1 (ano, ponto e número do semestre).";

  const total = parseCount(v.total);
  const held = parseCount(v.held);
  const absences = parseCount(v.absences);
  const limit = parseCount(v.limit);
  if (total === "invalid") errors.total = COUNT_ERROR;
  if (held === "invalid") errors.held = COUNT_ERROR;
  if (absences === "invalid") errors.absences = COUNT_ERROR;
  if (limit === "invalid") errors.limit = COUNT_ERROR;

  if (!errors.total && !errors.held && typeof total === "number" && typeof held === "number" && held > total) {
    errors.held = "As aulas dadas não podem passar do total de aulas.";
  }
  if (!errors.held && !errors.absences && typeof held === "number" && typeof absences === "number" && absences > held) {
    errors.absences = "As faltas não podem passar das aulas dadas.";
  }

  if (v.weekdays.length > 0) {
    if (!v.startTime || !v.endTime) errors.schedule = "Informe o início e o fim da aula.";
    else if (v.endTime <= v.startTime) errors.schedule = "O fim precisa ser depois do início.";
  }

  if (Object.keys(errors).length > 0) return { errors, input: null };

  const scheduled = v.weekdays.length > 0;
  return {
    errors,
    input: {
      name,
      teacher: v.teacher.trim(),
      room: v.room.trim(),
      semester,
      weekdays: [...v.weekdays].sort(),
      startTime: scheduled ? v.startTime : "",
      endTime: scheduled ? v.endTime : "",
      totalClasses: total as number | null,
      heldClasses: held as number | null,
      absences: absences as number | null,
      absenceLimit: limit as number | null,
    },
  };
}
