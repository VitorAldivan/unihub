"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function LoginPage() {
  const router = useRouter();
  const { session, ready, login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (ready && session) router.replace("/home");
  }, [ready, session, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Digite um e-mail válido.";
    if (password.length < 6) next.password = "A senha precisa ter pelo menos 6 caracteres.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO(Fase 2): trocar por POST /auth/login. Hoje a sessão é simulada.
    login(email);
    router.replace("/home");
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col px-6 pb-10 pt-16">
      <div className="flex items-center gap-2.5">
        <GraduationCap className="h-[22px] w-[22px] text-brand" strokeWidth={1.5} aria-hidden />
        <span className="text-[17px] font-semibold">UniHub</span>
      </div>

      <h1 className="mt-10 text-[30px] font-semibold leading-tight tracking-tight">Entrar</h1>
      <p className="mt-2 max-w-xs text-sm text-ink-soft">
        Saiba quantas faltas você ainda pode ter, antes de precisar contar.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4 rounded-card bg-surface p-5">
        <Field label="E-mail" error={errors.email}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </Field>

        <div className="relative">
          <Field label="Senha" error={errors.password}>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`${inputClass} pr-12`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-1.5 top-[30px] flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5"
          >
            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
          </button>
        </div>

        <Button type="submit" className="mt-2 w-full">
          Entrar
        </Button>
      </form>
    </main>
  );
}
