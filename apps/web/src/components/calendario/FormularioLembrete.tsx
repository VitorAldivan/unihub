"use client";

import { useState, type FormEvent } from "react";
import type { NewReminderInput, ReminderKind, Subject } from "@/types";
import { REMINDER_KINDS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";

interface ReminderFormProps {
  defaultDate: string;
  subjects: Subject[];
  onSubmit: (input: NewReminderInput) => void;
}

export function FormularioLembrete({ defaultDate, subjects, onSubmit }: ReminderFormProps) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ReminderKind>("exam");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [error, setError] = useState<string>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Digite o que você precisa lembrar.");
    if (!date) return setError("Escolha uma data.");
    onSubmit({ title: title.trim(), kind, date, time: time || undefined, subjectId: subjectId || undefined });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Lembrete" error={error}>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(undefined);
          }}
          placeholder="Ex.: Prova do capítulo 3"
          autoComplete="off"
        />
      </Field>

      <Segmented label="Tipo de lembrete" value={kind} onChange={setKind} options={REMINDER_KINDS} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Data">
          <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Horário (opcional)">
          <input type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </div>

      {subjects.length > 0 && (
        <Field label="Disciplina (opcional)">
          <select className={inputClass} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">Nenhuma</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Button type="submit" className="w-full">
        Salvar lembrete
      </Button>
    </form>
  );
}

export { FormularioLembrete as ReminderForm };
