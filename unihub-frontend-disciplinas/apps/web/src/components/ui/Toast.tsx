/** Confirmação discreta acima da barra inferior. Não ocupa espaço no fluxo (não desloca o conteúdo). */
export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-6"
    >
      {message && (
        <p className="animate-fade-in rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper">{message}</p>
      )}
    </div>
  );
}
