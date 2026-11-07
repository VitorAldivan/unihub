import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

export type LegalDoc = "terms" | "privacy";

// Texto de DEMONSTRAÇÃO: não é documento jurídico. Os definitivos serão definidos antes do lançamento.
const CONTENT: Record<LegalDoc, { title: string; body: string }> = {
  terms: {
    title: "Termos de uso",
    body: "Este é um painel de demonstração. O texto definitivo dos Termos de uso ainda será definido e publicado antes do lançamento do UniHub.",
  },
  privacy: {
    title: "Política de privacidade",
    body: "Este é um painel de demonstração. A Política de privacidade definitiva ainda será definida e publicada antes do lançamento. Nesta versão de demonstração, nenhum dado é enviado a servidores e a senha nunca é guardada no navegador.",
  },
};

export function LegalSheet({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const content = doc ? CONTENT[doc] : null;
  return (
    <Sheet open={doc !== null} onClose={onClose} title={content?.title ?? ""}>
      {content && (
        <div className="space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">Demonstração</p>
          <p className="text-sm leading-relaxed text-ink-soft">{content.body}</p>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </div>
      )}
    </Sheet>
  );
}
