import type { ReactNode } from "react";

/** Valor numérico ou "—" quando ausente (nunca zero). O traço é lido como "não informado". */
export function Value({ value, children }: { value: number | null; children?: ReactNode }) {
  if (value === null) {
    return (
      <>
        <span aria-hidden>—</span>
        <span className="sr-only">não informado</span>
      </>
    );
  }
  return <>{children ?? value}</>;
}
