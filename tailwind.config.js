/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#08090a',
          card: '#0f1013',
          border: '#23252a',
          hover: '#18191d',
          paper: '#141519'
        },
        zinc: {
          850: '#1e2024',
          900: '#121316',
          950: '#08090a'
        },
        receipt: {
          paper: '#F8FAF9',
          ink: '#0F172A',
          muted: '#64748B',
          accent: '#10B981',
          gold: '#F59E0B',
          amber: '#d97706',
          violet: '#8B5CF6',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        receipt: ['Space Mono', 'JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-amber': '0 0 80px 20px rgba(217, 119, 6, 0.15)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'mockup': '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(217, 119, 6, 0.12)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)"
      }
    },
  },
  plugins: [],
}
