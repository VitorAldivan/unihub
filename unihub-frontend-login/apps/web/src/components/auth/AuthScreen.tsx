"use client";

import { useState } from "react";
import { AuthBrand } from "./AuthBrand";
import { AuthHeadline } from "./AuthHeadline";
import { AuthTabs, panelId, tabId, type AuthTab } from "./AuthTabs";
import { LegalSheet, type LegalDoc } from "./LegalSheet";
import { LoginForm } from "./LoginForm";
import { PrivacyNotice } from "./PrivacyNotice";
import { RecoverPasswordSheet } from "./RecoverPasswordSheet";
import { SignupPanel } from "./SignupPanel";

const SIGNUP_NOTICE = "Demonstração: nenhuma conta foi criada de verdade. Entre com qualquer e-mail e senha.";

/**
 * Estrutura da tela de acesso: alinhada ao topo, uma única rolagem (a da página),
 * sem navegação inferior, sem barras falsas do sistema e sem nada fixo.
 * Só interface: quem decide o que fazer ao "entrar" é a página (`onAuthenticated`).
 */
export function AuthScreen({ onAuthenticated }: { onAuthenticated: (email: string) => void }) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [handoff, setHandoff] = useState<string | null>(null); // e-mail vindo do cadastro de demonstração
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [legal, setLegal] = useState<LegalDoc | null>(null);

  function changeTab(next: AuthTab) {
    setHandoff(null);
    setTab(next);
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <AuthBrand />
      <AuthHeadline />
      <AuthTabs value={tab} onChange={changeTab} />

      <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)}>
        {tab === "login" ? (
          <LoginForm
            initialEmail={handoff ?? undefined}
            notice={handoff ? SIGNUP_NOTICE : undefined}
            focusPassword={handoff !== null}
            onForgot={(email) => {
              setRecoverEmail(email);
              setRecoverOpen(true);
            }}
            onSuccess={onAuthenticated}
          />
        ) : (
          <SignupPanel
            onCreated={(email) => {
              setHandoff(email);
              setTab("login");
            }}
          />
        )}
      </div>

      <PrivacyNotice action={tab === "login" ? "entrar" : "criar a conta"} onOpen={setLegal} />

      <RecoverPasswordSheet open={recoverOpen} initialEmail={recoverEmail} onClose={() => setRecoverOpen(false)} />
      <LegalSheet doc={legal} onClose={() => setLegal(null)} />
    </main>
  );
}
