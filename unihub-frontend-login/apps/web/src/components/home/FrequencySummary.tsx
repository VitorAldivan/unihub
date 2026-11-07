import { TrendingUp } from "lucide-react";
import { displayPct } from "@/lib/format";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface FrequencySummaryProps {
  semester: string;
  /** Frequência média geral (0–100) ou null quando não há disciplinas. */
  frequency: number | null;
}

export function FrequencySummary({ semester, frequency }: FrequencySummaryProps) {
  // Número e barra usam o MESMO valor (arredondado para baixo), sem divergência.
  const pct = frequency === null ? null : displayPct(frequency);

  return (
    <section aria-label="Frequência média geral no semestre" className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Semestre {semester}</p>
        <TrendingUp className="h-4 w-4 text-brand" aria-hidden />
      </div>

      <div className="mt-4 flex items-end gap-4">
        <p className="flex items-baseline leading-none" aria-hidden>
          <span className="text-[72px] font-medium tracking-tight">{pct ?? "—"}</span>
          {pct !== null && <span className="text-[28px] font-medium text-brand">%</span>}
        </p>
        <p className="pb-2.5 text-[13px] leading-snug text-ink-soft">
          Frequência
          <span className="block">média geral</span>
        </p>
      </div>
      {/* Para leitores de tela: o valor é lido uma vez, pela barra. */}
      <div className="mt-4">
        <ProgressBar
          value={pct ?? 0}
          label={pct === null ? "Frequência média geral: sem dados" : "Frequência média geral"}
          size="sm"
          showThreshold={false}
        />
      </div>
      {pct === null && <p className="mt-3 text-sm text-ink-soft">Cadastre disciplinas para ver sua frequência.</p>}
    </section>
  );
}
