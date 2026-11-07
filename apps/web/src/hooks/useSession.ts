"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserSession } from "@/types";
import { nameFromEmail } from "@/lib/format";

const STORAGE_KEY = "unihub:session";

/**
 * Sessão SIMULADA (dívida técnica registrada em docs/tech-debt.md).
 * A senha nunca é guardada. Na Fase 2 isto vira cookie HttpOnly + API.
 */
export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as UserSession);
    } catch {
      /* ignora */
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const next: UserSession = {
      email: email.trim().toLowerCase(),
      name: name && name.trim().length > 0 ? name.trim() : nameFromEmail(email),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return { session, ready, login, logout };
}
