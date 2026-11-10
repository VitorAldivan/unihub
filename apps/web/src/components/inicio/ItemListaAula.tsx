import { ChevronRight } from "lucide-react";
import type { ClassSession } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { STATUS_META } from "@/components/ui/attendance-status";

interface ClassListItemProps {
  session: ClassSession;
  onOpen: () => void;
}

/** Item compacto. Abre os detalhes e os controles de presença em um painel. */
export function ItemListaAula({ session, onOpen }: ClassListItemProps) {
  const details = [session.room, session.teacher].filter(Boolean).join(" · ");
  const status = session.status ? STATUS_META[session.status] : null;

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex w-full items-start gap-3 rounded-xl py-3 text-left transition-colors hover:bg-ink/5"
      >
        <span className="w-[50px] shrink-0">
          <span className="block text-lg font-medium leading-none">{session.startTime}</span>
          <span className="mt-1.5 block text-[11px] text-ink-soft">– {session.endTime}</span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block break-words text-lg font-semibold leading-tight">{session.name}</span>
          {details && <span className="mt-1 block break-words text-xs text-ink-soft">{details}</span>}
          {status && (
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand">
              <status.Icon className="h-3.5 w-3.5" aria-hidden />
              {status.label}
            </span>
          )}
        </span>

        <span className="flex shrink-0 items-center gap-2 self-stretch">
          {session.situation && (
            <span className="self-start pt-0.5">
              <Badge situation={session.situation} />
            </span>
          )}
          <ChevronRight className="h-5 w-5 text-ink-soft" aria-hidden />
          <span className="sr-only">Ver detalhes de {session.name}</span>
        </span>
      </button>
    </li>
  );
}

export { ItemListaAula as ClassListItem };
