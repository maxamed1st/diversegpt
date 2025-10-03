import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'primary': 'hsl(33, 89%, 54%)',
  			'primary-content': 'hsl(0, 0%, 100%)',
  			'secondary': 'hsl(30, 100%, 43%)',
  			'secondary-content': 'hsl(0, 0%, 100%)',
  			'accent': 'hsl(270, 46%, 42%)',
  			'accent-content': 'hsl(0, 0%, 100%)',
  			'neutral': 'hsl(270, 44%, 14%)',
  			'neutral-content': 'hsl(0, 0%, 100%)',
  			'base-100': 'hsl(0, 0%, 13%)',
  			'base-200': 'hsl(15, 7%, 15%)',
  			'base-300': 'hsl(24, 7%, 25%)',
  			'base-content': 'hsl(15, 25%, 87%)',
  			'info': 'hsl(200, 100%, 70%)',
  			'info-content': 'hsl(0, 0%, 4%)',
  			'success': 'hsl(90, 60%, 53%)',
  			'success-content': 'hsl(0, 0%, 4%)',
  			'warning': 'hsl(52, 65%, 64%)',
  			'warning-content': 'hsl(0, 0%, 4%)',
  			'error': 'hsl(0, 100%, 70%)',
  			'error-content': 'hsl(0, 0%, 4%)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		height: {
  			screen: 'var(--dvh)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
