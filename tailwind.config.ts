import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#397EEE", // Technical Blue
          foreground: "#ffffff",
        },
        surface: {
          DEFAULT: "var(--card)",
          border: "var(--card-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        featured: ["var(--font-syne)", "sans-serif"],
      },
      borderRadius: {
        'aura': '2.5rem',
        'sharp': '2px',
      },
    },
  },
  plugins: [],
};
export default config;
