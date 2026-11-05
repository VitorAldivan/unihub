"use client";

import { useState } from "react";
import { CircleCheck, CircleMinus } from "lucide-react";
import type { AttendanceStatus } from "@/types";
import { cn } from "@/lib/cn";
import { STATUS_META } from "@/components/ui/attendance-status";
import { Sheet } from "@/components/ui/Sheet";
import { AttendanceButton } from "./AttendanceButton";

interface AttendanceControlsProps {
  status?: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
  /** card: Presente/Faltei + diálogo "Justificada / Cancelada" · full: os quatro botões. */
  variant?: "card" | "full";
}

const EXTRA: { status: "justified" | "cancelled"; description: string }[] = [
  { status: "justified", description: "Você faltou, mas tem justificativa (atestado, por exemplo)." },
  { status: "cancelled", description: "A aula não aconteceu e não entra na conta da frequência." },
];

export function AttendanceControls({ status, onChange, variant = "card" }: AttendanceControlsProps) {
  const [extraOpen, setExtraOpen] = useState(false);

  if (variant === "full") {
    return (
      <div role="group" aria-label="Registrar presença" className="grid grid-cols-2 gap-2.5">
        {(["present", "absent", "justified", "cancelled"] as const).map((s) => (
          <AttendanceButton key={s} status={s} selected={status === s} onClick={() => onChange(s)} />
        ))}
      </div>
    );
  }

  const extraSelected = status === "justified" || status === "cancelled";

  return (
    <>
      <div role="group" aria-label="Registrar presença" className="grid grid-cols-2 gap-2.5">
        <AttendanceButton status="present" selected={status === "present"} onClick={() => onChange("present")} />
        <AttendanceButton status="absent" selected={status === "absent"} onClick={() => onChange("absent")} />
      </div>

      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setExtraOpen(true)}
        className={cn(
          "mx-auto mt-2 flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs transition-colors hover:text-ink",
          extraSelected ? "font-semibold text-brand" : "text-ink-soft",
        )}
      >
        {extraSelected ? (
          <>
            <CircleCheck className="h-4 w-4" aria-hidden />
            Marcada como {STATUS_META[status].label.toLowerCase()}
          </>
        ) : (
          <>
            <CircleMinus className="h-4 w-4" aria-hidden />
            Justificada / Cancelada
          </>
        )}
      </button>

      <Sheet open={extraOpen} onClose={() => setExtraOpen(false)} title="Outro registro">
        <p className="mb-4 text-sm text-ink-soft">Escolha o que aconteceu com esta aula.</p>
        <ul className="space-y-2.5">
          {EXTRA.map(({ status: option, description }) => {
            const { label, Icon } = STATUS_META[option];
            const selected = status === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    onChange(option);
                    setExtraOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl bg-paper p-4 text-left transition-colors",
                    selected ? "ring-2 ring-inset ring-brand" : "hover:bg-line/60",
                  )}
                >
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", selected ? "text-brand" : "text-ink-soft")} aria-hidden />
                  <span>
                    <span className={cn("block text-sm font-semibold", selected && "text-brand")}>{label}</span>
                    <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </>
  );
}
