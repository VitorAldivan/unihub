import type { ReactNode } from "react";
import type { AttendanceSituation } from "@/types";
import { MIN_ATTENDANCE_PCT } from "@/lib/constants";
import { formatPct } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface FrequencyCardProps {
  title: string;
  /** null = ainda não há disciplinas. */
  value: number | null;
  situation: AttendanceSituation | null;
  children?: ReactNode;
}

/** Cartão de frequência com a marca do mínimo de 75% (usado no Simulador). */
export function FrequencyCard({ title, value, situation, children }: FrequencyCardProps) {
  return (
    <section aria-label={title} className="rounded-[20px] bg-brand-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[13px] font-medium text-ink-soft">{title}</h2>
        {situation && <Badge situation={situation} />}
      </div>
      <p className="mt-2 text-[56px] font-medium leading-none tracking-tight">
        {value === null ? "—" : formatPct(value)}
      </p>
      {value !== null && situation && (
        <div className="mt-5">
          <ProgressBar value={value} situation={situation} label={title} />
          <p className="relative mt-2 h-4 text-xs text-ink-soft" aria-hidden>
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${MIN_ATTENDANCE_PCT}%` }}>
              mínimo {MIN_ATTENDANCE_PCT}%
            </span>
          </p>
        </div>
      )}
      {children && <div className="mt-3 space-y-1 text-sm text-ink-soft">{children}</div>}
    </section>
  );
}
