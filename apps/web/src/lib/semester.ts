import type { Subject } from "@/types";
import { getSemesterLabel } from "./calendar";

const SEMESTER_RE = /^\d{4}\.[1-4]$/;

/** "2026.1" (ano, ponto, número do semestre de 1 a 4). */
export function isValidSemester(value: string): boolean {
  return SEMESTER_RE.test(value.trim());
}

/** Opções do seletor: semestres das disciplinas + o selecionado + o semestre do calendário, do mais novo ao mais antigo. */
export function listSemesters(subjects: Subject[], selected: string, now: Date): string[] {
  const all = new Set<string>([selected, getSemesterLabel(now), ...subjects.map((s) => s.semester)]);
  return Array.from(all).sort((a, b) => b.localeCompare(a));
}
