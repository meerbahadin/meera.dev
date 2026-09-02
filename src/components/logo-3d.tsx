'use client'

import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { GLASS } from '@/constant/header'

type Mouse = { x: number; y: number }

function Glow({ position }: { position: [number, number, number] }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          u_inner: { value: new THREE.Color(GLASS.glowInner) },
          u_outer: { value: new THREE.Color(GLASS.glowOuter) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 u_inner;
          uniform vec3 u_outer;
          varying vec2 vUv;
          void main() {
            float d = distance(vUv, vec2(0.5)) * 2.0;
            // Colour ramps from the hot core out to the rim hue, while alpha
            // falls off independently so the edge dissolves into the page.
            vec3 col = mix(u_inner, u_outer, smoothstep(0.0, 0.75, d));
            float a = smoothstep(1.0, 0.0, d);
            gl_FragColor = vec4(col, pow(a, 1.6) * 0.95);
          }
        `,
      }),
    []
  )

  // The glow is static: it never animates, so let it render into the
  // transmission buffer without also being re-uploaded each frame.
  useEffect(() => () => material.dispose(), [material])

  return (
    <mesh
      position={[position[0], position[1], -1.1]}
      scale={[GLASS.glowSize, GLASS.glowSize, 1]}
      material={material}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

/** Framing for the current viewport: mobile is lifted and smaller. */
function useFraming() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${GLASS.mobile.breakpoint - 1}px)`)
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return useMemo(
    () =>
      isMobile
        ? {
            position: GLASS.mobile.position,
            height: GLASS.mobile.height,
            maxWidthFraction: GLASS.mobile.maxWidthFraction,
          }
        : {
            position: GLASS.position,
            height: GLASS.height,
            maxWidthFraction: GLASS.maxWidthFraction,
          },
    [isMobile]
  )
}

/**
 * True only while the canvas is actually on screen AND the tab is foregrounded.
 * The transmission pass is the most expensive thing on the page, so rendering
 * it for a hero the user has scrolled past is pure waste — this is the single
 * biggest saving here, because the hero leaves the viewport almost immediately.
 */
function useIsVisible(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let onScreen = true
    let focused = !document.hidden
    const sync = () => setVisible(onScreen && focused)

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      // A small margin keeps it running just off-screen so scrolling back up
      // never catches a stalled frame.
      { rootMargin: '100px' }
    )
    io.observe(el)

    const onVis = () => {
      focused = !document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ref])

  return visible
}

function LogoMesh({
  mouse,
  framing,
}: {
  mouse: React.RefObject<Mouse>
  framing: {
    position: [number, number, number]
    height: number
    maxWidthFraction: number
  }
}) {
  const gltf = useGLTF('/logo.gltf')
  const group = useRef<THREE.Group>(null)
  const spin = useRef(0)
  const reduceMotion = useRef(false)

  const { viewport } = useThree()

  const { geometry, baseScale, width } = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh)
    })
    if (!meshes.length) return { geometry: null, baseScale: 1, width: 1 }
    const geo = meshes[0].geometry.clone()
    geo.center()
    geo.computeVertexNormals()
    geo.computeBoundingBox()
    // Scale by HEIGHT: the mark is wide and flat (~4.9 x 2.7), so a
    // bounding-sphere scale is dominated by width and oversizes it on screen.
    const box = geo.boundingBox
    const h = box ? box.max.y - box.min.y : 1
    const w = box ? box.max.x - box.min.x : 1
    return { geometry: geo, baseScale: framing.height / h, width: w }
  }, [gltf, framing.height])

  // Never let the mark exceed a fraction of the visible width — this is what
  // keeps it inside the frame on phones, where the frustum is much narrower.
  const scale = Math.min(
    baseScale,
    (viewport.width * framing.maxWidthFraction) / width
  )

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    // Set once: the JSX `position` prop would be re-applied on every render and
    // snap the mark back mid-lerp (theme change, resize).
    group.current?.position.set(...framing.position)
  }, [framing.position])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (reduceMotion.current) return
    const m = mouse.current ?? { x: 0, y: 0 }
    const k = GLASS.follow
    // A continuous yaw under the cursor tilt: the mark turns past the fixed
    // environment, so highlights travel across it. (Rotating the environment
    // itself does not stick — drei re-applies environmentRotation each render.)
    spin.current += delta * GLASS.envSpin
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      m.x * GLASS.tilt + Math.sin(spin.current) * GLASS.sway,
      k
    )
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, m.y * GLASS.tilt, k)
    // A slight roll and lateral shift make the response read as parallax
    // rather than a flat hinge.
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -m.x * GLASS.roll, k)
    g.position.x = THREE.MathUtils.lerp(
      g.position.x,
      framing.position[0] + m.x * GLASS.shift,
      k
    )
    g.position.y = THREE.MathUtils.lerp(
      g.position.y,
      framing.position[1] +
        m.y * GLASS.shift * 0.6 +
        Math.sin(state.clock.elapsedTime * 0.4) * 0.03,
      k
    )
  })

  if (!geometry) return null

  return (
    <group ref={group} scale={scale} dispose={null}>
      <mesh geometry={geometry}>
        <MeshTransmissionMaterial
          thickness={GLASS.thickness}
          roughness={GLASS.roughness}
          transmission={1}
          ior={GLASS.ior}
          chromaticAberration={GLASS.chromaticAberration}
          anisotropy={GLASS.anisotropy}
          distortion={GLASS.distortion}
          distortionScale={GLASS.distortionScale}
          temporalDistortion={GLASS.temporalDistortion}
          samples={GLASS.samples}
          resolution={GLASS.resolution}
          backside={GLASS.backside}
          backsideThickness={GLASS.thickness * 0.4}
        />
      </mesh>
    </group>
  )
}

