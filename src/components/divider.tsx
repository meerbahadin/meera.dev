import { cn } from '@heroui/theme'
import React from 'react'

type Props = {
  className?: string
}

/**
 * The drafting cut edge used between sections — a lighter band, ruled top and
 * bottom, filled with 45° hatching.
 *
 * Both the band and its hatching bleed to the full viewport width while the
 * page's content column stays put. The hatch layer is a single element spanning
 * 200vw rather than one per side, so the stripe phase is continuous across the
 * whole width and no seam shows at the column edges.
 */
const Divider = (props: Props) => {
  return (
    <div
      className={cn(
        // The band itself: lifted off the page ground so it reads as a cut
        // edge rather than hatching painted straight onto the background.
        'relative h-8 w-full my-2 border-y border-default-50 bg-default-100/40',
        // overflow-x-clip on the header/main keeps these from causing scroll.
        'before:absolute before:inset-y-0 before:-left-[100vw] before:w-[100vw] before:bg-inherit before:border-y before:border-inherit before:-z-10',
        'after:absolute after:inset-y-0 after:-right-[100vw] after:w-[100vw] after:bg-inherit after:border-y after:border-inherit after:-z-10',
        props.className
      )}
      aria-hidden='true'
    >
      <div
        className='absolute inset-y-0 -left-[100vw] w-[200vw] pointer-events-none opacity-60'
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
