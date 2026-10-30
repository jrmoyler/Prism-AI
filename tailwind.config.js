/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        prism: {
          bg:       '#050A18',
          surface:  '#0D1326',
          surface2: '#111827',
          border:   'rgba(255,255,255,0.07)',
          indigo:   '#D4A843',
          violet:   '#00D9B5',
          text:     '#f1f5f9',
          muted:    '#9AA8BD',
          dim:      '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },

    },
  },
  plugins: [],
}
