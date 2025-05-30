module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './app/components/**/*.{js,ts,jsx,tsx}',
    './app/context/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: 'var(--medical-primary)',
          secondary: 'var(--medical-secondary)',
          accent: 'var(--medical-accent)',
          warning: 'var(--medical-warning)',
          danger: 'var(--medical-danger)',
          success: 'var(--medical-success)',
          background: 'var(--medical-background)',
          card: 'var(--medical-card)',
          border: 'var(--medical-border)',
          text: 'var(--medical-text)',
          'text-secondary': 'var(--medical-text-secondary)'
        },
        // Custom theme colors
        'theme-bg': {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          accent: 'var(--bg-accent)'
        },        'theme-text': {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)'
        },
        'theme-border': {
          primary: 'var(--border-primary, #334155)',
          secondary: 'var(--border-secondary, #475569)'
        },
        'theme-accent': {
          gold: 'var(--accent-gold, #F59E0B)',
          blue: 'var(--accent-blue, #06B6D4)',
          purple: 'var(--accent-purple, #A78BFA)',
          'ash-purple': 'var(--accent-ash-purple, #8B5CF6)'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  variants: {
    extend: {
      fontSize: ['care'],
      lineHeight: ['care'],
      spacing: ['care']
    }
  },
  plugins: []
}