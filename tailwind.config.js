/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        rule: 'var(--rule)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
        site: '1280px',
      },
      letterSpacing: {
        headline: '-0.01em',
        meta: '0.08em',
      },
      lineHeight: {
        headline: '1.1',
        lead: '1.08',
        body: '1.7',
      },
      borderRadius: {
        DEFAULT: '0px',
        ui: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
