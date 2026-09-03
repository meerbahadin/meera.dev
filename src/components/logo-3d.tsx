'use client'

import { Suspense, useMemo, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  Environment,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { GLASS } from '@/constant/header'

type Mouse = { x: number; y: number }

/**
 * True only while the canvas is on screen AND the tab is foregrounded. The
 * scene animates again, so this is what keeps it from rendering for a hero the
 * reader has already scrolled past.
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

/**
 * WebKit only. drei's MeshTransmissionMaterial renders the scene into a float
 * FBO and blurs it with a multi-tap loop; WebKit's WebGL handles that far worse
 * than Blink and routinely drops off the fast path, so it gets the cheaper
 * built-in transmission instead.
 *
 * Chromium on macOS also reports "Safari" in its UA, hence the negative checks.
 */
function detectWebkit() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua)
}

/**
 * A soft radial plane sitting BEHIND the mark. This is not decoration: the
 * material is transmissive, so what you see through the glass is whatever is
 * behind it — with an empty transparent background there is nothing to carry
 * through and the mark goes dark. This gives it something to transmit.
 *
 * The tint stays subtle so it lights the glass without muddying it.
 */
function Backdrop({ position }: { position: [number, number, number] }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          u_inner: { value: new THREE.Color(GLASS.backdropInner) },
          u_outer: { value: new THREE.Color(GLASS.backdropOuter) },
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
            // Centred on the mark. An off-centre bias reads as a light source
            // sitting under the logo rather than an ambience it sits inside.
            vec2 p = vUv - vec2(0.5);
            float d = length(p) * 2.0;
            // A plain radial gradient gives transmission nothing crisp to
            // bend. These restrained diagonal ribbons create highlights and
            // refraction inside the logo without reading as visible stripes.
            float ribbonA = exp(-pow((vUv.y - 0.72 + vUv.x * 0.20) * 24.0, 2.0));
            float ribbonB = exp(-pow((vUv.y - 0.28 + vUv.x * 0.12) * 32.0, 2.0));
            // One smooth falloff, no separate bright core — a concentrated
            // centre is what made this read as a sun rather than a glow. The
            // brightness the glass transmits comes from u_inner and the
            // ribbons instead.
            float halo = pow(1.0 - smoothstep(0.0, 0.95, d), 1.6);

            vec3 col = mix(u_inner, u_outer, smoothstep(0.0, 0.62, d));
            col += vec3(1.0, 0.99, 1.0) * ribbonA * 0.26;
            col += vec3(0.72, 0.76, 1.0) * ribbonB * 0.14;

            // Fall all detail away before the edge of the plane so its square
            // silhouette never appears against the page.
            gl_FragColor = vec4(col, halo * GLASS_ALPHA);
          }
        `.replace('GLASS_ALPHA', GLASS.backdropAlpha.toFixed(2)),
      }),
    []
  )

  useEffect(() => () => material.dispose(), [material])

  return (
    <mesh
      position={[position[0], position[1], -1.1]}
      scale={[GLASS.backdropSize, GLASS.backdropSize, 1]}
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

function LogoMesh({
  mouse,
  framing,
  webkit,
  dark,
  onSettled,
}: {
  mouse: React.RefObject<Mouse>
  framing: {
    position: [number, number, number]
    height: number
    maxWidthFraction: number
  }
  webkit: boolean
  dark: boolean
  /** Called every frame with whether the mark has stopped moving. */
  onSettled: (settled: boolean) => void
}) {
  const gltf = useGLTF('/logo.gltf')
  const group = useRef<THREE.Group>(null)
  const spin = useRef(0)
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

  // Cursor response only — the idle drift dials (envSpin/sway/bob) are 0, so
  // nothing moves on its own. Everything damps toward its target rather than
  // snapping, which is what keeps it feeling like weight and not a hinge.
  //
  // `onSettled` reports when the mark has effectively stopped, so the render
  // loop can park instead of redrawing an unchanging frame forever.
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const [rx, ry, rz] = GLASS.restRotation
    const m = mouse.current ?? { x: 0, y: 0 }
    const k = GLASS.follow

    spin.current += delta * GLASS.envSpin

    const targetRotY = ry + m.x * GLASS.tilt + Math.sin(spin.current) * GLASS.sway
    const targetRotX = rx + m.y * GLASS.tilt
    const targetRotZ = rz - m.x * GLASS.roll
    const targetPosX = framing.position[0] + m.x * GLASS.shift
    const targetPosY =
      framing.position[1] +
      m.y * GLASS.shift * 0.6 +
      Math.sin(state.clock.elapsedTime * 0.4) * GLASS.bob

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY, k)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX, k)
    // A little roll and lateral shift make the response read as parallax.
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetRotZ, k)
    g.position.x = THREE.MathUtils.lerp(g.position.x, targetPosX, k)
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetPosY, k)

    // Below this the remaining movement is far under one pixel on screen.
    const EPS = 1e-4
    onSettled(
      Math.abs(g.rotation.y - targetRotY) < EPS &&
        Math.abs(g.rotation.x - targetRotX) < EPS &&
        Math.abs(g.rotation.z - targetRotZ) < EPS &&
        Math.abs(g.position.x - targetPosX) < EPS &&
        Math.abs(g.position.y - targetPosY) < EPS
    )
  })

  if (!geometry) return null

  return (
    <group
      ref={group}
      position={framing.position}
      rotation={GLASS.restRotation}
      scale={scale}
      dispose={null}
    >
      <mesh geometry={geometry}>
        {webkit ? (
          // three's built-in transmission: one pass, no FBO blur loop.
          <meshPhysicalMaterial
            color={dark ? '#eef0ff' : '#ffffff'}
            transmission={1}
            thickness={GLASS.thickness}
            roughness={GLASS.roughness}
            ior={GLASS.ior}
            metalness={0}
            attenuationColor={dark ? '#b9bcff' : '#e8e9ff'}
            attenuationDistance={2.5}
            clearcoat={1}
            clearcoatRoughness={0.035}
            specularIntensity={1}
            transparent
          />
        ) : (
          <MeshTransmissionMaterial
            color={dark ? '#eef0ff' : '#ffffff'}
            thickness={GLASS.thickness}
            roughness={GLASS.roughness}
            transmission={1}
            ior={GLASS.ior}
            // Strong RGB splitting reads as acrylic. Keep only a fine prism
            // fringe so the body stays clear and expensive-looking.
            chromaticAberration={Math.min(GLASS.chromaticAberration, 0.12)}
            anisotropy={GLASS.anisotropy}
            anisotropicBlur={0.08}
            attenuationColor={dark ? '#b9bcff' : '#e8e9ff'}
            attenuationDistance={2.5}
            clearcoat={1}
            clearcoatRoughness={0.025}
            specularIntensity={1}
            distortion={GLASS.distortion}
            distortionScale={GLASS.distortionScale}
            temporalDistortion={GLASS.temporalDistortion}
            samples={GLASS.samples}
            resolution={GLASS.resolution}
            backside={GLASS.backside}
            backsideThickness={GLASS.thickness * 0.4}
          />
        )}
      </mesh>
    </group>
  )
}

/**
 * Keeps tone-mapping exposure in step with the theme. `onCreated` fires once,
 * so setting exposure there alone leaves a theme swap on the old value.
 */
function ToneMapping({ dark }: { dark: boolean }) {
  const gl = useThree((s) => s.gl)

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = dark ? 1.12 : 1.02
  }, [gl, dark])

  return null
}

/**
 * Drives the loop at a fixed cap rather than letting it run free.
 *
 * On a high-refresh display (this one is 240Hz) an uncapped loop renders four
 * times the frames this motion needs, and will spend any headroom you free up —
 * so capping the RATE is what governs GPU load, not the quality dials.
 *
 * When parked (off screen, backgrounded, reduced motion) it paints a few frames
 * so the mark is still visible at rest, then goes quiet.
 */
function RenderLoop({
  parked,
  fps,
  dark,
}: {
  parked: boolean
  fps: number
  /** Not read — a dependency, so a theme swap repaints a parked canvas. */
  dark: boolean
}) {
  const invalidate = useThree((s) => s.invalidate)
  const size = useThree((s) => s.size)

  useEffect(() => {
    let id = 0

    if (parked) {
      // Several frames rather than one: the HDRI resolves async, the
      // transmission buffer needs a pass to fill before the mark composites
      // against it, and a park triggered by settling may still have a frame or
      // two of lerp left to run out.
      let n = 0
      const paint = () => {
        invalidate()
        if (++n < 12) id = requestAnimationFrame(paint)
      }
      id = requestAnimationFrame(paint)
      return () => cancelAnimationFrame(id)
    }

    const interval = 1000 / fps
    let last = -Infinity

    const tick = (now: number) => {
      id = requestAnimationFrame(tick)
      if (now - last < interval) return
      last = now
      invalidate()
    }
    id = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(id)
  }, [parked, fps, dark, invalidate, size.width, size.height])

  return null
}

export default function Logo3D() {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== 'light'
  const framing = useFraming()
  const mouse = useRef<Mouse>({ x: 0, y: 0 })
  const wrapper = useRef<HTMLDivElement>(null)
  const visible = useIsVisible(wrapper)
  // Set after mount, never during render: the server has no navigator, and
  // deciding this at render time would desync hydration.
  const [webkit, setWebkit] = useState(false)
  useEffect(() => setWebkit(detectWebkit()), [])

  // The mark only moves in response to the cursor now, so the loop should run
  // while it is catching up and stop once it has arrived. `awake` is set on
  // pointer movement and cleared when LogoMesh reports it has settled.
  const [awake, setAwake] = useState(true)
  const settled = useRef(false)

  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    // Listen on window, not the canvas: the mark sits in a small figure cell,
    // and tracking only within that cell would make the tilt feel dead.
    const wake = () => {
      settled.current = false
      // Cheap guard: setState on every pointermove would re-render constantly.
      setAwake((a) => (a ? a : true))
    }
    const onMove = (e: PointerEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
      wake()
    }
    const onLeave = () => {
      mouse.current = { x: 0, y: 0 }
      wake()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    // No -z-10 or fade mask any more: the mark sits INSIDE a bordered figure
    // cell rather than behind the page copy, so it fills its box plainly.
    <div
      ref={wrapper}
      className='absolute inset-0 h-full w-full animate-[fade-in_800ms_ease-out_both]'
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, webkit ? GLASS.webkitMaxDpr : GLASS.maxDpr]}
        // Motion is driven by RenderLoop, which requests frames at a fixed cap.
        frameloop='demand'
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <ToneMapping dark={dark} />
        {/* Own boundary: a preset swap on theme change re-suspends, and a
            shared boundary would blank the mark until the HDRI downloads. */}
        <Suspense fallback={null}>
          {/* `resolution` caps the PMREM the preset HDRI is convolved into.
              At roughness 0.02 the mark samples only the sharpest mip, so the
              extra levels would be built for nothing. */}
          <Environment
            preset={dark ? GLASS.envDark : GLASS.envLight}
            background={false}
            resolution={GLASS.envResolution}
            environmentIntensity={GLASS.envIntensity}
          />
        </Suspense>
        <Suspense fallback={null}>
          {/* A subdued fill preserves transparency; opposing cool/warm rims
              make the bevel and thickness readable as the logo turns. */}
          <ambientLight intensity={dark ? 0.7 : 0.9} />
          <hemisphereLight
            args={[
              dark ? '#dfe3ff' : '#ffffff',
              dark ? '#17132e' : '#d8daf4',
              1.25,
            ]}
          />
          <directionalLight
            position={[4, 5, 6]}
            intensity={3.4}
            color='#f7f8ff'
          />
          <spotLight
            position={[-4, 2.5, 4]}
            intensity={dark ? 7 : 4.5}
            angle={0.48}
            penumbra={1}
            color='#8d8cff'
          />
          <spotLight
            position={[3.5, -2, 3]}
            intensity={dark ? 4 : 2.5}
            angle={0.55}
            penumbra={1}
            color='#ffe8d6'
          />
          <Backdrop position={framing.position} />
          <LogoMesh
            mouse={mouse}
            framing={framing}
            webkit={webkit}
            dark={dark}
            onSettled={(s) => {
              if (s === settled.current) return
              settled.current = s
              if (s) setAwake(false)
            }}
          />
          <RenderLoop
            parked={!visible || reduceMotion || !awake}
            fps={GLASS.fps}
            dark={dark}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/logo.gltf')
