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
        // No custom sans is loaded yet — the system stack alone (no dangling
        // `var(--font-sans)`, which was never defined and invalidated the
        // whole declaration, silently falling back to the browser default).
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        // "Departure board" mono for weights/labels/IDs — see layout.tsx.
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // Fluid, clamp()-based type scale: viewport 375px → 1920px without
      // breakpoint-specific overrides. `body`/`body-sm`/`caption` stay static
      // since the 18px root size (above) already covers small-screen legibility.
      fontSize: {
        "display-1": ["clamp(2.75rem, 2rem + 3.5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "heading-1": ["clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "heading-2": ["clamp(1.375rem, 1.25rem + 0.6vw, 1.75rem)", { lineHeight: "1.25" }],
        "heading-3": ["clamp(1.125rem, 1.05rem + 0.3vw, 1.375rem)", { lineHeight: "1.3" }],
        "body-lg": ["clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
      },
      // Section rhythm (see --space-section-* in globals.css). Use as
      // `py-section-sm|md|lg` for consistent vertical spacing between sections.
      spacing: {
        "section-sm": "var(--space-section-sm)",
        "section-md": "var(--space-section-md)",
        "section-lg": "var(--space-section-lg)",
      },
      transitionTimingFunction: {
        premium: "var(--ease-premium)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
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
