import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255,255,255,0.08)"
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,0.15)"
      }
    }
  },
  plugins: []
};

export default config;




