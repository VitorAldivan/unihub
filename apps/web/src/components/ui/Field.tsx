import type { ReactNode } from "react";

export const inputClass =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-base text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

/** Rótulo + controle + dica/erro. O <label> envolve o controle (associação implícita). */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-xs font-medium text-crit-ink">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-ink-soft">{hint}</span>
      )}
    </label>
  );
}
