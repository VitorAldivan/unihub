import type { AttendanceSituation } from "@/types";
import { MIN_ATTENDANCE_PCT } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { SITUATION_META } from "./situation";

interface ProgressBarProps {
  /** null = sem dado: mostra só o trilho e descreve "Sem registros" para leitores de tela. */
  value: number | null;
  label: string;
  /** Sem situação, o preenchimento usa o azul-ciano de destaque. */
  situation?: AttendanceSituation | null;
  /** Marca do mínimo de presença (75%). */
  showThreshold?: boolean;
  /** sm = 4px (telas Hoje e Disciplinas) · md = 10px */
  size?: "sm" | "md";
}

export function ProgressBar({ value, label, situation, showThreshold = true, size = "md" }: ProgressBarProps) {
  const pct = value === null ? 0 : Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(value === null ? { "aria-valuetext": "Sem registros" } : { "aria-valuenow": Math.round(pct) })}
      className={cn("relative w-full rounded-full bg-line", size === "sm" ? "h-1" : "h-2.5")}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          situation ? SITUATION_META[situation].fill : "bg-brand",
        )}
        style={{ width: `${pct}%` }}
      />
      {showThreshold && (
        <span
          aria-hidden
          className="absolute -bottom-1 -top-1 w-0.5 -translate-x-1/2 rounded-full bg-ink"
          style={{ left: `${MIN_ATTENDANCE_PCT}%` }}
        />
      )}
    </div>
  );
}
