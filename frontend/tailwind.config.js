/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1117',
        card: '#161b22',
        border: '#21262d',
        muted: '#8b949e',
        accent: '#58a6ff',
        green: { lab: '#3fb950' },
        red: { lab: '#f85149' },
        yellow: { lab: '#d29922' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
