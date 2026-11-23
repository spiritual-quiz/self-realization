import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vedic: {
          gold: "#D97706",
          amber: "#F59E0B",
          saffron: "#EA580C",
          maroon: "#7F1D1D",
          deep: "#451A03",
          cream: "#FFFBEB",
          sand: "#FEF3C7",
        },
        quiz: {
          mint: "#E8F5E9",
          sky: "#E1F5FE",
          peach: "#FFF3E0",
          lavender: "#F3E5F5",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
        devanagari: ["var(--font-noto-sans-devanagari)", "sans-serif"],
      },
      boxShadow: {
        vedic: "0 10px 30px -5px rgba(217, 119, 6, 0.15)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
      }
    },
  },
  plugins: [],
};
export default config;
