import type { AttendanceSituation } from "@/types";
import { cn } from "@/lib/cn";
import { SITUATION_META } from "./situation";

/** Selo de situação (cápsula com ponto): Seguro, Cuidado ou Crítico. */
export function Badge({ situation }: { situation?: AttendanceSituation | null }) {
  if (!situation) return null;
  const { label, badge, dot } = SITUATION_META[situation];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold leading-none",
        badge,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
