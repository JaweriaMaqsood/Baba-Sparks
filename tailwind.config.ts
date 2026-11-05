import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#090711", surface: "#110D1D", card: "#181226",
        primary: "#8B5CF6", violet: "#A855F7", accent: "#22D3EE",
        ink: "#F8FAFC", muted: "#A1A1AA", line: "rgba(139,92,246,0.18)",
      },
      borderRadius: { xl: "16px", "2xl": "20px" },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        urdu: ["Noto Nastaliq Urdu", "Noto Naskh Arabic", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
