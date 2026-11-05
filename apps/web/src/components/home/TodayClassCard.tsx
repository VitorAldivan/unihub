import { CalendarX2, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";
import type { AttendanceSituation, AttendanceStatus, Subject } from "@/types";
import { cn } from "@/lib/cn";
import { SITUATION_META } from "@/components/ui/situation";

const OPTIONS: { value: AttendanceStatus; label: string; Icon: LucideIcon; active: string }[] = [
  { value: "present", label: "Presente", Icon: CheckCircle2, active: "bg-safe-soft text-safe-ink ring-1 ring-safe" },
  { value: "absent", label: "Faltei", Icon: XCircle, active: "bg-crit-soft text-crit-ink ring-1 ring-crit" },
  { value: "cancelled", label: "Cancelada", Icon: CalendarX2, active: "bg-ink/10 text-ink ring-1 ring-ink/40" },
];

interface TodayClassCardProps {
  subject: Subject;
  situation: AttendanceSituation;
  status?: AttendanceStatus;
  onMark: (status: AttendanceStatus) => void;
}

export function TodayClassCard({ subject, situation, status, onMark }: TodayClassCardProps) {
  const details = [subject.room, subject.teacher && `prof. ${subject.teacher}`].filter(Boolean).join(", ");

  return (
    <li className="relative rounded-card border border-line bg-surface p-4">
      <span
        aria-hidden
        className={cn("absolute inset-y-4 left-0 w-1 rounded-r-full", SITUATION_META[situation].fill)}
      />
      <div className="flex gap-4 pl-1">
        <div className="w-12 shrink-0 text-center">
          <p className="font-display text-lg font-bold leading-none">{subject.startTime}</p>
          <p className="mt-1 text-xs text-ink-soft">{subject.endTime}</p>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight">{subject.name}</h3>
          {details && <p className="mt-0.5 truncate text-sm text-ink-soft">{details}</p>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label={`Registrar presença em ${subject.name}`}>
        {OPTIONS.map(({ value, label, Icon, active }) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            onClick={() => onMark(value)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs font-semibold transition-colors",
              status === value ? active : "bg-paper text-ink-soft hover:bg-ink/[0.07]",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>
    </li>
  );
}
