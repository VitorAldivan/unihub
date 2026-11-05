"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Calculator, BookOpen, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import type { Subject } from "@/types";
import { useAcademic } from "@/context/AcademicProvider";
import { formatDayHeading, formatMonthTitle, isSameDay, toISODate } from "@/lib/calendar";
import { REMINDER_KINDS } from "@/lib/constants";
import { formatTimeRange } from "@/lib/format";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { ReminderForm } from "@/components/calendar/ReminderForm";
import { buttonStyles } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

export default function CalendarPage() {
  const { subjects, reminders, addReminder, removeReminder } = useAcademic();

  const [today] = useState(() => new Date());
  const [selected, setSelected] = useState(today);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [reminderOpen, setReminderOpen] = useState(false);
  const [picked, setPicked] = useState<Subject | null>(null);

  const selectedISO = toISODate(selected);
  const markedDates = useMemo(() => new Set(reminders.map((r) => r.date)), [reminders]);
  const dayReminders = reminders.filter((r) => r.date === selectedISO);
  const dayClasses = subjects
    .filter((s) => s.weekdays.includes(selected.getDay()))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const viewingCurrentMonth = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  function goToMonth(delta: number) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  function goToToday() {
    setView(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Metade de cima: calendário */}
      <section className="shrink-0 px-5 pb-4 pt-5" aria-label="Calendário">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">{formatMonthTitle(view)}</h1>
          <div className="flex items-center gap-1">
            {!viewingCurrentMonth && (
              <button
                type="button"
                onClick={goToToday}
                className="mr-1 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand"
              >
                Hoje
              </button>
            )}
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Mês anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label="Próximo mês"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
        <MonthGrid
          year={view.getFullYear()}
          month={view.getMonth()}
          selected={selected}
          today={today}
          markedDates={markedDates}
          onSelect={setSelected}
        />
      </section>

      {/* Metade de baixo: o dia escolhido, com rolagem própria */}
      <section
        className="flex min-h-0 flex-1 flex-col rounded-t-[28px] border-t border-line bg-surface"
        aria-label={`Agenda de ${formatDayHeading(selected)}`}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="font-display text-lg font-bold">
            {formatDayHeading(selected)}
            {isSameDay(selected, today) && <span className="ml-2 text-sm font-medium text-ink-soft">hoje</span>}
          </h2>
          <button
            type="button"
            onClick={() => setReminderOpen(true)}
            aria-label="Adicionar lembrete"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-on hover:bg-brand-deep"
          >
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pb-6">
          {dayReminders.map((r) => {
            const linked = subjects.find((s) => s.id === r.subjectId);
            return (
              <div key={r.id} className="flex items-center gap-3 rounded-xl bg-brand-soft px-4 py-3">
                <Bell className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand">{r.title}</p>
                  <p className="text-xs text-ink-soft">
                    {REMINDER_KINDS.find((k) => k.value === r.kind)?.label}
                    {linked ? `, ${linked.name}` : ""}
                    {r.time ? `, ${r.time}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeReminder(r.id)}
                  aria-label={`Excluir lembrete ${r.title}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-ink/10"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            );
          })}

          {dayClasses.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setPicked(s)}
              className="flex w-full items-center gap-4 rounded-xl border border-line px-4 py-3 text-left hover:bg-paper"
            >
              <span className="w-12 shrink-0 text-center font-display text-base font-bold">{s.startTime}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{s.name}</span>
                <span className="block truncate text-xs text-ink-soft">
                  {[s.room, formatTimeRange(s.startTime, s.endTime)].filter(Boolean).join(", ")}
                </span>
              </span>
            </button>
          ))}

          {dayReminders.length === 0 && dayClasses.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-soft">
              {subjects.length === 0
                ? "Cadastre disciplinas para ver suas aulas aqui."
                : "Nada marcado para este dia. Toque em + para criar um lembrete."}
            </p>
          )}
        </div>
      </section>

      <Sheet open={reminderOpen} onClose={() => setReminderOpen(false)} title="Novo lembrete">
        <ReminderForm
          defaultDate={selectedISO}
          subjects={subjects}
          onSubmit={(input) => {
            addReminder(input);
            setReminderOpen(false);
            const day = new Date(`${input.date}T00:00:00`);
            setSelected(day);
            setView(new Date(day.getFullYear(), day.getMonth(), 1));
          }}
        />
      </Sheet>

      <Sheet open={picked !== null} onClose={() => setPicked(null)} title={picked?.name ?? ""}>
        {picked && (
          <div className="space-y-2">
            <Link href={`/simulador?materia=${picked.id}`} className={buttonStyles("primary", "w-full")}>
              <Calculator className="h-4 w-4" aria-hidden />
              Simular faltas
            </Link>
            <Link href={`/disciplinas?foco=${picked.id}`} className={buttonStyles("secondary", "w-full")}>
              <BookOpen className="h-4 w-4" aria-hidden />
              Ver em Disciplinas
            </Link>
          </div>
        )}
      </Sheet>
    </div>
  );
}
