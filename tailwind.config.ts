import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
      backgroundColor: {
        custom_yellow: "#FFD425",
        custom_pink: "#FF3992",
        custom_purple: "#B000FF",
        custom_blue: "#007BFF"
      }
    },
  },
  plugins: [],
};
export default config;
