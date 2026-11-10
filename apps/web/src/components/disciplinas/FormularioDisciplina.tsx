"use client";

import { useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { NewSubjectInput } from "@/types";
import { MIN_ATTENDANCE_PCT, WEEKDAYS } from "@/lib/constants";
import { isValidSemester } from "@/lib/semester";
import {
  validateSubjectForm,
  parseCount,
  COUNT_ERROR,
  type SubjectFormErrors,
} from "@/lib/subject-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

interface SubjectFormProps {
  defaultSemester: string;
  initialValues?: {
    name?: string;
    teacher?: string;
    room?: string;
    semester?: string;
    weekdays?: number[];
    startTime?: string;
    endTime?: string;
    total?: string;
    held?: string;
    absences?: string;
    limit?: string;
  };
  submitLabel?: string;
  onSubmit: (input: NewSubjectInput) => void;
  onCancel: () => void;
}

type Text = { target: { value: string } };

export function FormularioDisciplina({
  defaultSemester,
  initialValues,
  submitLabel = "Adicionar disciplina",
  onSubmit,
  onCancel,
}: SubjectFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState({
    name: initialValues?.name ?? "",
    teacher: initialValues?.teacher ?? "",
    room: initialValues?.room ?? "",
    semester: initialValues?.semester ?? defaultSemester,
    startTime: initialValues?.startTime ?? "",
    endTime: initialValues?.endTime ?? "",
    total: initialValues?.total ?? "",
    held: initialValues?.held ?? "",
    absences: initialValues?.absences ?? "",
    limit: initialValues?.limit ?? "",
  });
  const [weekdays, setWeekdays] = useState<number[]>(initialValues?.weekdays ?? []);
  const [classCount, setClassCount] = useState<1 | 2>(() => {
    if (initialValues?.startTime && initialValues?.endTime) {
      const [sh, sm] = initialValues.startTime.split(":").map(Number);
      const [eh, em] = initialValues.endTime.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      return diff >= 150 ? 2 : 1;
    }
    return 1;
  });
  const [errors, setErrors] = useState<SubjectFormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const bind = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: Text) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  function toggleDay(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function calculateEndTime(startTime: string, count: 1 | 2): string {
    if (!startTime) return "";
    const [h, m] = startTime.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return "";

    const startMin = h * 60 + m;
    // 1 aula = 105 min (1h45); 2 aulas = 210 min aulas + 30 min intervalo = 240 min (4h, 3h30 de aula)
    const durationMin = count === 1 ? 105 : 240;
    const endMin = startMin + durationMin;
    const endH = Math.floor(endMin / 60) % 24;
    const endM = endMin % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  }

  function handleSelectDuration(count: 1 | 2) {
    setClassCount(count);
    if (values.startTime) {
      const calculatedEnd = calculateEndTime(values.startTime, count);
      if (calculatedEnd) {
        setValues((v) => ({ ...v, endTime: calculatedEnd }));
      }
    }
  }

  function handleStartTimeChange(startTime: string) {
    const nextEnd = startTime ? calculateEndTime(startTime, classCount) : values.endTime;
    setValues((v) => ({ ...v, startTime, endTime: nextEnd }));
  }

  function handleContinueStep1() {
    const nextErrors: SubjectFormErrors = {};
    const name = values.name.trim();
    if (!name) nextErrors.name = "Digite o nome da disciplina.";

    const sem = values.semester.trim();
    if (!isValidSemester(sem)) {
      nextErrors.semester = "Use o formato 2026.1 (ano, ponto e número do semestre).";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.name;
      delete copy.semester;
      return copy;
    });
    setStep(2);
  }

  function handleContinueStep2() {
    const nextErrors: SubjectFormErrors = {};
    const total = parseCount(values.total);
    const held = parseCount(values.held);
    const absences = parseCount(values.absences);
    const limit = parseCount(values.limit);

    if (total === "invalid") nextErrors.total = COUNT_ERROR;
    if (held === "invalid") nextErrors.held = COUNT_ERROR;
    if (absences === "invalid") nextErrors.absences = COUNT_ERROR;
    if (limit === "invalid") nextErrors.limit = COUNT_ERROR;

    if (!nextErrors.total && !nextErrors.held && typeof total === "number" && typeof held === "number" && held > total) {
      nextErrors.held = "As aulas dadas não podem passar do total de aulas.";
    }
    if (!nextErrors.held && !nextErrors.absences && typeof held === "number" && typeof absences === "number" && absences > held) {
      nextErrors.absences = "As faltas não podem passar das aulas dadas.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.total;
      delete copy.held;
      delete copy.absences;
      delete copy.limit;
      return copy;
    });
    setStep(3);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { errors: next, input } = validateSubjectForm({ ...values, weekdays });
    setErrors(next);
    if (!input) {
      if (next.name || next.semester) {
        setStep(1);
      } else if (next.total || next.held || next.absences || next.limit) {
        setStep(2);
      }
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    onSubmit(input);
  }

  const invalid = (key: keyof SubjectFormErrors) => (errors[key] ? true : undefined);

  const stepConfig = {
    1: {
      tag: "ETAPA 1 DE 3 · IDENTIFICAÇÃO",
      title: "Nova disciplina",
      subtitle: "Comece pelas informações da disciplina.",
    },
    2: {
      tag: "ETAPA 2 DE 3 · FREQUÊNCIA",
      title: "Sua frequência",
      subtitle: "Organize as aulas e o controle de faltas.",
    },
    3: {
      tag: "ETAPA 3 DE 3 · DIAS E HORÁRIOS",
      title: "Dias e horários",
      subtitle: "Escolha a duração e informe o início da aula.",
    },
  }[step];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
      onFocusCapture={(e) =>
        (e.target as HTMLElement).scrollIntoView?.({ block: "center", behavior: "smooth" })
      }
    >
      {/* Cabeçalho de Etapas do Figma */}
      <div className="mb-2">
        <p className="text-[11px] font-semibold tracking-wider text-brand uppercase">
          {stepConfig.tag}
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {stepConfig.title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar janela"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-ink/10 hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-1 text-xs text-ink-soft">{stepConfig.subtitle}</p>

        {/* Indicador de 3 etapas com barra de progresso */}
        <div className="mt-3.5 grid grid-cols-3 gap-2">
          <div
            className={cn(
              "h-1 rounded-full transition-colors",
              step >= 1 ? "bg-brand" : "bg-line",
            )}
          />
          <div
            className={cn(
              "h-1 rounded-full transition-colors",
              step >= 2 ? "bg-brand" : "bg-line",
            )}
          />
          <div
            className={cn(
              "h-1 rounded-full transition-colors",
              step >= 3 ? "bg-brand" : "bg-line",
            )}
          />
        </div>
      </div>

      {/* ETAPA 1: Identificação */}
      {step === 1 && (
        <div className="space-y-4 pt-1">
          <Field label="Nome da disciplina" error={errors.name}>
            <input
              className={inputClass}
              {...bind("name")}
              aria-invalid={invalid("name")}
              placeholder="Ex.: Cálculo I"
              autoComplete="off"
              autoFocus
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Professor(a)">
              <input
                className={inputClass}
                {...bind("teacher")}
                placeholder="Opcional"
                autoComplete="off"
              />
            </Field>
            <Field label="Sala">
              <input
                className={inputClass}
                {...bind("room")}
                placeholder="Opcional"
                autoComplete="off"
              />
            </Field>
          </div>

          <Field label="Semestre" error={errors.semester} hint="Ex.: 2026.1">
            <input
              className={inputClass}
              {...bind("semester")}
              aria-invalid={invalid("semester")}
              inputMode="decimal"
              autoComplete="off"
            />
          </Field>

          <p className="text-xs text-ink-soft">
            Professor(a) e sala são opcionais.
          </p>
        </div>
      )}

      {/* ETAPA 2: Frequência */}
      {step === 2 && (
        <div className="space-y-4 pt-1">
          <p className="text-[11px] font-semibold tracking-wider text-ink-soft uppercase">
            AULAS E FREQUÊNCIA · OPCIONAL
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Total de aulas" error={errors.total}>
              <input
                className={inputClass}
                {...bind("total")}
                aria-invalid={invalid("total")}
                inputMode="numeric"
                placeholder="Opcional"
              />
            </Field>
            <Field label="Aulas dadas" error={errors.held}>
              <input
                className={inputClass}
                {...bind("held")}
                aria-invalid={invalid("held")}
                inputMode="numeric"
                placeholder="Opcional"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Faltas registradas" error={errors.absences}>
              <input
                className={inputClass}
                {...bind("absences")}
                aria-invalid={invalid("absences")}
                inputMode="numeric"
                placeholder="Opcional"
              />
            </Field>
            <Field label="Limite de faltas" error={errors.limit}>
              <input
                className={inputClass}
                {...bind("limit")}
                aria-invalid={invalid("limit")}
                inputMode="numeric"
                placeholder="Opcional"
              />
            </Field>
          </div>

          <p className="text-xs leading-relaxed text-ink-soft">
            Campos em branco ficam como “—” e não entram nas contas. Sem o limite, usamos{" "}
            {100 - MIN_ATTENDANCE_PCT}% do total de aulas (mínimo de {MIN_ATTENDANCE_PCT}% de
            presença), se o total for informado.
          </p>
        </div>
      )}

      {/* ETAPA 3: Dias e horários */}
      {step === 3 && (
        <div className="space-y-4 pt-1">
          <div>
            <h3 className="text-base font-semibold text-ink">Dias da semana</h3>
            <p className="mt-0.5 text-xs text-ink-soft">
              Selecione os dias em que a disciplina acontece.
            </p>
            <div className="mt-2.5 grid grid-cols-7 gap-1.5">
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
                      "min-h-11 rounded-xl text-xs font-medium transition-colors",
                      on
                        ? "bg-brand text-brand-on font-semibold shadow-sm"
                        : "bg-paper text-ink-soft hover:text-ink",
                    )}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-soft">Aulas por encontro</p>
            <div className="mt-2 grid grid-cols-2 divide-x divide-line rounded-2xl border border-line bg-paper/60 overflow-hidden">
              <button
                type="button"
                onClick={() => handleSelectDuration(1)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3.5 text-center transition-colors hover:bg-surface/50",
                  classCount === 1 ? "bg-surface/30" : "",
                )}
              >
                <span className="text-xs font-medium text-ink-soft">1 aula</span>
                <span className="my-0.5 text-xl font-bold tracking-tight text-ink">1h45</span>
                <span className="text-[11px] text-ink-soft">Sem intervalo</span>
                {classCount === 1 && (
                  <div className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleSelectDuration(2)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3.5 text-center transition-colors hover:bg-surface/50",
                  classCount === 2 ? "bg-surface/30" : "",
                )}
              >
                <span className="text-xs font-medium text-ink-soft">2 aulas</span>
                <span className="my-0.5 text-xl font-bold tracking-tight text-ink">3h30</span>
                <span className="text-[11px] text-ink-soft">Intervalo de 30 min</span>
                {classCount === 2 && (
                  <div className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              {classCount === 1
                ? "Duração total: 1h45, sem intervalo."
                : "Duração total: 3h30, intervalo de 30 min."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Início da aula" error={errors.schedule}>
              <input
                type="time"
                className={inputClass}
                value={values.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                aria-invalid={invalid("schedule")}
              />
            </Field>
            <Field label="Término da aula">
              <input
                type="time"
                className={inputClass}
                value={values.endTime}
                onChange={(e) => setValues((v) => ({ ...v, endTime: e.target.value }))}
                aria-invalid={invalid("schedule")}
              />
            </Field>
          </div>

          <p className="text-xs leading-relaxed text-ink-soft">
            O término é calculado pelo início. Você pode editar esse horário para aulas especiais.
          </p>

          <p className="text-xs leading-relaxed text-ink-soft">
            Sem horário, a disciplina não aparece em Hoje nem no Calendário.
          </p>
        </div>
      )}

      {/* Ações / Botões de Navegação */}
      <div className="sticky bottom-0 -mx-6 mt-6 grid grid-cols-2 gap-3 border-t border-line bg-surface px-6 pb-2 pt-4">
        {step === 1 && (
          <>
            <Button variant="secondary" onClick={onCancel} className="w-full">
              Cancelar
            </Button>
            <Button type="button" onClick={handleContinueStep1} className="w-full">
              Continuar
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button variant="secondary" onClick={() => setStep(1)} className="w-full">
              Voltar
            </Button>
            <Button type="button" onClick={handleContinueStep2} className="w-full">
              Continuar
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <Button variant="secondary" onClick={() => setStep(2)} className="w-full">
              Voltar
            </Button>
            <Button type="submit" className="w-full text-center leading-tight">
              {submitLabel}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

export { FormularioDisciplina as SubjectForm };