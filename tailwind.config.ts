import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070E1F",
          900: "#0A1832",
          800: "#0F2247",
          700: "#153163",
        },
        brand: {
          50: "#EEF4FF",
          100: "#DCE8FF",
          200: "#B7D0FF",
          300: "#87B1FF",
          400: "#4C87FF",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1A3FB0",
          800: "#173583",
          900: "#122862",
        },
        sky: {
          400: "#38BDF8",
        },
        gold: {
          400: "#F5B93F",
          500: "#EDA512",
        },
        ink: {
          900: "#0B1220",
          700: "#26324A",
          500: "#5B6B85",
          300: "#A7B3C7",
          100: "#EEF1F6",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(7,14,31,0.0) 0%, rgba(7,14,31,0.94) 78%), radial-gradient(1200px 600px at 15% -10%, rgba(56,189,248,0.28), transparent)",
        "career-line":
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 34px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,0.04), 0 8px 24px -8px rgba(11,18,32,0.10)",
        "card-hover": "0 4px 10px rgba(11,18,32,0.06), 0 16px 32px -12px rgba(11,18,32,0.18)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
