import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        destiny: {
          background: "#fbf7f4",
          surface: "#fffdfc",
          ink: "#2b171c",
          wine: "#8f0f2f",
          ruby: "#c72555",
          gold: "#b7831e",
        },
      },
      boxShadow: {
        destiny: "0 14px 34px rgba(76, 30, 41, 0.1)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default config;
