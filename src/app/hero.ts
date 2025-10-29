import { heroui } from '@heroui/theme'
export default heroui({
  prefix: 'meeradev',
  themes: {
    light: {
      colors: {
        background: '#ffffff',
        foreground: '#09090b',
        primary: {
          DEFAULT: '#09090b',
          foreground: '#ffffff',
        },
      },
    },
    dark: {
      colors: {
        background: '#09090b',
        foreground: '#f4f4f5',
        primary: {
          DEFAULT: '#f4f4f4',
          foreground: '#09090b',
        },
      },
    },
  },
})
