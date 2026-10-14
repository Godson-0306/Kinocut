import type { Config } from "tailwindcss";

const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: rgb("--white"),
        surface: rgb("--white"),
        paper: rgb("--paper"),
        amber: rgb("--amber"),
        blue: {
          50: rgb("--blue-50"),
          100: rgb("--blue-100"),
          200: rgb("--blue-200"),
          300: rgb("--blue-300"),
          400: rgb("--blue-400"),
          500: rgb("--blue-500"),
          600: rgb("--blue-600"),
          700: rgb("--blue-700"),
          800: rgb("--blue-800"),
        },
        green: {
          50: rgb("--green-50"),
          100: rgb("--green-100"),
          200: rgb("--green-200"),
          300: rgb("--green-300"),
          400: rgb("--green-400"),
          500: rgb("--green-500"),
          600: rgb("--green-600"),
          700: rgb("--green-700"),
          800: rgb("--green-800"),
        },
        ink: {
          DEFAULT: rgb("--ink-800"),
          300: rgb("--ink-300"),
          400: rgb("--ink-400"),
          600: rgb("--ink-600"),
          700: rgb("--ink-700"),
          800: rgb("--ink-800"),
          900: rgb("--ink-900"),
          950: rgb("--ink-950"),
        },
        line: rgb("--line-light"),
      },
      borderRadius: {
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)",
      },
      fontFamily: {
        sans: ["var(--font-bricolage)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "250ms",
        base: "600ms",
        slow: "1100ms",
      },
      maxWidth: {
        measure: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
