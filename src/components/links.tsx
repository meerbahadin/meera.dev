'use client'

import { AnimatedBackground } from '@/components/motion/animated-background'
import { cn } from '../lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()
  const TABS = [
    { id: 1, label: 'Home', href: '/' },
    { id: 2, label: 'Components', href: '/components' },
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
          <Link
            href={tab.href}
            key={tab.href}
            data-id={tab.href}
            className={cn(
              'px-2 py-0.5 text-zinc-300 transition-colors duration-200 cursor-pointer text-sm',
              pathname === tab.href && 'text-zinc-100'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </AnimatedBackground>
    </div>
  )
}
