/**
 * Símbolo do UniHub: o SVG do chapéu de formatura fornecido (public/brand/graduation-cap.svg),
 * inline para estar disponível no primeiro quadro, sem requisição.
 *
 * Caminho, viewBox, cor dos traços (#75CBD8), espessura (1,8 em 36) e pontas arredondadas são os do
 * arquivo original, sem alteração. Só o tamanho de exibição vem do CSS: a 64 px o traço fica com
 * 1,8 × 64 ÷ 36 = 3,2 px, como no Figma. `size` (px) define esse tamanho.
 */
export function GraduationCapMark({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <path
        d="M32.9981 14.9996V15.2795M32.9981 15.2795V24.0007M32.9981 15.2795C32.963 15.4723 32.8903 15.6572 32.7832 15.8235C32.6242 16.0702 32.3964 16.2649 32.1279 16.3833L19.2439 22.231C18.8531 22.4093 18.4285 22.5016 17.999 22.5016C17.5694 22.5016 17.1449 22.4093 16.7541 22.231L3.90011 16.3683C3.63309 16.2514 3.40593 16.0591 3.24642 15.815C3.0869 15.571 3.00195 15.2857 3.00195 14.9942C3.00195 14.7026 3.0869 14.4173 3.24642 14.1733C3.40593 13.9293 3.63309 13.737 3.90011 13.62L16.7541 7.76935C17.1449 7.59105 17.5694 7.49878 17.999 7.49878C18.4285 7.49878 18.8531 7.59105 19.2439 7.76935L32.0994 13.626C32.3703 13.7389 32.6021 13.9288 32.7661 14.1722C32.9302 14.4156 33.0192 14.7018 33.0223 14.9953C33.0233 15.091 33.0151 15.1862 32.9981 15.2795ZM9.00001 18.7501V24.0007C9.00001 25.1943 9.94814 26.339 11.6358 27.183C13.3235 28.027 15.6125 28.5012 17.9993 28.5012C20.386 28.5012 22.6751 28.027 24.3627 27.183C26.0504 26.339 26.9986 25.1943 26.9986 24.0007V18.7501"
        strokeWidth="1.8"
        strokeLinecap="round"
        stroke="#75CBD8"
      />
    </svg>
  );
}
