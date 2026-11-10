import type { AttendanceStatus } from "@/types";
import { cn } from "@/lib/cn";
import { STATUS_META } from "@/components/ui/attendance-status";

interface AttendanceButtonProps {
  status: AttendanceStatus;
  selected: boolean;
  onClick: () => void;
}

/** Botão de um registro de presença. Seleção = anel + aria-pressed (não depende só da cor). */
export function BotaoPresenca({ status, selected, onClick }: AttendanceButtonProps) {
  const { label, Icon } = STATUS_META[status];
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 rounded-xl bg-surface px-3 text-[13px] font-medium transition-colors active:bg-line",
        selected ? "text-brand ring-2 ring-inset ring-brand" : "text-ink hover:bg-line/60",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

export { BotaoPresenca as AttendanceButton };
