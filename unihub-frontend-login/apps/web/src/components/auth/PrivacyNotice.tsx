import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import type { LegalDoc } from "./LegalSheet";

function DocLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      // Aparência discreta, mas com área de toque ampliada na vertical (padding compensado por margem negativa).
      className="-my-2 inline py-2 underline decoration-ink-soft/50 underline-offset-2 transition-colors hover:text-ink"
    >
      {children}
    </button>
  );
}

interface PrivacyNoticeProps {
  /** "entrar" (aba Entrar) ou "criar a conta" (aba Criar conta). */
  action: "entrar" | "criar a conta";
  onOpen: (doc: LegalDoc) => void;
}

/** Fica no fluxo normal da página (não é rodapé fixo). Sem checkbox de concordância. */
export function PrivacyNotice({ action, onOpen }: PrivacyNoticeProps) {
  return (
    <div className="mt-7">
      <p className="flex items-center gap-[7px] text-[11px] text-ink-soft">
        <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
        Seus dados acadêmicos, só seus.
      </p>
      <p className="mt-2.5 text-[10px] leading-[1.6] text-ink-soft">
        Ao {action}, você concorda com nossos{" "}
        <br />
        <DocLink onClick={() => onOpen("terms")}>Termos de uso</DocLink> e{" "}
        <DocLink onClick={() => onOpen("privacy")}>Política de privacidade</DocLink>.
      </p>
    </div>
  );
}
