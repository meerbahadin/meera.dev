import { cn } from '@heroui/theme'
import React from 'react'

type Props = {
  className?: string
}

const Divider = (props: Props) => {
  return (
    <div
      className={cn(
        'h-10 w-full bg-default-100/30 relative text-white my-2',
        props.className
      )}
    >
      <div
        className='absolute inset-0 z-0 pointer-events-none'
        style={{
          backgroundImage: `
        repeating-linear-gradient(30deg, 
          rgba(156, 163, 175, 0.1) 0, 
          rgba(156, 163, 175, 0.1) 1px, 
          transparent 1px, 
          transparent 10px,
          rgba(156, 163, 175, 0.15) 11px, 
          rgba(156, 163, 175, 0.15) 12px, 
          transparent 12px, 
          transparent 40px
        )
      `,
        }}
      />
    </div>
  )
}

export default Divider
