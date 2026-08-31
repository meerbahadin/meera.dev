import { cn } from '@heroui/theme'
import React from 'react'

type Props = {
  className?: string
}

const Divider = (props: Props) => {
  return (
    <div
      className={cn(
        'h-8 w-full relative border-t border-b border-default-50 my-2',
        props.className
      )}
      aria-hidden='true'
    >
      <div
        className='absolute inset-0 z-0 pointer-events-none opacity-60'
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            hsl(var(--meeradev-default-300) / 0.5) 0,
            hsl(var(--meeradev-default-300) / 0.5) 1px,
            transparent 1px,
            transparent 7px
          )`,
        }}
      />
    </div>
  )
}

export default Divider
