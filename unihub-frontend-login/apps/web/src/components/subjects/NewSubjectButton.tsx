import { Plus } from "lucide-react";

export function NewSubjectButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-medium text-brand-on transition-colors hover:bg-brand-deep active:bg-brand-deep"
    >
      <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
      Nova disciplina
    </button>
  );
}
