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
          bg:       '#070a12',
          surface:  '#0d111e',
          surface2: '#111827',
          border:   'rgba(255,255,255,0.07)',
          indigo:   '#6366f1',
          violet:   '#8b5cf6',
          text:     '#f1f5f9',
          muted:    '#64748b',
          dim:      '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'prism-hero':  'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)',
        'prism-glow':  'radial-gradient(ellipse 50% 80% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        'card-shine':  'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      animation: {
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'gradient-x':  'gradientX 8s ease infinite',
        'fade-in':     'fadeIn 0.6s ease forwards',
        'slide-up':    'slideUp 0.5s ease forwards',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
      boxShadow: {
        prism:       '0 0 0 1px rgba(99,102,241,0.3), 0 4px 24px rgba(99,102,241,0.1)',
        'prism-lg':  '0 0 0 1px rgba(99,102,241,0.4), 0 8px 40px rgba(99,102,241,0.2)',
        card:        '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover':'0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        'glow-sm':   '0 0 12px rgba(99,102,241,0.4)',
        'glow-md':   '0 0 24px rgba(99,102,241,0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
