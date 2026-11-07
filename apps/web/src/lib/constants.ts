import type { ReminderKind } from "@/types";

/**
 * Mínimo de presença usado para derivar o limite de faltas e calcular a situação acadêmica.
 * Configurado para 70% conforme o regulamento da faculdade.
 */
export const MIN_ATTENDANCE_PCT = 70;

/** Situação pelo uso do limite de faltas (AGENTS.md D3). Configuráveis. */
export const WARNING_USAGE_PCT = 80;
export const CRITICAL_USAGE_PCT = 90;

/**
 * Falta justificada conta como falta? Padrão conservador: sim (a justificativa
 * não apaga a ausência na maioria dos regulamentos). Vira configuração por
 * disciplina na Fase 1 — confirme o regulamento da sua faculdade.
 */
export const JUSTIFIED_COUNTS_AS_ABSENCE = true;

/** Limite do simulador quando não se sabe quantas aulas ainda restam. */
export const DEFAULT_SIM_MAX = 30;

/** Ordem de exibição: segunda a domingo. */
export const WEEKDAYS = [
  { value: 1, short: "Seg", full: "Segunda-feira" },
  { value: 2, short: "Ter", full: "Terça-feira" },
  { value: 3, short: "Qua", full: "Quarta-feira" },
  { value: 4, short: "Qui", full: "Quinta-feira" },
  { value: 5, short: "Sex", full: "Sexta-feira" },
  { value: 6, short: "Sáb", full: "Sábado" },
  { value: 0, short: "Dom", full: "Domingo" },
] as const;

export const REMINDER_KINDS: { value: ReminderKind; label: string }[] = [
  { value: "exam", label: "Prova" },
  { value: "assignment", label: "Trabalho" },
  { value: "other", label: "Outro" },
];
