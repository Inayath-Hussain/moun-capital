/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        'half': '50%'
      },
      colors: {
        'primary': '#3772FF',
        'secondary': '#A3E3FF',
        'border': '#242731',
        'section': '#353945',
        'light-card': '#242731',
        'card': '#191B20',
        'a6': '#A6A6A6',
        '6e': '#6E6E6E'
      },
      gridTemplateColumns: {
        'main': '1fr 3.52fr 1.18fr',
        'lists': '1fr 1fr 1fr',
        'lists-edit-false': '1fr 1fr 1fr 1fr'
      },
      gridTemplateRows: {
        'main': '0.055fr 0.09fr 1fr'
      },
      gridAutoRows: {
        'lists': '1fr'
      },
      minHeight: {
        'main': 'calc(100vh - 20px - 8px)'
      },
    },
  },
  plugins: [],
}
