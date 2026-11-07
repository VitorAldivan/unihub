"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserSession } from "@/types";
import { useSession } from "@/hooks/useSession";

interface SessionValue {
  user: UserSession;
  logout: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

/** Protege as rotas do grupo (app): sem sessão, vai para /login. */
export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { session, ready, logout } = useSession();

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!session) return null;
  return <SessionContext.Provider value={{ user: session, logout }}>{children}</SessionContext.Provider>;
}

export function useCurrentUser(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useCurrentUser deve ser usado dentro de <SessionGate>");
  return ctx;
}
