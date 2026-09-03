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

export const HERO_BACKDROP: HeroBackdrop = 'logo'

/** Radius in px of the cursor spotlight on the interactive grid. */
export const GRID_SPOTLIGHT = 260

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
 * The hero's spec-sheet data block. Each row is one labelled fact; `href` makes
 * it actionable, `note` is the dim trailing comment (the `// same time` in the
 * reference). Order here is the order on screen.
 */
export type SpecRow = {
  icon: 'role' | 'location' | 'phone' | 'clock' | 'mail' | 'link'
  value: string
  /** Rendered brighter, for the part that carries the meaning. */
  strong?: string
  note?: string
  href?: string
}

export const PROFILE = {
  name: 'Meer Bahadin',
  title: 'Frontend & Mobile Developer',
  /** Drop a square image at this path to fill the avatar cell. */
  avatar: '/avatar.png',
  /** The figure caption, bottom-right of the drawing cell. */
  figure: 'FIG_001',
} as const

export const SPEC_ROWS: SpecRow[] = [
  { icon: 'role', value: 'Frontend Engineering Manager @', strong: 'Ruyat Technologies' },
  { icon: 'location', value: 'Sulaymaniyah, Kurdistan Region, Iraq' },
  { icon: 'clock', value: '', note: 'local time' },
  { icon: 'mail', value: 'meerbahadin10@gmail.com', href: 'mailto:meerbahadin10@gmail.com' },
  { icon: 'link', value: 'meera.dev', href: 'https://meera.dev' },
]

export const SOCIALS = [
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/meerbahadin/' },
  { label: 'GitHub', icon: 'github', href: 'https://github.com/meerbahadin' },
  { label: 'X', icon: 'x', href: 'https://x.com/meerbahadin' },
  { label: 'Resume', icon: 'resume', href: 'https://wa.link/oonm1g' },
] as const
