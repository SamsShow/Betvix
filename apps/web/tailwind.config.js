/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark background theme
        background: '#121212',
        'background-card': '#1E1E1E',
        'background-secondary': '#252525',
        'background-tertiary': '#2A2A2A',
        
        // Purple accent theme from CashPilot
        'accent-purple': '#9D8AC8',
        'accent-purple-light': '#BEB1D9',
        'accent-purple-dark': '#7B69B0',
        
        // Green accent
        'accent-green': '#B2DFAA',
        'accent-green-light': '#D1ECCD',
        'accent-green-dark': '#95CC8E',
        
        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#AFAFAF',
        'text-tertiary': '#7E7E7E',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-large': ['2.5rem', { lineHeight: '3rem', fontWeight: '600' }],
        'display-medium': ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        'display-small': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'headline-large': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'headline-medium': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'headline-small': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.5rem' }],
        'body-medium': ['1rem', { lineHeight: '1.5rem' }],
        'body-small': ['0.875rem', { lineHeight: '1.25rem' }],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        'card': '1.25rem',
        'button': '1rem',
      },
      spacing: {
        'card-padding': '1.25rem',
        'section-spacing': '1.5rem',
      },
    },
  },
  plugins: [],
};