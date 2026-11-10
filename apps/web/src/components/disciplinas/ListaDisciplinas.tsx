import type { AttendanceStats, Subject } from "@/types";
import { Button } from "@/components/ui/Button";
import { ItemDisciplina } from "./ItemDisciplina";

interface SubjectListProps {
  subjects: Subject[];
  stats: Record<string, AttendanceStats>;
  focusId: string | null;
  /** false = não há disciplina em nenhum semestre (primeiro uso). */
  hasAnySubjects: boolean;
  onOpen: (subject: Subject) => void;
  onLoadDemo: () => void;
}

/** Cresce com qualquer quantidade de disciplinas: quem rola é a página, não a lista. */
export function ListaDisciplinas({ subjects, stats, focusId, hasAnySubjects, onOpen, onLoadDemo }: SubjectListProps) {
  if (subjects.length === 0) {
    return (
      <div className="mt-6 border-t border-line py-10 text-center">
        <p className="text-[15px] font-medium">Nenhuma disciplina neste semestre.</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[13px] text-ink-soft">
          Adicione sua primeira disciplina para acompanhar a frequência.
        </p>
        {!hasAnySubjects && (
          <Button variant="ghost" className="mt-4" onClick={onLoadDemo}>
            Carregar dados de exemplo
          </Button>
        )}
      </div>
    );
  }

  return (
    <ul className="mt-6 border-t border-line">
      {subjects.map((subject) => (
        <ItemDisciplina
          key={subject.id}
          subject={subject}
          stats={stats[subject.id]}
          highlighted={focusId === subject.id}
          onOpen={() => onOpen(subject)}
        />
      ))}
    </ul>
  );
}

export { ListaDisciplinas as SubjectList };
