import { WEEKDAYS } from "./constants";
import { capitalize } from "./format";

const pad = (n: number) => String(n).padStart(2, "0");

/** Data local → "YYYY-MM-DD" (sem passar por UTC). */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

/** Células do mês começando no domingo; `null` = espaço vazio. */
export function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function formatMonthTitle(d: Date): string {
  return capitalize(new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d));
}

/** "domingo, 1 de novembro de 2026" */
export function formatFullDate(d: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "Domingo, 1 de novembro" */
export function formatDayHeading(d: Date): string {
  return capitalize(
    new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(d),
  );
}

/** Janeiro–junho = .1, julho–dezembro = .2 (convenção comum; ajustável por faculdade). */
export function getSemesterLabel(d: Date): string {
  return `${d.getFullYear()}.${d.getMonth() < 6 ? 1 : 2}`;
}

export function getGreeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/** Dias entre `from` (hoje) e uma data ISO. 0 = hoje, 1 = amanhã, negativo = passado. */
export function daysUntil(iso: string, from: Date): number {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target - start) / 86_400_000);
}

/** "2026-10-29" → "Quinta, 29/10" */
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = WEEKDAYS.find((w) => w.value === new Date(y, m - 1, d).getDay())!.full.replace("-feira", "");
  return `${weekday}, ${pad(d)}/${pad(m)}`;
}
