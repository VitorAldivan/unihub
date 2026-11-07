import { WEEKDAYS } from "./constants";

/** Percentual para exibição: arredonda para BAIXO (74,6% não vira 75%). */
export function displayPct(value: number): number {
  return Math.floor(value + 1e-9);
}

export function formatPct(value: number): string {
  return `${displayPct(value)}%`;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/** [1, 3] → "Seg e Qua"; [1, 3, 5] → "Seg, Qua e Sex" */
export function formatWeekdays(days: number[]): string {
  const names = WEEKDAYS.filter((d) => days.includes(d.value)).map((d) => d.short);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} às ${end}`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "vitor.silva@email.com" → "Vitor" (temporário até a API devolver display_name). */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const first = local.split(/[._\-+\d]+/).find(Boolean) ?? "";
  return first ? capitalize(first.toLowerCase()) : "Aluno";
}

/** "lucas.silva@email.com" → "LS"; "lucas@email.com" → "LU". */
export function initialsFromEmail(email: string): string {
  const parts = (email.split("@")[0] ?? "").split(/[._\-+\d]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return ((parts[0] ?? "").slice(0, 2) || "U").toUpperCase();
}

export function formatClassCount(n: number): string {
  if (n === 0) return "Nenhuma aula";
  return `${n} ${plural(n, "aula", "aulas")}`;
}

export function describeRemaining(remaining: number): string {
  if (remaining < 0) return "Limite de faltas excedido";
  if (remaining === 0) return "Nenhuma falta restante no semestre";
  return `${remaining} ${plural(remaining, "falta restante", "faltas restantes")} no semestre`;
}

/** 3 → "03" (no mínimo dois dígitos, sem truncar números maiores). */
export function padCount(n: number): string {
  return String(n).padStart(2, "0");
}

/** "3 de 15 faltas usadas · 12 restantes" — e as variações quando falta dado. */
export function describeAbsenceSummary(absences: number | null, limit: number | null): string {
  if (absences !== null && limit !== null) {
    const used = `${absences} de ${limit} ${plural(limit, "falta usada", "faltas usadas")}`;
    const left = limit - absences;
    return left < 0 ? `${used} · limite excedido` : `${used} · ${left} ${plural(left, "restante", "restantes")}`;
  }
  if (absences !== null) {
    return `${absences} ${plural(absences, "falta registrada", "faltas registradas")} · limite não informado`;
  }
  if (limit !== null) return `Limite de ${limit} ${plural(limit, "falta", "faltas")} · faltas não informadas`;
  return "Faltas e limite não informados";
}
