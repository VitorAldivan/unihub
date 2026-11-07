"use client";

import { useRef, useState, type FormEvent } from "react";
import type { NewSubjectInput } from "@/types";
import { MIN_ATTENDANCE_PCT, WEEKDAYS } from "@/lib/constants";
import { validateSubjectForm, type SubjectFormErrors } from "@/lib/subject-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

interface SubjectFormProps {
  defaultSemester: string;
  onSubmit: (input: NewSubjectInput) => void;
  onCancel: () => void;
}

type Text = { target: { value: string } };

/** Formulário local. Campo vazio = dado ausente (aparece como "—"), nunca zero. */
export function SubjectForm({ defaultSemester, onSubmit, onCancel }: SubjectFormProps) {
  const [values, setValues] = useState({
    name: "",
    teacher: "",
    room: "",
    semester: defaultSemester,
    startTime: "",
    endTime: "",
    total: "",
    held: "",
    absences: "",
    limit: "",
  });
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [errors, setErrors] = useState<SubjectFormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const bind = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: Text) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  function toggleDay(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  // Assistente de duração de aula (padrão 1h45 com intervalo de 30m para bloco duplo)
  function handleSelectDuration(classCount: 1 | 2) {
    if (!values.startTime) return;
    const [h, m] = values.startTime.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return;

    const startMin = h * 60 + m;
    // 1 aula = 105 min (1h45); 2 aulas = 105 + 30 (intervalo) + 105 = 240 min (4h)
    const durationMin = classCount === 1 ? 105 : 240;
    const endMin = startMin + durationMin;
    const endH = Math.floor(endMin / 60) % 24;
    const endM = endMin % 60;
    const endStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    setValues((v) => ({ ...v, endTime: endStr }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { errors: next, input } = validateSubjectForm({ ...values, weekdays });
    setErrors(next);
    if (!input) {
      // Leva o foco ao primeiro campo com erro.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    onSubmit(input);
  }

  const invalid = (key: keyof SubjectFormErrors) => (errors[key] ? true : undefined);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
      // Teclado virtual: traz o campo focado para o meio da área visível.
      onFocusCapture={(e) => (e.target as HTMLElement).scrollIntoView?.({ block: "center", behavior: "smooth" })}
    >
      <Field label="Nome da disciplina" error={errors.name}>
        <input className={inputClass} {...bind("name")} aria-invalid={invalid("name")} placeholder="Ex.: Cálculo I" autoComplete="off" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Professor(a)">
          <input className={inputClass} {...bind("teacher")} placeholder="Opcional" autoComplete="off" />
        </Field>
        <Field label="Sala">
          <input className={inputClass} {...bind("room")} placeholder="Opcional" autoComplete="off" />
        </Field>
      </div>

      <Field label="Semestre" error={errors.semester} hint="Ex.: 2026.1">
        <input className={inputClass} {...bind("semester")} aria-invalid={invalid("semester")} inputMode="decimal" autoComplete="off" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Total de aulas" error={errors.total}>
          <input className={inputClass} {...bind("total")} aria-invalid={invalid("total")} inputMode="numeric" placeholder="Opcional" />
        </Field>
        <Field label="Aulas dadas" error={errors.held}>
          <input className={inputClass} {...bind("held")} aria-invalid={invalid("held")} inputMode="numeric" placeholder="Opcional" />
        </Field>
        <Field label="Faltas registradas" error={errors.absences}>
          <input className={inputClass} {...bind("absences")} aria-invalid={invalid("absences")} inputMode="numeric" placeholder="Opcional" />
        </Field>
        <Field label="Limite de faltas" error={errors.limit}>
          <input className={inputClass} {...bind("limit")} aria-invalid={invalid("limit")} inputMode="numeric" placeholder="Opcional" />
        </Field>
      </div>
      <p className="text-xs text-ink-soft">
        Campos em branco ficam como “—” e não entram nas contas. Sem o limite, usamos {100 - MIN_ATTENDANCE_PCT}% do
        total de aulas (mínimo de {MIN_ATTENDANCE_PCT}% de presença), se o total for informado.
      </p>

      <fieldset>
        <legend className="text-sm font-semibold">Dias e horário (opcional)</legend>
        <p className="mt-1 text-xs text-ink-soft">Sem horário, a disciplina não aparece em Hoje nem no Calendário.</p>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d) => {
            const on = weekdays.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                aria-pressed={on}
                aria-label={d.full}
                onClick={() => toggleDay(d.value)}
                className={cn(
                  "min-h-11 rounded-xl text-xs font-semibold transition-colors",
                  on ? "bg-brand text-brand-on" : "bg-paper text-ink-soft",
                )}
              >
                {d.short}
              </button>
            );
          })}
        </div>
        {weekdays.length > 0 && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Início da aula" error={errors.schedule}>
                <input
                  type="time"
                  className={inputClass}
                  {...bind("startTime")}
                  aria-invalid={invalid("schedule")}
                />
              </Field>
              <Field label="Término da aula">
                <input
                  type="time"
                  className={inputClass}
                  {...bind("endTime")}
                  aria-invalid={invalid("schedule")}
                />
              </Field>
            </div>

            {values.startTime && (
              <div className="rounded-xl border border-line bg-paper p-3 text-xs">
                <span className="font-medium text-ink-soft">Atalho de duração no dia:</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectDuration(1)}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-left text-xs transition-colors hover:border-brand hover:text-brand"
                  >
                    <span className="block font-semibold">1 aula (1h45)</span>
                    <span className="text-[10px] text-ink-soft">Sem intervalo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDuration(2)}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-left text-xs transition-colors hover:border-brand hover:text-brand"
                  >
                    <span className="block font-semibold">2 aulas (bloco duplo)</span>
                    <span className="text-[10px] text-ink-soft">Com intervalo de 30m</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </fieldset>

      {/* Ações sempre à vista, mesmo com o teclado aberto ou o formulário longo. */}
      <div className="sticky bottom-0 -mx-6 mt-2 grid grid-cols-2 gap-3 border-t border-line bg-surface px-6 pb-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="text-center leading-tight">
          Adicionar disciplina
        </Button>
      </div>
    </form>
  );
}
