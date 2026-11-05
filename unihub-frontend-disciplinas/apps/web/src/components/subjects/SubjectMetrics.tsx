import type { AttendanceStats } from "@/types";
import { displayPct, plural } from "@/lib/format";
import { Value } from "@/components/ui/Dash";
import { ProgressBar } from "@/components/ui/ProgressBar";

/** Frequência atual, faltas restantes, barra e as três contagens. Dado ausente = "—", nunca zero. */
export function SubjectMetrics({ name, stats }: { name: string; stats: AttendanceStats }) {
  // Valor do texto e da barra vêm da mesma informação (arredondada para baixo).
  const pct = stats.frequency === null ? null : displayPct(stats.frequency);
  const remaining = stats.remaining === null ? null : Math.max(0, stats.remaining);
  const counts = [
    { label: "Total", value: stats.total },
    { label: "Dadas", value: stats.held },
    { label: "Faltas", value: stats.absences },
  ];

  return (
    <>
      <div className="mt-5 flex items-stretch">
        <div className="min-w-0 flex-1 pr-4">
          <p className="flex items-baseline leading-none">
            <span className="text-[56px] font-medium tracking-tight">
              <Value value={pct} />
            </span>
            {pct !== null && <span className="text-[22px] font-medium text-brand">%</span>}
          </p>
          <p className="mt-2 text-[11px] text-ink-soft">{pct === null ? "Sem registros" : "de frequência atual"}</p>
        </div>

        <div className="w-[34%] shrink-0 border-l border-line pl-5">
          <p className="text-[36px] font-medium leading-none text-brand">
            <Value value={remaining} />
          </p>
          <p className="mt-2 break-words text-[11px] text-ink-soft">
            {plural(remaining ?? 0, "falta restante", "faltas restantes")}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar value={pct} label={`Frequência em ${name}`} size="sm" showThreshold={false} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        {counts.map((c) => (
          <div key={c.label}>
            <dt className="text-[10px] text-ink-soft">{c.label}</dt>
            <dd className="mt-1 text-xl font-medium leading-none">
              <Value value={c.value} />
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
