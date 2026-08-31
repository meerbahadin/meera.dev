'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { GLASS } from '@/constant/header'

type Mouse = { x: number; y: number }

/**
 * Slowly spins the scene's environment map. Because the glass reflects and
 * refracts that map, the highlights travel across the mark instead of sitting
 * frozen — the single biggest thing that makes it read as a real material.
 */
function SpinEnvironment() {
  useFrame((state, delta) => {
    if (state.scene.environmentRotation) {
      state.scene.environmentRotation.y += delta * GLASS.envSpin
    }
  })
  return null
}

function Glow() {
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
      position={[GLASS.position[0], GLASS.position[1], -1.1]}
      scale={[GLASS.glowSize, GLASS.glowSize, 1]}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

function LogoMesh({ mouse }: { mouse: React.RefObject<Mouse> }) {
  const gltf = useGLTF('/logo.gltf')
  const group = useRef<THREE.Group>(null)

  const { viewport } = useThree()

  const { geometry, baseScale, width } = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh)
    })
    const geo = meshes[0].geometry.clone()
    geo.center()
    geo.computeVertexNormals()
    geo.computeBoundingBox()
    // Scale by HEIGHT: the mark is wide and flat (~4.9 x 2.7), so a
    // bounding-sphere scale is dominated by width and oversizes it on screen.
    const box = geo.boundingBox
    const h = box ? box.max.y - box.min.y : 1
    const w = box ? box.max.x - box.min.x : 1
    return { geometry: geo, baseScale: GLASS.height / h, width: w }
  }, [gltf])

  // Never let the mark exceed a fraction of the visible width — this is what
  // keeps it inside the frame on phones, where the frustum is much narrower.
  const scale = Math.min(
    baseScale,
    (viewport.width * GLASS.maxWidthFraction) / width
  )

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const m = mouse.current ?? { x: 0, y: 0 }
    const k = GLASS.follow
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, m.x * GLASS.tilt, k)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, m.y * GLASS.tilt, k)
    // A slight roll and lateral shift make the response read as parallax
    // rather than a flat hinge.
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -m.x * GLASS.roll, k)
    g.position.x = THREE.MathUtils.lerp(
      g.position.x,
      GLASS.position[0] + m.x * GLASS.shift,
      k
    )
    g.position.y = THREE.MathUtils.lerp(
      g.position.y,
      GLASS.position[1] +
        m.y * GLASS.shift * 0.6 +
        Math.sin(state.clock.elapsedTime * 0.4) * 0.03,
      k
    )
  })

  return (
    <group ref={group} scale={scale} position={GLASS.position} dispose={null}>
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

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    }
  }

  return (
    <div
      className='absolute inset-0 -z-10 h-full w-full mask-b-from-80% animate-[fade-in_800ms_ease-out_both]'
      onPointerMove={onMove}
      onPointerLeave={() => (mouse.current = { x: 0, y: 0 })}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 5, 6]} intensity={3} />
          <directionalLight position={[-5, 2, 3]} intensity={2} color='#8a8cff' />
          <Glow />
          <LogoMesh mouse={mouse} />
          {/*
            A real HDRI is what makes glass look like glass: it gives the
            material a whole environment to refract and reflect. `background`
            stays false so only the mark is lit, not the page.
          */}
          <Environment
            preset={dark ? GLASS.envDark : GLASS.envLight}
            background={false}
            environmentIntensity={GLASS.envIntensity}
          />
          <SpinEnvironment />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/logo.gltf')
