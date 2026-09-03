import type { Config } from "tailwindcss";

/**
 * Brand tokens come from `Belsalameh Brand Guidelines.pdf`.
 * Raw palette: #2E3A6E #6D5FA3 #B48DBF #F7A663 #FADCA8 #FFF3E0
 *
 * Colours are wired through CSS variables (see src/app/globals.css) so the
 * Phase 5 visual refinement can re-skin the whole platform from one file.
 * Semantic names (surface / ink / brand / accent) are what components use.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Raw brand scale — use sparingly; prefer the semantic tokens below.
        brand: {
          indigo: "#2E3A6E",
          purple: "#6D5FA3",
          mauve: "#B48DBF",
          orange: "#F7A663",
          sand: "#FADCA8",
          cream: "#FFF3E0",
        },
        // Semantic tokens (var-driven).
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
        "ink-subtle": "rgb(var(--ink-subtle) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-ink": "rgb(var(--primary-ink) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
      },
      fontFamily: {
        // "Crimson" (brand display serif) with a system-serif fallback so text
        // is readable before the web font loads on slow networks.
        display: ["var(--font-display)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(46 58 110 / 0.04), 0 1px 6px -1px rgb(46 58 110 / 0.08)",
        pop: "0 8px 30px -6px rgb(46 58 110 / 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
