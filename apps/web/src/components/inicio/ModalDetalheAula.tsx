import Link from "next/link";
import { BookOpen, Calculator, Clock, MapPin, User } from "lucide-react";
import type { AttendanceStats, AttendanceStatus, ClassSession } from "@/types";
import { formatPct } from "@/lib/format";
import { EstatisticasFaltas } from "@/components/frequencia/EstatisticasFaltas";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ControlesFrequencia } from "./ControlesFrequencia";

interface ClassDetailSheetProps {
  session: ClassSession | null;
  stats?: AttendanceStats;
  onClose: () => void;
  onMark: (session: ClassSession, status: AttendanceStatus) => void;
}

export function ModalDetalheAula({ session, stats, onClose, onMark }: ClassDetailSheetProps) {
  return (
    <Sheet open={session !== null} onClose={onClose} title={session?.name ?? ""}>
      {session && stats && (
        <div className="space-y-5">
          <ul className="space-y-1.5 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" aria-hidden />
              {session.startTime} às {session.endTime}
            </li>
            {session.room && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {session.room}
              </li>
            )}
            {session.teacher && (
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" aria-hidden />
                {session.teacher}
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
            <EstatisticasFaltas
              allowed={stats.limit}
              used={stats.absences}
              remaining={stats.remaining}
              situation={stats.situation}
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Como foi sua presença?</p>
            <ControlesFrequencia variant="full" status={session.status} onChange={(s) => onMark(session, s)} />
          </div>

          <div className="grid gap-2 border-t border-line pt-4">
            <Link href={`/simulador?materia=${session.subjectId}`} className={buttonStyles("secondary", "w-full")}>
              <Calculator className="h-4 w-4" aria-hidden />
              Simular faltas
            </Link>
            <Link href={`/disciplinas?foco=${session.subjectId}`} className={buttonStyles("ghost", "w-full")}>
              <BookOpen className="h-4 w-4" aria-hidden />
              Ver em Disciplinas
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}

export { ModalDetalheAula as ClassDetailSheet };
