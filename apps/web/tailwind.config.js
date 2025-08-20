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
        // Zinc background theme - more professional and modern
        background: '#18181b',           // zinc-900
        'background-card': '#27272a',    // zinc-800
        'background-secondary': '#3f3f46', // zinc-700
        'background-tertiary': '#52525b',  // zinc-600
        
        // Primary Green theme - main accent color
        'accent-primary': '#10b981',        // emerald-500
        'accent-primary-light': '#34d399',   // emerald-400
        'accent-primary-dark': '#059669',    // emerald-600
        
        // Neon Green accent - for highlights and attention
        'accent-neon': '#4ade80',         // green-400
        'accent-neon-light': '#86efac',   // green-300
        'accent-neon-dark': '#22c55e',    // green-500
        
        // Legacy purple theme - keeping for compatibility
        'accent-purple': '#8B5CF6',
        'accent-purple-light': '#A78BFA',
        'accent-purple-dark': '#7C3AED',
        
        // Legacy green accent - keeping for compatibility 
        'accent-green': '#10B981',
        'accent-green-light': '#34D399',
        'accent-green-dark': '#059669',
        
        // Additional market colors
        'market-red': '#ef4444',            // Red-500
        'market-yellow': '#f59e0b',         // Amber-500
        'market-blue': '#3b82f6',           // Blue-500
        
        // Text colors - improved contrast for zinc theme
        'text-primary': '#f4f4f5',          // zinc-100
        'text-secondary': '#a1a1aa',        // zinc-400
        'text-tertiary': '#71717a',         // zinc-500
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
        'card': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 15px rgba(16, 185, 129, 0.5)', // Updated to green glow
        'glow-green': '0 0 15px rgba(74, 222, 128, 0.6)', // Brighter neon green glow
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
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
      animation: {
        'gradient-slow': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-12px)',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(20px, -20px) scale(1.05)',
          },
          '66%': {
            transform: 'translate(-15px, 15px) scale(0.95)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 1,
            transform: 'scale(1.05)',
          },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
};