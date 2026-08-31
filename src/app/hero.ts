import { heroui } from '@heroui/theme'

export default heroui({
  prefix: 'meeradev',
  themes: {
    light: {
      colors: {
        background: '#ffffff',
        foreground: '#18181b',
        default: {
          50: '#e4e4e7',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          foreground: '#18181b',
          DEFAULT: '#e4e4e7',
        },
        primary: {
          DEFAULT: '#18181b',
          foreground: '#ffffff',
        },
        focus: '#6366f1',
      },
    },
    dark: {
      colors: {
        background: '#09090b',
        foreground: '#f4f4f5',
        default: {
          50: '#1c1c20',
          100: '#18181b',
          200: '#27272a',
          300: '#3f3f46',
          400: '#52525b',
          500: '#8f8f99',
          600: '#a1a1aa',
          700: '#d4d4d8',
          800: '#e4e4e7',
          900: '#f4f4f5',
          foreground: '#f4f4f5',
          DEFAULT: '#27272a',
        },
        primary: {
          DEFAULT: '#f4f4f5',
          foreground: '#09090b',
        },
        focus: '#8a8cff',
      },
    },
  },
})
