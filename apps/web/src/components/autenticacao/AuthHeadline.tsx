/**
 * Chamada principal. O destaque azul começa em "sob" (não só em "controle.").
 * O tamanho acompanha a largura (42 px na referência de 390 px) para manter as três linhas em telas estreitas;
 * com texto muito ampliado pelo usuário, `break-words` evita rolagem horizontal.
 */
export function AuthHeadline() {
  return (
    <h1 className="mt-6 break-words text-left font-normal leading-[1.08] tracking-[-0.02em] [font-size:clamp(1.75rem,10.8vw,2.625rem)]">
      Sua vida{" "}
      <br />
      acadêmica <span className="text-brand">sob{" "}<br />controle.</span>
    </h1>
  );
}
