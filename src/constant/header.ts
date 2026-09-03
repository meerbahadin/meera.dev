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
 * Glass material for the 3D logo. `samples` and `resolution` are the cost
 * dials: raising them sharpens the refraction but costs frame time, since the
 * transmission pass re-renders the scene into a buffer every frame.
 */
export const GLASS = {
  /** Resting rotation, in radians [x, y, z] — the pose the mark settles back to
   *  when the cursor leaves. Square to the camera: the glow and the ribbons
   *  behind it now carry the depth, so the mark does not need a turn to read as
   *  dimensional. */
  restRotation: [0, 0, 0] as [number, number, number],
  /**
   * Motion. These are tuned for the SMALL figure cell — the mark is ~300px in
   * a bordered box now, so the lateral dials that read as gentle parallax at
   * full-viewport size would slide it out of its frame. Rotation carries the
   * motion instead; translation is deliberately tiny.
   */
  /** How far the mark tilts toward the cursor, in radians at the edge. */
  tilt: 0.2,
  /** Damping toward the cursor target; higher = snappier. */
  follow: 0.06,
  /** Extra roll, so the response reads as parallax rather than a flat hinge. */
  roll: 0.03,
  /** Lateral drift in world units. Small: the cell has hard edges. */
  shift: 0.012,
  /**
   * Idle motion is OFF. Both are kept at 0 rather than deleted so the drift can
   * be dialled back in without touching the component: `envSpin` is the rate of
   * a continuous yaw and `sway` its amplitude in radians, `bob` a slow vertical
   * float. With all three at zero the mark is still until the cursor moves.
   */
  envSpin: 0,
  sway: 0,
  bob: 0,

  /**
   * Frame cap. The mark is small now (a ~300px figure cell, not the viewport),
   * so a frame is cheap — but on a 120/240Hz display an uncapped loop still
   * renders 2-4x more frames than this motion needs. 60 is the dial to lower
   * first if the GPU ever matters again; the quality dials are not.
   */
  fps: 60,
  /** On-screen height of the mark in world units (drives the scale). The mark
   *  now sits inside a small framed figure cell rather than filling the hero,
   *  so this is much smaller than it was. */
  height: 1.8,
  /** Cap on the mark's width as a fraction of the visible frustum — keeps it
   *  inside the frame on narrow screens where world units alone overflow. */
  maxWidthFraction: 1.05,
  /** Centred in its figure cell. */
  position: [0, 0, 0] as [number, number, number],
  /**
   * On narrow screens the frustum is short and the copy sits closer, so the
   * mark is lifted and shrunk to keep clear of it.
   */
  mobile: {
    position: [0, 0, 0] as [number, number, number],
    /**
     * NOTE: on phones the width cap below always wins over `height` (the
     * frustum is much narrower than it is tall), so THIS is the mobile size
     * control — `height` is effectively ignored here.
     */
    maxWidthFraction: 0.95,
    height: 1.5,
    /** Below this viewport width (px) the mobile values apply. */
    breakpoint: 640,
  },

  /**
   * drei HDRI presets — a real environment is what makes glass read as glass,
   * giving the material a whole scene to refract and reflect. Options:
   * apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse.
   */
  envDark: 'studio' as const,
  /** Neutral on purpose: 'park' is outdoor greenery, and a transmissive mark
   *  picks that up as an olive cast — clean glass needs a colourless room. */
  envLight: 'studio' as const,
  envIntensity: 2.2,

  /**
   * The soft plane behind the mark. A transmissive material shows what is
   * BEHIND it, so without this the glass refracts an empty background and the
   * mark reads as dark grey. Greyscale on purpose — it brightens the glass
   * without tinting it.
   */
  backdropInner: '#b9bcf5' as const,
  backdropOuter: '#3a2f8f' as const,
  /**
   * Must stay comfortably LARGER than the mark (`height` / `maxWidthFraction`)
   * — the glow only reads as a halo if it spills past the geometry. Grow this
   * whenever the mark grows, or the mark simply covers its own light.
   */
  backdropSize: 4.4,
  /** Overall strength. Raise if the mark still reads too dark. */
  backdropAlpha: 0.7,
  /** PMREM size for the environment. Low-roughness glass only ever samples the
   *  sharpest mip, so anything above this is built and stored for nothing. */
  envResolution: 128,
  /**
   * Safari/WebKit pixel-ratio cap. Its WebGL fill rate and transmission
   * handling are markedly weaker than Blink's, so it also gets a cheaper
   * material — see logo-3d.tsx.
   */
  webkitMaxDpr: 1.5,

  /** Material. Thin + smooth + high dispersion reads as clean optical glass. */
  thickness: 0.75,
  roughness: 0.03,
  ior: 1.55,
  chromaticAberration: 0.5,
  anisotropy: 0.1,
  distortion: 0,
  distortionScale: 0,
  temporalDistortion: 0,
  backside: false,

  /** Quality dials for the transmission pass, which renders the scene into a
   *  `resolution`² buffer and blurs it with `samples` taps per fragment.
   *
   *  Both are at full quality on purpose: the scene is STATIC, so this cost is
   *  paid once on mount rather than every frame. There is no longer a frame
   *  budget to protect, so there is no reason to trade the image down. */
  samples: 10,
  resolution: 1024,

  /** Device-pixel-ratio cap for the canvas. This governs how clean the mark's
   *  SILHOUETTE is: the transmission blur hides interior detail, but the
   *  outline is a hard edge against the page. Full 2 — with a static scene the
   *  extra fragments cost one frame, and this is what keeps the edge smooth. */
  maxDpr: 2,
} as const

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
