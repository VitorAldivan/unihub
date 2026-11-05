"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Mensagem curta e temporária (confirmação discreta). */
export function useToast(durationMs = 2600) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback(
    (text: string) => {
      setMessage(text);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMessage(null), durationMs);
    },
    [durationMs],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { message, show };
}
