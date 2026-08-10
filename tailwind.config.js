/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        dashboard: '20px',
      },
      colors: {
        navy: {
          DEFAULT: '#020511',
          soft: '#0A0F1E',
          surface: '#0D1224',
        },
        void: {
          DEFAULT: '#020511',
          soft: '#0A0F1E',
          surface: '#0D1224',
          raised: '#131226',
        },
        nova: {
          indigo: '#6D5AE6',
          purple: '#B04BF0',
          magenta: '#E14BD8',
          cyan: '#3FE0D0',
          sky: '#4BB4F0',
        },
        ink: {
          DEFAULT: '#F3F1FA',
          muted: '#A5A0C2',
          faint: '#6C6790',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'nova-gradient': 'linear-gradient(135deg, #6D5AE6 0%, #B04BF0 50%, #3FE0D0 100%)',
        'nova-gradient-soft': 'linear-gradient(135deg, rgba(109,90,230,0.15) 0%, rgba(176,75,240,0.15) 50%, rgba(63,224,208,0.15) 100%)',
        'radial-glow': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-indigo': '0 0 40px -8px rgba(109,90,230,0.55)',
        'glow-purple': '0 0 40px -8px rgba(176,75,240,0.55)',
        'glow-cyan': '0 0 40px -8px rgba(63,224,208,0.5)',
        'glass': '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-card-cyan': '0 0 60px -12px rgba(63,224,208,0.35), 0 20px 40px -20px rgba(0,0,0,0.5)',
        'glow-card-purple': '0 0 60px -12px rgba(176,75,240,0.35), 0 20px 40px -20px rgba(0,0,0,0.5)',
        'glow-soft': '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'float-slow': 'float 9s ease-in-out infinite',
        'float-med': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'drift': 'drift 24s linear infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-18px) translateX(6px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.55, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.04)' },
        },
        drift: {
          '0%': { transform: 'translate(0,0) rotate(0deg)' },
          '100%': { transform: 'translate(-40px, -30px) rotate(360deg)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
