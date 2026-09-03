'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The hero mark: the logo as an SVG figure on a technical drawing, replacing
 * the old WebGL scene entirely.
 *
 * Everything here is CSS/SVG — no three.js, no canvas, no WebGL — so it renders
 * identically in Safari, costs nothing on the main thread once painted, and
 * shows up on first paint instead of waiting on a 180KB bundle.
 *
 * The composition is three layers, back to front:
 *   1. an animated gradient bloom drifting behind the mark
 *   2. construction guidelines — crosshair, bounding box, corner ticks, extension
 *      lines with dimension arrows, and a measurement annotation
 *   3. the logo itself, drawn as an unfilled outline that strokes on
 */

/** The logo's intrinsic viewBox, from public/logo.svg. */
const VB = { w: 141, h: 78 }

/** Padding around the mark, in viewBox units, that the guidelines occupy. */
const PAD = { x: 46, y: 34 }

/** The full drawing surface, mark plus guideline margin. */
const BOX = { w: VB.w + PAD.x * 2, h: VB.h + PAD.y * 2 }

/** The two logo paths, lifted verbatim from public/logo.svg. */
const PATHS = [
  'M94.7167 2.2265C92.7387 -0.740479 88.3796 -0.742541 86.3988 2.22257L76.1159 17.6155C74.9928 19.2966 74.9927 21.4885 76.1155 23.1698L110.776 75.0694C111.704 76.4584 113.264 77.2925 114.934 77.2925H135.418C139.412 77.2925 141.794 72.8418 139.578 69.519L94.7167 2.2265Z',
  'M33.6607 20.3925L29.5607 26.4925L0.849421 69.5171C-1.36784 72.8397 1.01391 77.2925 5.00841 77.2925H63.4607H71.5607H94.8086C98.804 77.2925 101.186 72.838 98.9665 69.5155L54.031 2.2364C52.0481 -0.732438 47.6823 -0.726452 45.7076 2.24782L33.6607 20.3925Z',
]

/**
 * Pointer parallax, normalised to [-1, 1] on both axes and written straight to
 * the node as CSS custom properties.
 *
 * Deliberately not React state: the hero would re-render on every pointermove.
 * The transform is composited, and rAF-coalesced so a high-rate pointer cannot
 * outpace the display.
 */
function useParallax(ref: React.RefObject<SVGSVGElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = (e.clientY / window.innerHeight) * 2 - 1
        el.style.setProperty('--px', x.toFixed(3))
        el.style.setProperty('--py', y.toFixed(3))
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}

