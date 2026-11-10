import { useId } from "react";
import type { AttendanceStatus, ClassSession } from "@/types";
import type { SessionPhase } from "@/lib/schedule";
import { cn } from "@/lib/cn";
import { describeRemaining } from "@/lib/format";
import { SITUATION_META } from "@/components/ui/situation";
import { ControlesFrequencia } from "./ControlesFrequencia";

const PHASE_LABEL: Record<SessionPhase, string> = {
  upcoming: "Próxima aula",
  ongoing: "Em andamento",
  pending: "Aguardando registro",
};

interface NextClassCardProps {
  session: ClassSession;
  phase: SessionPhase;
  onMark: (status: AttendanceStatus) => void;
}

/** Cartão de maior destaque: a aula que pede atenção agora. */
export function CartaoProximaAula({ session, phase, onMark }: NextClassCardProps) {
  const headingId = useId();
  const details = [session.room, session.teacher].filter(Boolean).join(" · ");
  const meta = session.situation ? SITUATION_META[session.situation] : null;
  const Icon = meta?.Icon;

  return (
    <article aria-labelledby={headingId} className="rounded-[20px] bg-brand-soft p-[18px]">
      <div className="flex gap-3.5">
        <div className="w-[60px] shrink-0">
          <p className="text-[20px] font-medium leading-none text-brand">{session.startTime}</p>
          <p className="mt-1.5 text-xs text-ink-soft">– {session.endTime}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">{PHASE_LABEL[phase]}</p>
          <h3 id={headingId} className="mt-1 break-words text-[22px] font-semibold leading-[1.15]">
            {session.name}
          </h3>
          {details && <p className="mt-1.5 break-words text-xs text-ink-soft">{details}</p>}
        </div>
      </div>

      {meta && Icon && session.remaining !== null && (
        <p className={cn("mt-4 flex items-center gap-2 text-[13px]", meta.text)}>
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          {describeRemaining(session.remaining)}
        </p>
      )}

      <div className="mt-4 border-t border-brand-line pt-4">
        <p className="mb-3 text-[13px]">Como foi sua presença?</p>
        <ControlesFrequencia status={session.status} onChange={onMark} />
      </div>
    </article>
  );
}

export { CartaoProximaAula as NextClassCard };
