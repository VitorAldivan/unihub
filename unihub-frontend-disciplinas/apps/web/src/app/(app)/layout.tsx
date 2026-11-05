import type { ReactNode } from "react";
import { AcademicProvider } from "@/context/AcademicProvider";
import { SessionGate } from "@/context/SessionContext";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <AcademicProvider>
        <AppShell>{children}</AppShell>
      </AcademicProvider>
    </SessionGate>
  );
}
