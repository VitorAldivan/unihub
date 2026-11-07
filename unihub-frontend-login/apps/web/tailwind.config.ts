import type { Config } from "tailwindcss";

// Tokens do UniHub (tema escuro do Figma).
// "brand" é o azul-ciano de destaque. safe/warn/crit são EXCLUSIVOS do status de frequência.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#18181B", // fundo principal
        surface: "#27272A", // navegação, botões, cartões secundários
        line: { DEFAULT: "#3F3F47", field: "#52525C" }, // divisores e trilho · borda dos campos
        ink: { DEFAULT: "#E4E4E7", soft: "#A8A8B2", faint: "#92929C" }, // faint: placeholder
        brand: {
          DEFAULT: "#75CBD8", // destaque
          deep: "#5BB5C3", // hover sobre o destaque
          soft: "#23383E", // cartão da próxima aula
          line: "#36545B", // divisor interno do cartão em destaque
          on: "#192B30", // texto sobre fundo de destaque (botão ciano)
        },
        safe: { DEFAULT: "#5CC794", soft: "#283C32", ink: "#8DD6AD" },
        warn: { DEFAULT: "#E9B949", soft: "#3A3220", ink: "#F0CD7A" },
        crit: { DEFAULT: "#F0716A", soft: "#3E2726", ink: "#F5A29C" },
      },
      fontFamily: {
        // Inter em tudo (o Figma usa uma única família).
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: { card: "1.25rem" },
      keyframes: {
        "sheet-in": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "sheet-in": "sheet-in .28s cubic-bezier(.22,1,.36,1)",
        "fade-in": "fade-in .2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
