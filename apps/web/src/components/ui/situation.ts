import { CircleAlert, CircleCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import type { AttendanceSituation } from "@/types";

/** Única fonte de cor/rótulo/ícone por situação. O rótulo em texto sempre acompanha a cor. */
export const SITUATION_META: Record<
  AttendanceSituation,
  { label: string; Icon: LucideIcon; badge: string; dot: string; fill: string; text: string }
> = {
  SAFE: {
    label: "Seguro",
    Icon: CircleCheck,
    badge: "bg-safe-soft text-safe-ink",
    dot: "bg-safe",
    fill: "bg-safe",
    text: "text-safe-ink",
  },
  WARNING: {
    label: "Cuidado",
    Icon: CircleAlert,
    badge: "bg-warn-soft text-warn-ink",
    dot: "bg-warn",
    fill: "bg-warn",
    text: "text-warn-ink",
  },
  CRITICAL: {
    label: "Crítico",
    Icon: TriangleAlert,
    badge: "bg-crit-soft text-crit-ink",
    dot: "bg-crit",
    fill: "bg-crit",
    text: "text-crit-ink",
  },
};
