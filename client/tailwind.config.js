/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monitorBg: '#080c0a',
        monitorGlass: '#0e1310',
        phosphorGreen: '#4a6b52',
        alertRed: '#7f1d1d',
        textWhite: '#e5e7eb',
      },
      fontFamily: {
        mono: ['"Courier New"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
