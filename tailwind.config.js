/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#12324A', soft: '#2A4A60' },
        silt: '#F3F6F5',
        sediment: '#6B7B83',
        rule: '#D5DEDD',
        observed: '#1F7A8C',
        predicted: '#D99A2B',
        danger: '#B42318',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
      },
      maxWidth: { page: '72rem', prose: '40rem' },
    },
  },
  plugins: [],
}
