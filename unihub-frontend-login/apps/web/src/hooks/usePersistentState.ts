"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useState que persiste em localStorage.
 * `hydrated` fica true depois da leitura inicial — evita "piscar" estado vazio.
 * `migrate` (opcional) converte dados salvos por versões antigas no formato atual.
 * TODO(Fase 1): trocar por TanStack Query + API (ver docs/tech-debt.md).
 */
export function usePersistentState<T>(key: string, initial: T, migrate?: (raw: unknown) => T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const migrateRef = useRef(migrate);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        setValue(migrateRef.current ? migrateRef.current(parsed) : (parsed as T));
      }
    } catch {
      /* JSON corrompido ou storage bloqueado: segue com o valor inicial */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage cheio/bloqueado */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
