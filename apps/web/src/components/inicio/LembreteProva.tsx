import { CalendarClock } from "lucide-react";

interface ExamReminderProps {
  title: string;
  detail: string;
}

/** Lembrete da próxima avaliação. Faz parte do fluxo rolável, depois das aulas. */
export function LembreteProva({ title, detail }: ExamReminderProps) {
  return (
    <section aria-label="Próxima avaliação" className="mt-6 border-t border-line pt-5">
      <div className="flex items-start gap-3.5">
        <CalendarClock className="mt-0.5 h-[22px] w-[22px] shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
        <div className="min-w-0">
          <p className="break-words text-[13px] font-semibold">{title}</p>
          {detail && <p className="mt-1 break-words text-[11px] text-ink-soft">{detail}</p>}
        </div>
      </div>
    </section>
  );
}

export { LembreteProva as ExamReminder };
