import { useId } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import type { AttendanceStats, Subject } from "@/types";
import { cn } from "@/lib/cn";
import { describeAbsenceSummary } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { SubjectMetrics } from "./SubjectMetrics";

interface SubjectItemProps {
  subject: Subject;
  stats: AttendanceStats;
  highlighted?: boolean;
  onOpen: () => void;
}

/** Bloco aberto sobre o fundo, separado dos outros por uma linha (sem cartão, borda arredondada ou sombra). */
export function SubjectItem({ subject, stats, highlighted, onOpen }: SubjectItemProps) {
  const headingId = useId();

  return (
    <li
      id={`subject-${subject.id}`}
      className={cn(
        "scroll-mt-4 border-b border-line py-6",
        highlighted && "rounded-xl outline outline-1 outline-offset-4 outline-brand-line",
      )}
    >
      <article aria-labelledby={headingId}>
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={headingId} className="break-words text-[22px] font-semibold leading-[1.2]">
              {subject.name}
            </h2>
            {subject.teacher && <p className="mt-2 break-words text-xs text-ink-soft">{subject.teacher}</p>}
            {subject.room && (
              <p className="mt-2 flex items-start gap-1.5 break-words text-xs text-ink-soft">
                <MapPin className="h-[15px] w-[15px] shrink-0" aria-hidden />
                {subject.room}
              </p>
            )}
          </div>
          {stats.situation && <Badge situation={stats.situation} />}
        </header>

        <SubjectMetrics name={subject.name} stats={stats} />

        {/* Único botão do bloco: sem botões aninhados. Área de toque de 44 px mesmo com texto pequeno. */}
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="-mb-2 mt-3 flex min-h-11 w-full items-center justify-between gap-3 text-left"
        >
          <span className="sr-only">Ver detalhes de {subject.name}. </span>
          <span className="min-w-0 break-words text-[10px] leading-snug text-ink-soft">
            {describeAbsenceSummary(stats.absences, stats.limit)}
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-brand" aria-hidden />
        </button>
      </article>
    </li>
  );
}
