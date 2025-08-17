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
        background: {
          DEFAULT: '#121212',
          card: '#1E1E1E',
          secondary: '#252525',
          tertiary: '#2A2A2A',
        },
        // Purple accent theme from CashPilot
        accent: {
          purple: {
            light: '#BEB1D9',
            DEFAULT: '#9D8AC8',
            dark: '#7B69B0',
          },
          green: {
            light: '#D1ECCD',
            DEFAULT: '#B2DFAA',
            dark: '#95CC8E',
          },
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#AFAFAF',
          tertiary: '#7E7E7E',
        },
        // CashPilot has these chart colors
        chart: {
          line: '#9D8AC8',
          grid: '#333333',
          background: 'rgba(157, 138, 200, 0.1)',
        },
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
        display: [
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
        'label-large': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'label-medium': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        'label-small': ['0.6875rem', { lineHeight: '0.875rem', fontWeight: '500' }],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.2)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'card': '1.25rem',
        'button': '1rem',
        'input': '0.75rem',
      },
      spacing: {
        'card-padding': '1.25rem',
        'section-spacing': '1.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};