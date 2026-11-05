import { padCount, plural } from "@/lib/format";
import { SemesterSelect } from "./SemesterSelect";

interface SubjectsSummaryProps {
  count: number;
  semester: string;
  semesters: string[];
  onSemesterChange: (semester: string) => void;
}

/** "03 disciplinas" (calculado a partir do semestre selecionado) + seletor de semestre. */
export function SubjectsSummary({ count, semester, semesters, onSemesterChange }: SubjectsSummaryProps) {
  const label = plural(count, "disciplina", "disciplinas");
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-3" aria-live="polite">
        <span aria-hidden className="text-[52px] font-medium leading-none tabular-nums">
          {padCount(count)}
        </span>
        <span aria-hidden className="text-xs text-ink-soft">
          {label}
        </span>
        <span className="sr-only">
          {count} {label} no semestre {semester}
        </span>
      </p>
      <SemesterSelect value={semester} options={semesters} onChange={onSemesterChange} />
    </div>
  );
}
