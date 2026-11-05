import { Info } from "lucide-react";

export function SubjectsNote() {
  return (
    <p className="mt-6 flex items-start gap-3 text-[11px] leading-relaxed text-ink-soft">
      <Info className="h-[17px] w-[17px] shrink-0" aria-hidden />
      A frequência considera as aulas dadas. O limite de faltas considera o semestre completo.
    </p>
  );
}
