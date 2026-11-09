// Splash do UniHub: tempos e movimentos definidos no Figma Motion.
// Cada propriedade tem seus próprios pontos no tempo (não há uma interpolação genérica única).

export const SPLASH_DURATION_MS = 800;

/** Curva aplicada em CADA intervalo entre os pontos definidos. */
export const SPLASH_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Com redução de movimento a splash é estática; este é o tempo até seguir para a próxima etapa. */
export const SPLASH_REDUCED_HOLD_MS = 300;

/** Tamanho de exibição do SVG dentro do contêiner de 96 px: 64 px dá o traço de 3,2 px do Figma (1,8 × 64 ÷ 36). */
export const SPLASH_SYMBOL_PX = 64;

interface Stop<T> {
  ms: number;
  value: T;
}

/** Opacidade do símbolo: 0,40 → 1 aos 180 ms → 1. */
export const SYMBOL_OPACITY: Stop<number>[] = [
  { ms: 0, value: 0.4 },
  { ms: 180, value: 1 },
  { ms: 800, value: 1 },
];

/** Escala do símbolo: 0,72 → 1,045 aos 320 ms → 1 aos 620 ms → 1. Sem rotação nem deslocamento. */
export const SYMBOL_SCALE: Stop<number>[] = [
  { ms: 0, value: 0.72 },
  { ms: 320, value: 1.045 },
  { ms: 620, value: 1 },
  { ms: 800, value: 1 },
];

/** Opacidade da camada de luz (aplicada SOBRE o gradiente, que já é transparente): pico aos 200 ms. */
export const LIGHT_OPACITY: Stop<number>[] = [
  { ms: 0, value: 0.18 },
  { ms: 200, value: 1 },
  { ms: 800, value: 0.08 },
];

/** Luz: escala 0,22 → 2,6 e deslocamento vertical +36 px → −100 px (positivo = para baixo). */
export const LIGHT_MOTION: Stop<{ scale: number; y: number }>[] = [
  { ms: 0, value: { scale: 0.22, y: 36 } },
  { ms: 800, value: { scale: 2.6, y: -100 } },
];

function toKeyframes<T>(stops: Stop<T>[], apply: (value: T) => Keyframe): Keyframe[] {
  return stops.map((stop, i) => ({
    offset: stop.ms / SPLASH_DURATION_MS,
    // a curva de um quadro vale para o intervalo até o próximo
    easing: i < stops.length - 1 ? SPLASH_EASING : "linear",
    ...apply(stop.value),
  }));
}

export const symbolOpacityKeyframes = () => toKeyframes(SYMBOL_OPACITY, (opacity) => ({ opacity }));
export const symbolScaleKeyframes = () => toKeyframes(SYMBOL_SCALE, (s) => ({ transform: `scale(${s})` }));
export const lightOpacityKeyframes = () => toKeyframes(LIGHT_OPACITY, (opacity) => ({ opacity }));

/** translateY por fora de scale: o deslocamento é em px reais, não multiplicado pela escala da luz. */
export const lightMotionKeyframes = () =>
  toKeyframes(LIGHT_MOTION, ({ scale, y }) => ({ transform: `translateY(${y}px) scale(${scale})` }));
