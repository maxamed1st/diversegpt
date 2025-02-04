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
        "primary": "hsl(33, 89%, 54%)",
        "primary-content": "hsl(0, 0%, 100%)",
        "secondary": "hsl(30, 100%, 43%)",
        "secondary-content": "hsl(0, 0%, 100%)",
        "accent": "hsl(270, 46%, 42%)",
        "accent-content": "hsl(0, 0%, 100%)",
        "neutral": "hsl(270, 44%, 14%)",
        "neutral-content": "hsl(0, 0%, 100%)",
        "base-100": "hsl(0, 0%, 13%)",
        "base-200": "hsl(15, 7%, 15%)",
        "base-300": "hsl(24, 7%, 25%)",
        "base-content": "hsl(15, 25%, 87%)",
        "info": "hsl(200, 100%, 70%)",
        "info-content": "hsl(0, 0%, 4%)",
        "success": "hsl(90, 60%, 53%)",
        "success-content": "hsl(0, 0%, 4%)",
        "warning": "hsl(52, 65%, 64%)",
        "warning-content": "hsl(0, 0%, 4%)",
        "error": "hsl(0, 100%, 70%)",
        "error-content": "hsl(0, 0%, 4%)"
      },
    },
  },
  plugins: [],
} satisfies Config;
