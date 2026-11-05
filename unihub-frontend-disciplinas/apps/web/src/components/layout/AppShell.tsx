import { Suspense, type ReactNode } from "react";
import { BottomNav } from "./BottomNav";

/**
 * Coluna mobile-first de até 480 px, centralizada.
 * UMA única região de rolagem (<main>); a barra inferior é irmã dela, então
 * fica sempre fixa e nunca cobre o último item.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col bg-paper lg:border-x lg:border-line">
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <BottomNav />
    </div>
  );
}
