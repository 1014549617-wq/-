/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monitorBg: '#0a110d',
        monitorGlass: '#121a15',
        phosphorGreen: '#5a8f6a',
        alertRed: '#a83232',
        textWhite: '#f0f0f0',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        terminal: ['"VT323"', 'monospace'],
        mono: ['"VT323"', '"Courier New"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
