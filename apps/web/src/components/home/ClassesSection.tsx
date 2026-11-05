import Link from "next/link";
import { NotebookPen } from "lucide-react";
import type { AttendanceStatus, ClassSession } from "@/types";
import type { SessionPhase } from "@/lib/schedule";
import { formatClassCount } from "@/lib/format";
import { Button, buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClassListItem } from "./ClassListItem";
import { NextClassCard } from "./NextClassCard";

interface ClassesSectionProps {
  sessions: ClassSession[];
  featured: { session: ClassSession; phase: SessionPhase } | null;
  hasSubjects: boolean;
  onMark: (session: ClassSession, status: AttendanceStatus) => void;
  onOpenDetails: (session: ClassSession) => void;
  onLoadDemo: () => void;
}

/** "Aulas de hoje": cartão em destaque + lista compacta. Cresce com qualquer quantidade de aulas. */
export function ClassesSection({
  sessions,
  featured,
  hasSubjects,
  onMark,
  onOpenDetails,
  onLoadDemo,
}: ClassesSectionProps) {
  const others = sessions.filter((s) => s.id !== featured?.session.id);

  return (
    <section aria-labelledby="classes-title" className="mt-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="classes-title" className="text-xl font-medium">
          Aulas de hoje
        </h2>
        <span className="text-[13px] text-brand">{formatClassCount(sessions.length)}</span>
      </div>

      <div className="mt-4">
        {!hasSubjects ? (
          <EmptyState
            icon={NotebookPen}
            title="Nenhuma disciplina ainda"
            text="Cadastre as matérias do semestre para registrar presença e acompanhar suas faltas."
          >
            <Link href="/disciplinas" className={buttonStyles("primary")}>
              Adicionar disciplina
            </Link>
            <Button variant="ghost" onClick={onLoadDemo}>
              Carregar dados de exemplo
            </Button>
          </EmptyState>
        ) : sessions.length === 0 ? (
          <p className="rounded-card border border-dashed border-line px-5 py-8 text-center text-sm text-ink-soft">
            Você não tem aulas hoje.
          </p>
        ) : (
          <>
            {featured && (
              <NextClassCard
                session={featured.session}
                phase={featured.phase}
                onMark={(status) => onMark(featured.session, status)}
              />
            )}
            {others.length > 0 && (
              <ul className={featured ? "mt-3" : undefined}>
                {others.map((session) => (
                  <ClassListItem key={session.id} session={session} onOpen={() => onOpenDetails(session)} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
