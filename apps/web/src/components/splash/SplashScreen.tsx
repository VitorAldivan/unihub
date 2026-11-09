"use client";

import { useEffect, useRef } from "react";
import { GraduationCapMark } from "@/components/brand/GraduationCapMark";
import {
  SPLASH_DURATION_MS,
  SPLASH_REDUCED_HOLD_MS,
  SPLASH_SYMBOL_PX,
  lightMotionKeyframes,
  lightOpacityKeyframes,
  symbolOpacityKeyframes,
  symbolScaleKeyframes,
} from "@/lib/splash-motion";

interface SplashScreenProps {
  /** Chamado UMA vez, quando a animação termina. Quem decide para onde ir é quem usa a splash. */
  onComplete: () => void;
}

// Luz ambiente: gradiente radial que chega a 0 de opacidade na borda do círculo de 300 px.
// (A opacidade animada da camada é aplicada adicionalmente sobre estas transparências.)
const AMBIENT_LIGHT =
  "radial-gradient(circle closest-side, rgba(117, 203, 216, 0.172549) 0%, rgba(117, 203, 216, 0.078431) 45%, rgba(117, 203, 216, 0) 100%)";

/**
 * Splash: fundo escuro, o SVG do chapéu centralizado (contêiner de 96 px) e uma luz ciano atrás dele.
 * Só opacidade e transform (sem reorganizar o layout). Roda uma vez, sem repetição, e se cancela ao desmontar.
 *
 * O primeiro quadro já mostra os valores iniciais (vêm do CSS, também no HTML do servidor), então
 * não há "piscada" do estado final antes de começar. Com redução de movimento nada se move.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const symbolRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // A splash cobre a tela inteira: nada de rolagem, nem pela luz que se expande além das bordas.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = [html.style.overflow, body.style.overflow];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous[0];
      body.style.overflow = previous[1];
    };
  }, []);

  useEffect(() => {
    const symbol = symbolRef.current;
    const light = lightRef.current;
    if (!symbol || !light) return;

    let finished = false;
    const finish = () => {
      if (finished) return; // a conclusão acontece uma única vez
      finished = true;
      onCompleteRef.current();
    };
    const timers: number[] = [];
    const animations: Animation[] = [];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof symbol.animate !== "function") {
      // Estática: símbolo no tamanho natural e segue em frente, sem espera desnecessária.
      timers.push(window.setTimeout(finish, reduceMotion ? SPLASH_REDUCED_HOLD_MS : SPLASH_DURATION_MS));
    } else {
      const timing = { duration: SPLASH_DURATION_MS, iterations: 1, fill: "forwards" } as const;
      animations.push(
        symbol.animate(symbolOpacityKeyframes(), timing),
        symbol.animate(symbolScaleKeyframes(), timing),
        light.animate(lightOpacityKeyframes(), timing),
        light.animate(lightMotionKeyframes(), timing),
      );
      Promise.all(animations.map((a) => a.finished)).then(finish, () => {
        /* animação cancelada ao desmontar: nada a fazer */
      });
      // Rede de segurança: a splash nunca fica presa (ex.: aba em segundo plano).
      timers.push(window.setTimeout(finish, SPLASH_DURATION_MS + 500));
    }

    return () => {
      finished = true;
      timers.forEach((t) => window.clearTimeout(t));
      animations.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <main
      aria-label="UniHub"
      className="fixed inset-0 grid place-items-center overflow-hidden bg-paper"
    >
      {/* Luz ambiente: decorativa, atrás do símbolo, sem interação. Mesmo centro do símbolo. */}
      <div
        ref={lightRef}
        aria-hidden="true"
        data-splash="light"
        style={{ background: AMBIENT_LIGHT }}
        className="pointer-events-none col-start-1 row-start-1 h-[300px] w-[300px] rounded-full will-change-[transform,opacity] motion-safe:opacity-[0.18] motion-safe:[transform:translateY(36px)_scale(0.22)] motion-reduce:opacity-0"
      />

      {/* Contêiner de 96 × 96: é ele que recebe opacidade e escala (origem no centro). */}
      <div
        ref={symbolRef}
        role="img"
        aria-label="UniHub"
        data-splash="symbol"
        className="col-start-1 row-start-1 grid h-24 w-24 place-items-center will-change-[transform,opacity] motion-safe:opacity-40 motion-safe:scale-[0.72]"
      >
        <GraduationCapMark size={SPLASH_SYMBOL_PX} />
      </div>
    </main>
  );
}
