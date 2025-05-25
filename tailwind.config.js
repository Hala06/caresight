module.exports = {
  darkMode: 'class',  content: [
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
          alert: 'var(--medical-alert)',
          background: 'var(--medical-background)'
        }
      },      animation: {
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