import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bg: "#07090D",
        surface: "#0B0F14",
        card: "#121826",
        primary: {
          DEFAULT: "#22D3EE",
          foreground: "#07090D",
        },
        secondary: {
          DEFAULT: "#A78BFA",
          foreground: "#07090D",
        },
        accent: {
          DEFAULT: "#00FFB0",
          foreground: "#07090D",
        },
        textPrimary: "#E5E7EB",
        textMuted: "#9CA3AF",
        border: "rgba(255,255,255,0.08)",
        input: "#0B0F14",
        ring: "#22D3EE",
        background: "#07090D",
        foreground: "#E5E7EB",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#E5E7EB",
        },
        muted: {
          DEFAULT: "#121826",
          foreground: "#9CA3AF",
        },
        popover: {
          DEFAULT: "#0B0F14",
          foreground: "#E5E7EB",
        },
        card2: {
          DEFAULT: "#121826",
          foreground: "#E5E7EB",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "grad-cta": "linear-gradient(90deg, #22D3EE, #A78BFA)",
        "grad-hero":
          "linear-gradient(180deg, rgba(7,9,13,0) 0%, rgba(7,9,13,0.85) 65%, #07090D 100%)",
        "grad-card":
          "linear-gradient(180deg, transparent 40%, rgba(7,9,13,0.95) 100%)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(34,211,238,0.3), 0 0 40px rgba(34,211,238,0.1)",
        "neon-violet": "0 0 20px rgba(167,139,250,0.3), 0 0 40px rgba(167,139,250,0.1)",
        "neon-mint": "0 0 20px rgba(0,255,176,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.2)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,211,238,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(34,211,238,0.6), 0 0 60px rgba(34,211,238,0.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-scale": "fade-in-scale 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.25s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
