import type { Reminder, Subject } from "@/types";
import { toISODate } from "@/lib/calendar";

/** Dados FICTÍCIOS para testar a interface (AGENTS.md A3.7). */
export const DEMO_SEMESTER = "2026.1";

/** Aulas de exemplo aparecem todos os dias, para comparar com o Figma em qualquer dia da semana. */
const EVERY_DAY = [1, 2, 3, 4, 5, 6, 0];

interface Seed {
  key: string;
  name: string;
  teacher?: string;
  room?: string;
  semester?: string;
  days?: number[];
  start?: string;
  end?: string;
  total?: number;
  held?: number;
  absences?: number;
  limit?: number;
  reported?: number;
}

/** Campo omitido = dado ausente (null), nunca zero. */
const mk = (s: Seed): Subject => ({
  id: `demo-${s.key}`,
  name: s.name,
  teacher: s.teacher ?? "",
  room: s.room ?? "",
  semester: s.semester ?? DEMO_SEMESTER,
  weekdays: s.days ?? [],
  startTime: s.start ?? "",
  endTime: s.end ?? "",
  totalClasses: s.total ?? null,
  baseline: { held: s.held ?? null, absences: s.absences ?? null },
  absenceLimit: s.limit ?? null,
  ...(s.reported !== undefined ? { reportedFrequency: s.reported } : {}),
});

/**
 * As três disciplinas da referência do Figma, com os valores exatos.
 * Cálculo II e Anatomia Humana NÃO têm Total nem Dadas: a frequência (85% e 94%) é a informada.
 * Média geral = (85 + 85 + 94) ÷ 3 = 88%, como na tela "Hoje".
 */
export const DEMO_REFERENCE_SUBJECTS: Subject[] = [
  mk({ key: "calculo", name: "Cálculo I", teacher: "Prof. Marcos", room: "Sala 204", days: EVERY_DAY, start: "10:20", end: "12:00", total: 60, held: 20, absences: 3, limit: 15 }),
  mk({ key: "calculo2", name: "Cálculo II", teacher: "Prof. Marcos", room: "Sala 204", absences: 3, limit: 15, reported: 85 }),
  mk({ key: "anatomia", name: "Anatomia Humana", teacher: "Profa. Helena", room: "Sala 302", days: EVERY_DAY, start: "08:00", end: "10:00", absences: 3, limit: 15, reported: 94 }),
];

/** Outro semestre, para o seletor. Lista independente da de 2026.1. */
export const DEMO_PREVIOUS_SEMESTER_SUBJECTS: Subject[] = [
  mk({ key: "quimica", semester: "2025.2", name: "Química Geral", teacher: "Prof. Renata", room: "Lab 3", total: 60, held: 60, absences: 9, limit: 15 }),
  mk({ key: "fisica", semester: "2025.2", name: "Física I", teacher: "Prof. Paulo", room: "Sala 110", total: 72, held: 72, absences: 15, limit: 18 }),
  mk({ key: "biocel", semester: "2025.2", name: "Biologia Celular", teacher: "Profa. Ana", room: "Sala 12", total: 48, held: 48, absences: 4, limit: 12 }),
];

/** Com horário, sem conflito com Anatomia (08:00–10:00) e Cálculo I (10:20–12:00). */
const SCHEDULED_EXTRAS: Subject[] = [
  mk({ key: "fisio", name: "Fisiologia I", teacher: "Profa. Carolina", room: "Sala 101", days: EVERY_DAY, start: "06:30", end: "07:50", total: 72, held: 50, absences: 5, limit: 18 }),
  mk({ key: "histo", name: "Histologia e Embriologia Geral Aplicada à Saúde", teacher: "Prof. Dr. Antônio Carlos de Albuquerque Menezes", room: "Laboratório de Microscopia 5", days: EVERY_DAY, start: "13:00", end: "14:40", total: 80, held: 60, absences: 17, limit: 20 }),
  mk({ key: "meto", name: "Metodologia da Pesquisa Científica", teacher: "Profa. Marina", days: EVERY_DAY, start: "14:50", end: "16:30", total: 60, held: 40, absences: 5, limit: 15 }),
  mk({ key: "bio", name: "Bioquímica", room: "Sala 210", days: EVERY_DAY, start: "16:40", end: "18:20", total: 72, held: 68, absences: 17, limit: 18 }),
  mk({ key: "gen", name: "Genética Humana", teacher: "Profa. Beatriz", room: "Sala 118", days: EVERY_DAY, start: "18:30", end: "20:10", total: 60, held: 45, absences: 3, limit: 15 }),
  mk({ key: "saude", name: "Introdução à Saúde Coletiva e Políticas Públicas", teacher: "Prof. Roberto", room: "Auditório Central", days: EVERY_DAY, start: "20:20", end: "22:00", total: 48, held: 36, absences: 10, limit: 12 }),
];

/** Sem horário e com dados parciais: sem registros, tudo ausente, limite excedido. */
const PARTIAL_EXTRAS: Subject[] = [
  mk({ key: "estagio", name: "Estágio Supervisionado I", teacher: "Profa. Luciana", total: 120, held: 0, absences: 0, limit: 30 }),
  mk({ key: "optativa", name: "Optativa: História da Ciência" }),
  mk({ key: "seminario", name: "Seminário Integrador", total: 40, held: 30, absences: 12, limit: 10 }),
];

/** Dia cheio na tela "Hoje": 8 aulas, sem conflito de horário. */
export const DEMO_BUSY_DAY_SUBJECTS: Subject[] = [
  DEMO_REFERENCE_SUBJECTS[0],
  DEMO_REFERENCE_SUBJECTS[2],
  ...SCHEDULED_EXTRAS,
];

/** Lista longa na tela "Disciplinas": 12 disciplinas, com nomes longos e campos ausentes. */
export const DEMO_LONG_LIST_SUBJECTS: Subject[] = [
  ...DEMO_REFERENCE_SUBJECTS,
  ...SCHEDULED_EXTRAS,
  ...PARTIAL_EXTRAS,
];

/**
 * Conjunto carregado pelo botão "Carregar dados de exemplo" (referência do Figma + outro semestre).
 * Para testar rolagem, troque por um destes (sem criar controle de teste na interface):
 *   [...DEMO_LONG_LIST_SUBJECTS, ...DEMO_PREVIOUS_SEMESTER_SUBJECTS]  → lista longa em Disciplinas
 *   [...DEMO_BUSY_DAY_SUBJECTS, ...DEMO_PREVIOUS_SEMESTER_SUBJECTS]   → dia cheio em Hoje
 */
export const DEMO_SUBJECTS: Subject[] = [...DEMO_REFERENCE_SUBJECTS, ...DEMO_PREVIOUS_SEMESTER_SUBJECTS];

export const DEMO_REMINDER_ID = "demo-prova-calculo";

/** "Prova de Cálculo" daqui a 3 dias, 10:20 (mesma sala da disciplina). */
export function buildDemoReminder(from: Date): Reminder {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 3);
  return {
    id: DEMO_REMINDER_ID,
    date: toISODate(date),
    title: "Prova de Cálculo",
    kind: "exam",
    subjectId: "demo-calculo",
    time: "10:20",
  };
}
