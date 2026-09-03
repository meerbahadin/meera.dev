'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import Silk from './silk'
import LogoMark from './logo-mark'
import { SILK_CONFIG, GRID_SPOTLIGHT, type HeroBackdrop } from '@/constant/header'

/**
 * 48px cells: the max-w-3xl content column is 768px, so exactly 16 cells span it.
 * `backgroundPosition` is set to the container's left edge (see GridPaper) so the
 * card's borders land ON grid lines rather than between them.
 */
/**
 * Vertical rules with dots punctuating them at cell intervals — a column guide
 * rather than graph paper, so the hero never looks boxed in.
 */
const GRID_LINES = `
  radial-gradient(circle at 0 50%, hsl(var(--meeradev-default-300)) 1px, transparent 1.1px),
  linear-gradient(to right, hsl(var(--meeradev-default-50)) 1px, transparent 1px)
`

/**
 * Pointer-reactive grid: a dim base layer always shows the paper, and a second,
 * brighter copy is revealed only inside a radial mask that follows the cursor.
 * The pointer position lives in CSS custom properties written straight to the
 * node, so moving the mouse never re-renders React.
 */
const CELL = 48

/**
 * Grid origin: the content column is centred, so its left edge sits at
 * (100% - 768px) / 2 of the backdrop — which, unlike 100vw, excludes the
 * scrollbar. Offsetting the pattern by that puts a grid line exactly on the
 * container edge at every viewport width.
 */
const GRID_VARS = {
  backgroundSize: `${CELL}px ${CELL}px`,
  // Split axes, not the shorthand: `background-position` would override the
  // drift animation's `background-position-y`.
  backgroundPositionX: `calc((100% - min(48rem, 100%)) / 2)`,
} as React.CSSProperties

function InteractiveGrid() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect users who ask for less motion: leave the static grid in place.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = el.getBoundingClientRect()
        const inside =
          e.clientY >= r.top &&
          e.clientY <= r.bottom &&
          e.clientX >= r.left &&
          e.clientX <= r.right
        el.style.setProperty('--x', `${e.clientX - r.left}px`)
        el.style.setProperty('--y', `${e.clientY - r.top}px`)
        el.style.setProperty('--on', inside ? '1' : '0')
      })
    }
    // `pointerleave` does not bubble, so a document listener never fires for
    // this element — bounds-check inside the move handler instead.
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const mask = `radial-gradient(${GRID_SPOTLIGHT}px circle at var(--x) var(--y), #000 0%, transparent 70%)`

  return (
    <div ref={ref} className='absolute inset-0 -z-10 mask-b-from-60%'>
      {/* base paper */}
      {/*
        The drift is a transform on an oversized layer, not an animated
        background-position: an inline position style would win over the
        keyframe, and transforms stay on the compositor.
      */}
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className='absolute -inset-y-12 inset-x-0 opacity-60 motion-safe:animate-[grid-drift_3s_linear_infinite]'
          style={{
            ...GRID_VARS,
            backgroundImage: GRID_LINES,
            ['--cell' as string]: `${CELL}px`,
          }}
        />
      </div>
      {/* brighter copy, revealed under the cursor */}
      <div
        className='absolute inset-0 transition-opacity duration-300'
        style={{
          ...GRID_VARS,
          backgroundImage: `
            radial-gradient(circle at 0 50%, hsl(var(--meeradev-default-500)) 1.3px, transparent 1.5px),
            linear-gradient(to right, hsl(var(--meeradev-default-300)) 1px, transparent 1px)
          `,
          opacity: 'var(--on, 0)',
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  )
}

/**
 * The hero's background layer. Every option is theme-aware and sits behind the
 * content at -z-10; `grid` / `dots` / `rule` / `none` are pure CSS, so they cost
 * nothing at runtime and render identically on first paint.
 */
export default function HeroBackdrop({ variant }: { variant: HeroBackdrop }) {
  const { resolvedTheme } = useTheme()

  if (variant === 'none') return null

  if (variant === 'shader') {
    const silk = SILK_CONFIG[resolvedTheme === 'light' ? 'light' : 'dark']
    return (
      <div className='w-full h-full absolute -z-10 left-0 mask-b-from-75%'>
        <Silk config={silk} />
      </div>
    )
  }

  if (variant === 'logo') {
    // The mark is an SVG figure drawn on the grid: the paper is its drafting
    // surface and the guidelines tie the two together as one drawing.
    return (
      <>
        <div className='absolute inset-0 -z-20'>
          <InteractiveGrid />
        </div>
        <LogoMark />
      </>
    )
  }

  if (variant === 'grid') return <InteractiveGrid />

  if (variant === 'grid-static') {
    return (
      <div
        className='absolute inset-0 -z-10 mask-b-from-60%'
        style={{ ...GRID_VARS, backgroundImage: GRID_LINES }}
      />
    )
  }

  if (variant === 'dots') {
    return (
      <div
        className='absolute inset-0 -z-10 mask-b-from-60%'
        style={{
          backgroundImage: `radial-gradient(hsl(var(--meeradev-default-300)) 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
        }}
      />
    )
  }

  // 'rule' — a single horizontal hairline the name sits on, plus a soft tint.
  return (
    <div className='absolute inset-0 -z-10 overflow-hidden'>
      <div className='absolute inset-x-0 top-1/2 h-px bg-default-50' />
      <div className='absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]' />
    </div>
  )
}
