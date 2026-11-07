import type { SubmitStatus } from "@/hooks/useDemoSubmit";

interface SubmitButtonProps {
  status: SubmitStatus;
  idleLabel: string;
  loadingLabel: string;
  doneLabel: string;
}

/** Botão principal: 50 px, largura total. No carregamento mantém tamanho e fica indisponível (sem envio duplo). */
export function SubmitButton({ status, idleLabel, loadingLabel, doneLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={status !== "idle"}
      aria-busy={status === "loading"}
      className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-4 text-sm font-medium text-brand-on transition-colors hover:bg-brand-deep active:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-80"
    >
      {status === "loading" && (
        <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-brand-on/30 border-t-brand-on" />
      )}
      {status === "idle" ? idleLabel : status === "loading" ? loadingLabel : doneLabel}
    </button>
  );
}
