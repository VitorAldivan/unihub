import { Ban, Check, FileCheck, X, type LucideIcon } from "lucide-react";
import type { AttendanceStatus } from "@/types";

/** Rótulo e ícone de cada registro de presença. */
export const STATUS_META: Record<AttendanceStatus, { label: string; Icon: LucideIcon }> = {
  present: { label: "Presente", Icon: Check },
  absent: { label: "Faltei", Icon: X },
  justified: { label: "Justificada", Icon: FileCheck },
  cancelled: { label: "Cancelada", Icon: Ban },
};
