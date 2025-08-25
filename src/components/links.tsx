'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Links() {
  const pathname = usePathname()
  const TABS = [
    { id: 1, label: 'Home', href: '/' },
    { id: 2, label: 'Components', href: '/components' },
  ]

  return (
    <div className='flex flex-row select-none'>
      {TABS.map((tab) => (
        <Link
          href={tab.href}
          key={tab.id}
          data-id={tab.href}
          className={cn(
            'px-2 py-0.5 text-zinc-300 hover:text-zinc-200 rounded-lg bg-transparent hover:bg-white/10 transition-colors duration-200 cursor-pointer text-sm',
            pathname === tab.href && 'text-zinc-100 font-semibold'
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
