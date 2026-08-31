import type { SilkGradientConfig } from '@/components/silk'

/**
 * The hero is two independent choices: what sits BEHIND it (backdrop) and how
 * the copy is ARRANGED (layout). Mix freely — e.g. a terminal layout on a grid
 * backdrop, or the marquee on none at all.
 */

/**
 *  'shader'      — the WebGL Silk gradient (original)
 *  'grid'        — 72px graph paper that brightens under the cursor
 *  'grid-static' — the same paper, no pointer tracking
 *  'dots'        — fine dot matrix
 *  'rule'   — one hairline through the middle + a soft indigo bloom
 *  'none'   — flat background, type only
 */
export type HeroBackdrop =
  | 'shader'
  | 'logo'
  | 'grid'
  | 'grid-static'
  | 'dots'
  | 'rule'
  | 'none'

/**
 *  'split'    — intro beside a ROLE/EXP/STACK/STATUS metadata column
 *  'stacked'  — name and intro stacked, left aligned, full height
 *  'compact'  — shorter hero so the first section peeks above the fold
 *  'terminal' — framed as a shell session: prompt, typed command, output
 *  'index'    — a numbered contents table; the hero IS the table of contents
 *  'marquee'  — oversized name spanning the full viewport width, data below
 *  'card'     — everything inside one bordered box with corner registration ticks
 *  'aside'    — text column beside the 3D mark, sharing one grid (for 'logo')
 */
export type HeaderVariant =
  | 'split'
  | 'stacked'
  | 'compact'
  | 'terminal'
  | 'index'
  | 'marquee'
  | 'card'
  | 'aside'

export const HERO_BACKDROP: HeroBackdrop = 'logo'

/** Radius in px of the cursor spotlight on the interactive grid. */
export const GRID_SPOTLIGHT = 260
export const HEADER_VARIANT: HeaderVariant = 'aside'

/**
 * Silk shader palette, per theme — only used when HERO_BACKDROP is 'shader'.
 * color2 is the visible accent; color1/color3 are the ground. The light palette
 * stays dark enough that the hero copy keeps its contrast.
 */
export const SILK_CONFIG: Record<
  'dark' | 'light',
  Partial<SilkGradientConfig>
> = {
  dark: {
    color1: { r: 10, g: 10, b: 30 },
    color2: { r: 120, g: 122, b: 255 },
    color3: { r: 236, g: 238, b: 255 },
    speed: 0.35,
    scale: 1.6,
    noise: 0.1,
  },
  light: {
    color1: { r: 40, g: 44, b: 120 },
    color2: { r: 150, g: 152, b: 255 },
    color3: { r: 255, g: 255, b: 255 },
    speed: 0.35,
    scale: 1.6,
    noise: 0.08,
  },
}

/**
 * Glass material for the 3D logo. `samples` and `resolution` are the cost
 * dials: raising them sharpens the refraction but costs frame time, since the
 * transmission pass re-renders the scene into a buffer every frame.
 */
export const GLASS = {
  /** How far the mark tilts toward the cursor, in radians at the edge. */
  tilt: 0.32,
  /** Damping toward the cursor target; higher = snappier. */
  follow: 0.07,
  /** Extra roll and lateral drift, so the response reads as parallax. */
  roll: 0.05,
  shift: 0.12,
  /** On-screen height of the mark in world units (drives the scale). */
  height: 1.55,
  /** Cap on the mark's width as a fraction of the visible frustum — keeps it
   *  inside the frame on narrow screens where world units alone overflow. */
  maxWidthFraction: 0.55,
  /** Desktop resting position, centred above the copy. */
  position: [0, 0.7, 0] as [number, number, number],
  /**
   * On narrow screens the frustum is short and the copy sits closer, so the
   * mark is lifted and shrunk to keep clear of it.
   */
  mobile: {
    position: [0, 0.75, 0] as [number, number, number],
    height: 1.15,
    /** Below this viewport width (px) the mobile values apply. */
    breakpoint: 640,
  },

  /**
   * drei HDRI presets — a real environment is what makes glass read as glass,
   * giving the material a whole scene to refract and reflect. Options:
   * apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse.
   */
  envDark: 'studio' as const,
  envLight: 'park' as const,
  envIntensity: 3.2,
  /** Rate of the mark's continuous yaw, which travels the reflections. */
  envSpin: 0.35,
  /** Amplitude of that yaw, in radians. */
  sway: 0.32,
  /** Gradient glow behind the mark — what the glass actually transmits. */
  glowInner: '#c9caff' as const,
  glowOuter: '#4b3fd0' as const,
  glowSize: 5.0,

  /** Material. Thin + smooth + high dispersion reads as clean optical glass. */
  thickness: 0.55,
  roughness: 0.02,
  ior: 1.45,
  chromaticAberration: 0.35,
  anisotropy: 0.1,
  distortion: 0,
  distortionScale: 0,
  temporalDistortion: 0,
  backside: false,

  /** Cost dials: more samples = cleaner refraction, more frame time. */
  samples: 10,
  resolution: 1024,
} as const