export default function LogoMark() {
  const svg = useRef<SVGSVGElement>(null)
  useParallax(svg)

  // Gate the draw-on animation until after mount so it always plays from the
  // start — a CSS animation on SSR'd markup can be partway through by hydration.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Mark bounds within the padded drawing surface.
  const L = PAD.x
  const T = PAD.y
  const R = PAD.x + VB.w
  const B = PAD.y + VB.h
  const CX = L + VB.w / 2
  const CY = T + VB.h / 2
  /** Offsets of the two dimension lines from the mark's bounding box. */
  const DIM_Y = B + 16
  const DIM_X = L - 17

  return (
    <div className='absolute inset-0 grid place-items-center overflow-hidden'>
      <svg
        ref={svg}
        viewBox={`0 0 ${BOX.w} ${BOX.h}`}
        className='h-full w-full logo-mark'
        role='img'
        aria-label='Meer Bahadin monogram, drawn as a technical figure'
        data-ready={ready || undefined}
      >
        <defs>
          {/* The bloom behind the mark: a soft radial that gives the figure a
              light source without washing out the grid behind it. */}
          <radialGradient id='mk-bloom'>
            <stop offset='0%' className='mk-bloom-in' />
            <stop offset='100%' className='mk-bloom-out' />
          </radialGradient>

          <filter id='mk-blur' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='14' />
          </filter>
        </defs>

        {/* ---- 1. bloom ------------------------------------------------ */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={VB.w * 0.62}
          ry={VB.h * 0.78}
          fill='url(#mk-bloom)'
          filter='url(#mk-blur)'
          className='mk-bloom-el'
        />

        {/* ---- 2. construction guidelines ------------------------------ */}
        {/* One group, one parallax transform: the guidelines and the mark must
            move together or the drawing comes apart. */}
        <g className='mk-plate'>
          <g className='mk-guides' strokeWidth='0.75' fill='none'>
            {/* full-bleed crosshair through the mark's centre */}
            <line x1='0' y1={CY} x2={BOX.w} y2={CY} className='mk-rule' />
            <line x1={CX} y1='0' x2={CX} y2={BOX.h} className='mk-rule' />

            {/* bounding box */}
            <rect
              x={L}
              y={T}
              width={VB.w}
              height={VB.h}
              className='mk-box'
              strokeDasharray='3 3'
            />

            {/* corner ticks — the drawing's registration marks */}
            {[
              [L, T, 1, 1],
              [R, T, -1, 1],
              [L, B, 1, -1],
              [R, B, -1, -1],
            ].map(([x, y, sx, sy], i) => (
              <g key={i} className='mk-tick'>
                <line x1={x} y1={y} x2={x + 9 * sx} y2={y} />
                <line x1={x} y1={y} x2={x} y2={y + 9 * sy} />
              </g>
            ))}

            {/* Extension + dimension line across the width. The rule is broken
                either side of the label rather than run behind it — that gap is
                what makes it read as a dimension and not a strikethrough. */}
            <g className='mk-dim'>
              <line x1={L} y1={B + 8} x2={L} y2={B + 22} />
              <line x1={R} y1={B + 8} x2={R} y2={B + 22} />
              <line x1={L} y1={DIM_Y} x2={CX - 14} y2={DIM_Y} />
              <line x1={CX + 14} y1={DIM_Y} x2={R} y2={DIM_Y} />
              {/* arrowheads */}
              <path d={`M${L} ${DIM_Y} l5 -2.2 v4.4 z`} className='mk-solid' />
              <path d={`M${R} ${DIM_Y} l-5 -2.2 v4.4 z`} className='mk-solid' />
            </g>

            {/* vertical dimension on the left, broken the same way */}
            <g className='mk-dim'>
              <line x1={DIM_X - 7} y1={T} x2={L - 8} y2={T} />
              <line x1={DIM_X - 7} y1={B} x2={L - 8} y2={B} />
              <line x1={DIM_X} y1={T} x2={DIM_X} y2={CY - 11} />
              <line x1={DIM_X} y1={CY + 11} x2={DIM_X} y2={B} />
              <path d={`M${DIM_X} ${T} l-2.2 5 h4.4 z`} className='mk-solid' />
              <path d={`M${DIM_X} ${B} l-2.2 -5 h4.4 z`} className='mk-solid' />
            </g>

            {/* centre node */}
            <circle cx={CX} cy={CY} r='2' className='mk-solid' />
          </g>

          {/* Dimension annotations, centred on their lines and sitting in the
              gaps left above. The vertical one is rotated to run with its line,
              the way it would be lettered on a real drawing. */}
          <text
            x={CX}
            y={DIM_Y}
            textAnchor='middle'
            dominantBaseline='central'
            className='mk-label'
          >{`${VB.w}.00`}</text>
          <text
            x={DIM_X}
            y={CY}
            textAnchor='middle'
            dominantBaseline='central'
            transform={`rotate(-90 ${DIM_X} ${CY})`}
            className='mk-label'
          >{`${VB.h}.00`}</text>

          {/* ---- 3. the mark ------------------------------------------- */}
          {/* Outlined, not filled: the glyph is drawn as a stroke so it reads as
              linework on the sheet, consistent with the guidelines around it.

              Pure linework: no fill at all. Each path is stroked twice — a faint
              constant outline so the silhouette is always legible, and the
              animated stroke over it that draws the shape on via
              stroke-dashoffset.

              `pathLength={100}` normalises both paths to the same nominal
              length (they are really 214 and 283 units), so a single dash value
              in the CSS draws each one exactly end to end. */}
          <g transform={`translate(${L} ${T})`}>
            {PATHS.map((d, i) => (
              <g key={i} style={{ animationDelay: `${i * 260}ms` }}>
                <path d={d} className='mk-ghost' pathLength={100} />
                <path
                  d={d}
                  className='mk-path'
                  pathLength={100}
                  style={{ animationDelay: `${i * 320}ms` }}
                />
              </g>
            ))}
          </g>

        </g>
      </svg>
    </div>
  )
}
