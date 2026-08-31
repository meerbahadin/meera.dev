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

  return (
    <mesh
      position={[position[0], position[1], -1.1]}
      scale={[GLASS.glowSize, GLASS.glowSize, 1]}
      material={material}
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

export default function Logo3D() {
  const { resolvedTheme } = useTheme()
  const mouse = useRef<Mouse>({ x: 0, y: 0 })
  const dark = resolvedTheme !== 'light'
  const framing = useFraming()

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
    <div className='absolute inset-0 -z-10 h-full w-full mask-b-from-80% animate-[fade-in_800ms_ease-out_both]'>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {/* Own boundary: a preset swap on theme change re-suspends, and a
            shared boundary would blank the mark until the HDRI downloads. */}
        <Suspense fallback={null}>
          <Environment
            preset={dark ? GLASS.envDark : GLASS.envLight}
            background={false}
            environmentIntensity={GLASS.envIntensity}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 5, 6]} intensity={3} />
          <directionalLight position={[-5, 2, 3]} intensity={2} color='#8a8cff' />
          <Glow position={framing.position} />
          <LogoMesh mouse={mouse} framing={framing} />
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
