import type { AttendanceSituation } from "@/types";
import { SITUATION_META } from "@/components/ui/situation";
import { Value } from "@/components/ui/Dash";
import { cn } from "@/lib/cn";

interface AbsenceStatsProps {
  allowed: number | null;
  used: number | null;
  remaining: number | null;
  situation: AttendanceSituation | null;
  /** Valores de antes (usado no simulador para comparar). */
  previous?: { used: number | null; remaining: number | null };
}

/** Os 3 números essenciais: faltas permitidas, usadas e restantes. "—" quando não informado. */
export function AbsenceStats({ allowed, used, remaining, situation, previous }: AbsenceStatsProps) {
  const shown = remaining === null ? null : Math.max(0, remaining);
  const before = (v: number | null) => (previous && v !== null ? `antes ${v}` : undefined);

  const tiles = [
    { label: "Permitidas", value: allowed, note: undefined, tone: "" },
    { label: "Usadas", value: used, note: before(previous?.used ?? null), tone: "" },
    {
      label: "Restam",
      value: shown,
      note: before(previous?.remaining === null || previous?.remaining === undefined ? null : Math.max(0, previous.remaining)),
      tone: situation ? SITUATION_META[situation].text : "",
    },
  ];

  return (
    <div>
      <dl className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-line bg-paper px-3 py-2.5">
            <dt className="text-xs text-ink-soft">{t.label}</dt>
            <dd className={cn("text-2xl font-semibold", t.tone)}>
              <Value value={t.value} />
            </dd>
            {t.note && <p className="text-[11px] text-ink-soft">{t.note}</p>}
          </div>
        ))}
      </dl>
      {remaining !== null && remaining < 0 && (
        <p className="mt-2 text-xs font-medium text-crit-ink">Limite de faltas excedido em {Math.abs(remaining)}.</p>
      )}
    </div>
  );
}
