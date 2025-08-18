import { heroui } from '@heroui/theme'
export default heroui({
  prefix: 'meeradev',
  themes: {
    light: {
      colors: {
        primary: {
          foreground: '#fff',
          DEFAULT: '#000000',
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: '#fff',
          foreground: '#000000',
        },
      },
    },
  },
})