/**
 * Drives the render loop at a FIXED cap instead of letting it run free.
 *
 * This is the dial that actually governs GPU load. On a ProMotion Mac the
 * display refreshes at 120Hz, so an uncapped loop renders 120 transmission
 * passes a second and will happily consume whatever headroom you free up —
 * which is why making each frame cheaper did not lower GPU usage. Capping the
 * RATE is the only change here that reduces total work rather than
 * redistributing it.
 *
 * The canvas runs on 'demand' and we invalidate on a throttled rAF, which
 * gives an exact cap. A parked canvas still gets the couple of frames it needs
 * to paint the mark at rest.
 */
function RenderLoop({ parked, fps }: { parked: boolean; fps: number }) {
  const invalidate = useThree((s) => s.invalidate)
  const size = useThree((s) => s.size)

  useEffect(() => {
    if (parked) {
      // Two frames: the first fills the transmission FBO, the second
      // composites the mark against it.
      invalidate()
      const id = requestAnimationFrame(() => invalidate())
      return () => cancelAnimationFrame(id)
    }

    const interval = 1000 / fps
    let last = -Infinity
    let id = 0

    // Opt-in probe: run `localStorage.logo3dfps = 1` in the console and reload
    // to have the ACTUAL achieved render rate logged once a second. This is the
    // number that matters on a high-refresh display — GPU load tracks it far
    // more closely than any of the quality dials.
    const probe =
      typeof localStorage !== 'undefined' && !!localStorage.getItem('logo3dfps')
    let drawn = 0
    let windowStart = performance.now()

    const tick = (now: number) => {
      id = requestAnimationFrame(tick)
      if (now - last < interval) return
      last = now
      invalidate()

      if (!probe) return
      drawn++
      if (now - windowStart >= 1000) {
        console.log(`[logo3d] rendered ${drawn} fps (cap ${fps})`)
        drawn = 0
        windowStart = now
      }
    }
    id = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(id)
  }, [parked, fps, invalidate, size.width, size.height])

  return null
}

export default function Logo3D() {
  const { resolvedTheme } = useTheme()
  const mouse = useRef<Mouse>({ x: 0, y: 0 })
  const dark = resolvedTheme !== 'light'
  const framing = useFraming()
  const wrapper = useRef<HTMLDivElement>(null)
  const visible = useIsVisible(wrapper)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    // Listen on window, not the canvas wrapper: the hero copy paints above the
    // canvas, so a handler on the wrapper only fires over the bare margins.
    const onMove = (e: PointerEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    const onLeave = () => (mouse.current = { x: 0, y: 0 })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={wrapper}
      className='absolute inset-0 -z-10 h-full w-full mask-b-from-80% animate-[fade-in_800ms_ease-out_both]'
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        // MSAA stays ON. The transmission blur only softens what is INSIDE the
        // mark — its silhouette is a hard edge against the page with nothing
        // behind it, so without MSAA the stair-steps crawl visibly as it turns.
        // It is also the cheap half of the budget here: MSAA costs only at
        // edges, and this scene is one small shape.
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        // Capped just below 2: see GLASS.maxDpr. Trades a little fragment cost
        // back for a clean silhouette — this and `antialias` are what keep the
        // moving edge from crawling.
        dpr={[1, GLASS.maxDpr]}
        // Always 'demand': RenderLoop supplies frames at a fixed cap, and stops
        // supplying them when scrolled away, backgrounded, or under reduced
        // motion. 'always' would hand pacing back to the display's refresh rate.
        frameloop='demand'
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {/* Own boundary: a preset swap on theme change re-suspends, and a
            shared boundary would blank the mark until the HDRI downloads. */}
        <Suspense fallback={null}>
          {/* `resolution` caps the PMREM the preset HDRI is convolved into.
              The default is far larger than a smooth, low-roughness glass
              material can show — at roughness 0.02 the mark samples only the
              sharpest mip, so the extra levels are built and sampled for
              nothing. 128 is plenty and cuts both the one-off convolution and
              the per-frame lookup cost. */}
          <Environment
            preset={dark ? GLASS.envDark : GLASS.envLight}
            background={false}
            resolution={GLASS.envResolution}
            environmentIntensity={GLASS.envIntensity}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 5, 6]} intensity={3} />
          <directionalLight position={[-5, 2, 3]} intensity={2} color='#8a8cff' />
          <Glow position={framing.position} />
          <LogoMesh mouse={mouse} framing={framing} />
          <RenderLoop parked={!visible || reduceMotion} fps={GLASS.fps} />
          {/*
            A real HDRI is what makes glass look like glass: it gives the
            material a whole environment to refract and reflect. `background`
            stays false so only the mark is lit, not the page.
          */}

        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/logo.gltf')
