import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'

class RaymarchMaterialImpl extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(800, 600) },
        iChannel0: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #ifdef GL_ES
        precision highp float;
        #endif
        
        uniform float iTime;
        uniform vec2 iResolution;
        uniform sampler2D iChannel0;
        
        varying vec2 vUv;
        
        #define STEP 128
        #define EPS 0.002
        #define MAX_DIST 100.0
        
        float smin(float a, float b, float k) {
            float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
            return mix(b, a, h) - k * h * (1.0 - h);
        }
        
        mat2 getRot(float a) {
            float sa = sin(a);
            float ca = cos(a);
            return mat2(ca, -sa, sa, ca);
        }
        
        float noise(vec2 x) {
            return sin(1.5 * x.x) * sin(1.5 * x.y);
        }
        
        float fbm4(vec2 p) {
            float f = 0.0;
            mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
            
            f += 0.500000 * (0.5 + 0.5 * noise(p)); 
            p = m * p * 2.02;
            f += 0.250000 * (0.5 + 0.5 * noise(p)); 
            p = m * p * 2.03;
            f += 0.125000 * (0.5 + 0.5 * noise(p)); 
            p = m * p * 2.01;
            f += 0.062500 * (0.5 + 0.5 * noise(p));
            
            return f / 0.9375;
        }
        
        vec3 gPosition;
        
        float sphere(vec3 center, float radius) {
            return length(gPosition - center) - radius;
        }
        
        float swingPlane(float height) {
            vec3 pos = gPosition + vec3(0.0, 0.0, iTime * 2.5);
            float def = fbm4(pos.xz * 0.25) * 1.0;
            
            float way = pow(abs(pos.x) * 34.0, 2.5) * 0.0000125;
            def *= way;
            
            float ch = height + def;
            return max(pos.y - ch, 0.0);
        }
        
        float map(vec3 pos) {
            gPosition = pos;
            
            float dist = swingPlane(0.0);
            float sminFactor = 5.25;
            dist = smin(dist, sphere(vec3(0.0, -15.0, 80.0), 45.0), sminFactor);
            
            return dist;
        }
        
        void main() {
            vec2 fragCoord = vUv * iResolution;
            vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
            
            vec3 rayOrigin = vec3(uv + vec2(0.0, 6.0), -1.0);
            vec3 rayDir = normalize(vec3(uv, 1.0));
            
            rayDir.zy = getRot(0.05) * rayDir.zy;
            rayDir.xy = getRot(0.075) * rayDir.xy;
            
            vec3 position = rayOrigin;
            float totalDist = 0.0;
            
            float curDist;
            int nbStep = 0;
            
            for(int i = 0; i < STEP; i++) {
                curDist = map(position);
                
                if(curDist < EPS || totalDist > MAX_DIST) {
                    break;
                }
                
                position += rayDir * curDist * 0.7;
                totalDist += curDist * 0.7;
                nbStep = i;
            }
            
            float f = float(nbStep) / float(STEP);
            f *= 0.8;
            
            vec3 col = vec3(f);
            col = mix(col, vec3(0.8, 0.9, 1.0), f * 0.3);
            
            gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true,
    })
  }
}

// Extend so the reconciler will learn about it, types will be inferred
const RaymarchMaterial = extend(RaymarchMaterialImpl)

function RaymarchScene({ speed = 1.0 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const noiseTexture = useMemo(() => {
    const size = 256 // Reduced from 512 for better performance
    const data = new Uint8Array(size * size * 4)

    for (let i = 0; i < size * size; i++) {
      const x = (i % size) / size
      const y = Math.floor(i / size) / size

      let noise = 0
      let amplitude = 1
      let px = x * 8,
        py = y * 8

      // Reduced octaves from 5 to 4 for performance
      for (let octave = 0; octave < 4; octave++) {
        const nx = Math.sin(1.5 * px) * Math.sin(1.5 * py)
        noise += amplitude * (0.5 + 0.5 * nx)

        const newX = 0.8 * px + 0.6 * py
        const newY = -0.6 * px + 0.8 * py
        px = newX * 2.0
        py = newY * 2.0

        amplitude *= 0.5
      }

      noise = Math.max(0, Math.min(1, noise))

      const stride = i * 4
      const value = Math.floor(noise * 255)
      data[stride] = value
      data[stride + 1] = value
      data[stride + 2] = value
      data[stride + 3] = 255
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = state.clock.elapsedTime * speed
      materialRef.current.uniforms.iResolution.value.set(
        state.size.width,
        state.size.height
      )
      materialRef.current.uniforms.iChannel0.value = noiseTexture
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <RaymarchMaterial ref={materialRef} />
    </mesh>
  )
}

export default function RaymarchingTerrain({ speed = 1.0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: false,
        powerPreference: 'high-performance',
      }}
      dpr={
        typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
      }
    >
      <RaymarchScene speed={speed} />
    </Canvas>
  )
}
