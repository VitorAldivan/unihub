"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, CalendarDays, Clock, MapPin, Trash2, User } from "lucide-react";
import type { AttendanceStats, Subject } from "@/types";
import { describeAbsenceSummary, formatPct, formatTimeRange, formatWeekdays } from "@/lib/format";
import { AbsenceStats } from "@/components/attendance/AbsenceStats";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Value } from "@/components/ui/Dash";
import { Sheet } from "@/components/ui/Sheet";

interface SubjectDetailSheetProps {
  subject: Subject | null;
  stats?: AttendanceStats;
  onClose: () => void;
  onDelete: (subject: Subject) => void;
}

/** Painel local com as informações da disciplina (sem tela nova). */
export function SubjectDetailSheet({ subject, stats, onClose, onDelete }: SubjectDetailSheetProps) {
  return (
    <Sheet open={subject !== null} onClose={onClose} title={subject?.name ?? ""}>
      {subject && stats && <Body key={subject.id} subject={subject} stats={stats} onDelete={onDelete} />}
    </Sheet>
  );
}

function Body({
  subject,
  stats,
  onDelete,
}: {
  subject: Subject;
  stats: AttendanceStats;
  onDelete: (subject: Subject) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-5">
      <ul className="space-y-1.5 text-sm text-ink-soft">
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
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          Semestre {subject.semester}
        </li>
        {subject.weekdays.length > 0 && (
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
            {formatWeekdays(subject.weekdays)}, {formatTimeRange(subject.startTime, subject.endTime)}
          </li>
        )}
      </ul>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="text-ink-soft">
            Frequência{" "}
            <strong className="font-semibold text-ink">
              {stats.frequency === null ? "sem registros" : formatPct(stats.frequency)}
            </strong>
          </span>
          {stats.situation && <Badge situation={stats.situation} />}
        </div>
        <AbsenceStats
          allowed={stats.limit}
          used={stats.absences}
          remaining={stats.remaining}
          situation={stats.situation}
        />
        <dl className="mt-2 grid grid-cols-2 gap-2">
          {[
            { label: "Total de aulas", value: stats.total },
            { label: "Aulas dadas", value: stats.held },
          ].map((t) => (
            <div key={t.label} className="rounded-xl border border-line bg-paper px-3 py-2.5">
              <dt className="text-xs text-ink-soft">{t.label}</dt>
              <dd className="text-2xl font-semibold">
                <Value value={t.value} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-ink-soft">{describeAbsenceSummary(stats.absences, stats.limit)}</p>
      </div>

      <div className="grid gap-2 border-t border-line pt-4">
        <Link href={`/simulador?materia=${subject.id}`} className={buttonStyles("secondary", "w-full")}>
          <Calculator className="h-4 w-4" aria-hidden />
          Simular faltas
        </Link>

        {confirming ? (
          <div className="rounded-xl border border-crit/40 bg-crit-soft p-4">
            <p className="text-sm">
              Excluir “{subject.name}”? Os registros de presença dela também serão apagados.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => onDelete(subject)}>
                Excluir
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" className="w-full" onClick={() => setConfirming(true)}>
            <Trash2 className="h-4 w-4" aria-hidden />
            Excluir disciplina
          </Button>
        )}
      </div>
    </div>
  );
}
