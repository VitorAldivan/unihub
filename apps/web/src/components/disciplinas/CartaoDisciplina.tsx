import { Clock, MapPin, Trash2, User } from "lucide-react";
import type { AttendanceStats, Subject } from "@/types";
import { cn } from "@/lib/cn";
import { formatPct, formatTimeRange, formatWeekdays } from "@/lib/format";
import { EstatisticasFaltas } from "@/components/frequencia/EstatisticasFaltas";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface SubjectCardProps {
  subject: Subject;
  stats: AttendanceStats;
  highlighted?: boolean;
  onDelete: () => void;
}

export function CartaoDisciplina({ subject, stats, highlighted, onDelete }: SubjectCardProps) {
  return (
    <article
      id={`subject-${subject.id}`}
      className={cn("scroll-mt-4 rounded-card border border-line bg-surface p-5", highlighted && "ring-2 ring-brand")}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold leading-tight">{subject.name}</h3>
        {stats.situation && <Badge situation={stats.situation} />}
      </header>

      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
        {subject.teacher && (
          <li className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" aria-hidden />
            {subject.teacher}
          </li>
        )}
        {subject.room && (
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            {subject.room}
          </li>
        )}
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          {formatWeekdays(subject.weekdays)}, {formatTimeRange(subject.startTime, subject.endTime)}
        </li>
      </ul>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-ink-soft">Frequência</span>
          <span className="font-display text-2xl font-bold">{formatPct(stats.frequency)}</span>
        </div>
        <ProgressBar value={stats.frequency} situation={stats.situation} label={`Frequência em ${subject.name}`} />
      </div>

      <div className="mt-5">
        <EstatisticasFaltas
          allowed={stats.limit}
          used={stats.absences}
          remaining={stats.remaining}
          situation={stats.situation}
        />
      </div>

      {subject.totalClasses && (
        <p className="mt-3 text-xs text-ink-soft">
          Total de {subject.totalClasses} aulas estimado pelo seu horário.
        </p>
      )}

      <div className="mt-2 flex justify-end">
        <Button variant="danger" onClick={onDelete} aria-label={`Excluir ${subject.name}`}>
          <Trash2 className="h-4 w-4" aria-hidden />
          Excluir
        </Button>
      </div>
    </article>
  );
}

export { CartaoDisciplina as SubjectCard };
