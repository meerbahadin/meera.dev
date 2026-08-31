'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { Button } from '@heroui/button'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className='size-8' aria-hidden='true' />
  }

  return (
    <Button
      isIconOnly
      size='sm'
      radius='none'
      variant='light'
      aria-label='Toggle theme'
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
    </Button>
  )
}
