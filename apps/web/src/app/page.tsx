"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/splash/SplashScreen";

// Terminada a animação, segue o fluxo de entrada que já existia: /home, que leva ao /login quando
// não há sessão (SessionGate). Nenhuma verificação nova aqui, e a splash não volta ao trocar de aba.
const NEXT_ROUTE = "/home";

export default function Index() {
  const router = useRouter();

  // Deixa o destino pronto para a navegação ser imediata (sem espera artificial).
  useEffect(() => {
    router.prefetch(NEXT_ROUTE);
    router.prefetch("/login");
  }, [router]);

  return <SplashScreen onComplete={() => router.replace(NEXT_ROUTE)} />;
}
