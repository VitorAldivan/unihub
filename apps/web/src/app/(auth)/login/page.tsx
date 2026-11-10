"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { AuthScreen } from "@/components/autenticacao/AuthScreen";

/**
 * Tela de acesso. A sessão é SIMULADA (docs/tech-debt.md): só e-mail e nome ficam no navegador.
 * A senha nunca chega aqui: o formulário só entrega o e-mail.
 */
export default function LoginPage() {
  const router = useRouter();
  const { session, ready, login } = useSession();

  // Quem já entrou não precisa ver o login de novo.
  useEffect(() => {
    if (ready && session) router.replace("/home");
  }, [ready, session, router]);

  return (
    <AuthScreen
      onAuthenticated={(email, name) => {
        login(email, name);
        router.replace("/home");
      }}
    />
  );
}
