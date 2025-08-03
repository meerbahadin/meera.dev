'use client'

import { AnimatedBackground } from '@/components/motion/animated-background'
import { cn } from '../lib/utils'
import { usePathname } from 'next/navigation'

export function Links() {
  const pathname = usePathname()
  const TABS = [
    { id: 1, label: 'Home', href: '/' },
    { id: 2, label: 'Components', href: '/about' },
  ]

  return (
    <div className='flex flex-row select-none'>
      <AnimatedBackground
        className='rounded-lg bg-white/10'
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {TABS.map((tab) => (
          <button
            key={tab.href}
            data-id={tab.href}
            type='button'
            className={cn(
              'px-2 py-0.5 text-zinc-200 transition-colors duration-200 cursor-pointer text-sm',
              pathname === tab.href && 'text-zinc-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </AnimatedBackground>
    </div>
  )
}
