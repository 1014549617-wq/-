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
        pixel: ['"Zpix"', 'monospace'],
        terminal: ['"Zpix"', 'monospace'],
        display: ['"PixelDisplay"', 'monospace'],
        mono: ['"Zpix"', '"Courier New"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
