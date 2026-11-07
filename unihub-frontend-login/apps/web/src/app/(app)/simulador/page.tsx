"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calculator, Minus, Plus } from "lucide-react";
import type { AttendanceStats } from "@/types";
import { useAcademic } from "@/context/AcademicProvider";
import { combineStats, isSimulable, remainingClasses, simulateAbsences } from "@/lib/attendance";
import { DEFAULT_SIM_MAX } from "@/lib/constants";
import { formatPct, plural } from "@/lib/format";
import { AbsenceStats } from "@/components/attendance/AbsenceStats";
import { FrequencyCard } from "@/components/attendance/FrequencyCard";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, inputClass } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";

type Mode = "subject" | "overall";

const faltas = (count: number) => `${count} ${plural(count, "falta", "faltas")}`;

function describeConsequence(n: number, after: AttendanceStats, scope: string): string {
  if (n === 0) return "Escolha quantas aulas você pretende faltar.";
  if (after.remaining !== null && after.remaining < 0) {
    return `Com ${faltas(n)} a mais ${scope}, o limite é ultrapassado e há risco de reprovação por falta.`;
  }
  const parts: string[] = [];
  if (after.remaining !== null) parts.push(`restariam ${faltas(after.remaining)}`);
  if (after.projected !== null) {
    parts.push(`a frequência projetada para o fim do semestre seria ${formatPct(after.projected)}`);
  }
  if (parts.length === 0) return `Faltam dados para calcular o efeito de ${faltas(n)} ${scope}.`;
  return `Com ${faltas(n)} a mais ${scope}, ${parts.join(" e ")}.`;
}

export default function SimulatorPage() {
  const { subjects, stats } = useAcademic();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>("subject");
  const [subjectId, setSubjectId] = useState(params.get("materia") ?? "");
  const [extra, setExtra] = useState(1);

  if (subjects.length === 0) {
    return (
      <div className="px-6 pt-6">
        <h1 className="mb-5 text-[30px] font-semibold tracking-tight">Simulador de faltas</h1>
        <EmptyState
          icon={Calculator}
          title="Nada para simular ainda"
          text="Cadastre uma disciplina para ver como as faltas afetam a sua frequência."
        >
          <Link href="/disciplinas" className={buttonStyles("primary")}>
            Ir para Disciplinas
          </Link>
        </EmptyState>
      </div>
    );
  }

  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];
  // "Geral" considera só as disciplinas em que dá para recalcular (aulas dadas e faltas conhecidas).
  const included = subjects.map((s) => stats[s.id]).filter(isSimulable);
  const base: AttendanceStats | null = mode === "overall" ? combineStats(included) : stats[subject.id];

  const considered = mode === "overall" ? included : [stats[subject.id]];
  const remainingList = considered.map(remainingClasses);
  const remainingKnown = remainingList.length > 0 && remainingList.every((r) => r !== null);
  const maxExtra = remainingKnown ? Math.min(...(remainingList as number[])) : DEFAULT_SIM_MAX;
  const n = Math.min(extra, maxExtra);

  const after: AttendanceStats | null = !base
    ? null
    : mode === "overall"
      ? combineStats(included.map((s) => simulateAbsences(s, n)))
      : simulateAbsences(base, n);

  const scope = mode === "overall" ? "em cada disciplina considerada" : `em ${subject.name}`;

  return (
    <div className="space-y-5 px-6 pb-8 pt-6">
      <header>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight">Simulador de faltas</h1>
        <p className="mt-1 text-sm text-ink-soft">Veja o impacto antes de faltar. Nada é salvo.</p>
      </header>

      <Segmented
        label="O que simular"
        value={mode}
        onChange={setMode}
        options={[
          { value: "subject", label: "Por disciplina" },
          { value: "overall", label: "Geral" },
        ]}
      />

      {mode === "subject" && (
        <Field label="Disciplina">
          <select className={inputClass} value={subject.id} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {mode === "overall" && included.length < subjects.length && (
        <p className="text-xs text-ink-soft">
          Considera {included.length} de {subjects.length} {plural(subjects.length, "disciplina", "disciplinas")}: as
          demais não têm aulas dadas e faltas informadas.
        </p>
      )}
      {mode === "subject" && base && !isSimulable(base) && (
        <p className="text-xs text-ink-soft">
          Sem aulas dadas ou faltas informadas, só é possível ver o saldo de faltas.
        </p>
      )}

      {!base || !after ? (
        <p className="rounded-card border border-dashed border-line px-5 py-8 text-center text-sm text-ink-soft">
          Nenhuma disciplina tem aulas dadas e faltas informadas para simular.
        </p>
      ) : (
        <>
          <section className="rounded-card border border-line bg-surface p-5" aria-labelledby="sim-count">
            <h2 id="sim-count" className="text-sm font-semibold">
              {mode === "overall" ? "Quantas aulas você pretende faltar em cada disciplina?" : "Quantas aulas você pretende faltar?"}
            </h2>
            {maxExtra === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">Não restam aulas no semestre para simular.</p>
            ) : (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Diminuir faltas"
                    disabled={n <= 0}
                    onClick={() => setExtra(n - 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand disabled:opacity-40"
                  >
                    <Minus className="h-5 w-5" aria-hidden />
                  </button>
                  <p aria-live="polite" className="text-5xl font-bold">
                    {n}
                  </p>
                  <button
                    type="button"
                    aria-label="Aumentar faltas"
                    disabled={n >= maxExtra}
                    onClick={() => setExtra(n + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand disabled:opacity-40"
                  >
                    <Plus className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxExtra}
                  value={n}
                  onChange={(e) => setExtra(Number(e.target.value))}
                  aria-label="Número de faltas simuladas"
                  className="mt-4 w-full accent-brand"
                />
                {remainingKnown && (
                  <p className="mt-1 text-xs text-ink-soft">
                    Restam {maxExtra} {plural(maxExtra, "aula", "aulas")} no semestre.
                  </p>
                )}
              </>
            )}
          </section>

          <FrequencyCard
            title={
              n === 0
                ? mode === "overall" ? "Frequência média hoje" : "Frequência hoje"
                : `${mode === "overall" ? "Frequência média" : "Frequência"} depois de faltar ${n} ${plural(n, "aula", "aulas")}`
            }
            value={after.frequency}
            situation={after.situation}
          >
            <p>Hoje: {base.frequency === null ? "—" : formatPct(base.frequency)}</p>
            {after.projected !== null && <p>Fim do semestre, se não faltar mais: {formatPct(after.projected)}</p>}
          </FrequencyCard>

          <p className="text-sm text-ink">{describeConsequence(n, after, scope)}</p>

          <AbsenceStats
            allowed={after.limit}
            used={after.absences}
            remaining={after.remaining}
            situation={after.situation}
            previous={n > 0 ? { used: base.absences, remaining: base.remaining } : undefined}
          />
        </>
      )}
    </div>
  );
}
