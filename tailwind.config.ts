import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#181825",
        foreground: "white", //#a6adc8 #cdd6f4
        complementary: "#262619",
        subtle: "#1e1e2e",
        analogous1: "#201926",
        analogous2: "#192026"
      },
    },
  },
  plugins: [],
} satisfies Config;
