'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react'
import { Button } from '@heroui/button'

/**
 * Cycles light → dark → system. `system` is a real third state, not a default:
 * picked, it hands control back to the OS and follows it live.
 */
const MODES = ['light', 'dark', 'system'] as const
type Mode = (typeof MODES)[number]

const ICONS: Record<Mode, typeof IconSun> = {
  light: IconSun,
  dark: IconMoon,
  system: IconDeviceDesktop,
}

const LABELS: Record<Mode, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // The server has no way to know the stored preference, so render a
  // placeholder of the same size until mounted rather than flashing the wrong
  // icon and shifting the layout.
  if (!mounted) {
    return <div className='size-8' aria-hidden='true' />
  }

  // `theme` is the SETTING ('system' included), not the resolved value — which
  // is what lets the button show 'system' as its own state.
  const current = (MODES as readonly string[]).includes(theme ?? '')
    ? (theme as Mode)
    : 'system'
  const next = MODES[(MODES.indexOf(current) + 1) % MODES.length]
  const Icon = ICONS[current]

  return (
    <Button
      isIconOnly
      size='sm'
      radius='none'
      variant='light'
      aria-label={`${LABELS[current]}. Switch to ${LABELS[next].toLowerCase()}`}
      title={LABELS[current]}
      onPress={() => setTheme(next)}
    >
      <Icon size={16} />
    </Button>
  )
}
