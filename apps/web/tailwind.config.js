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
        // Dark background theme - more professional
        background: '#0F172A',           // Slate-900
        'background-card': '#1E293B',    // Slate-800
        'background-secondary': '#334155', // Slate-700
        'background-tertiary': '#475569',  // Slate-600
        
        // Purple accent theme - refined for better readability
        'accent-purple': '#8B5CF6',        // Violet-500
        'accent-purple-light': '#A78BFA',   // Violet-400
        'accent-purple-dark': '#7C3AED',    // Violet-600
        
        // Green accent - more vibrant
        'accent-green': '#10B981',          // Emerald-500
        'accent-green-light': '#34D399',    // Emerald-400
        'accent-green-dark': '#059669',     // Emerald-600
        
        // Additional market colors
        'market-red': '#EF4444',            // Red-500
        'market-yellow': '#F59E0B',         // Amber-500
        'market-blue': '#3B82F6',           // Blue-500
        
        // Text colors - improved contrast
        'text-primary': '#F8FAFC',          // Slate-50
        'text-secondary': '#CBD5E1',        // Slate-300
        'text-tertiary': '#94A3B8',         // Slate-400
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