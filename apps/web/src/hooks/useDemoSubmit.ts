"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SubmitStatus = "idle" | "loading" | "done";

interface Options {
  /** Duração do carregamento simulado. */
  loadingMs?: number;
  /** Quanto tempo o feedback de conclusão fica visível antes de `onFinished`. */
  holdMs?: number;
}

/**
 * Envio DEMONSTRATIVO: simula o carregamento (loading) e o feedback (done).
 * Nada é enviado a lugar nenhum. Bloqueia envios duplicados (quem chama confere `status`)
 * e limpa os temporizadores ao desmontar.
 */
export function useDemoSubmit({ loadingMs = 800, holdMs = 500 }: Options = {}) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const start = useCallback(
    (onFinished?: () => void) => {
      clear();
      setStatus("loading");
      timers.current.push(
        window.setTimeout(() => {
          setStatus("done");
          if (onFinished) timers.current.push(window.setTimeout(onFinished, holdMs));
        }, loadingMs),
      );
    },
    [clear, loadingMs, holdMs],
  );

  const reset = useCallback(() => {
    clear();
    setStatus("idle");
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { status, start, reset };
}
