import { useRef, useEffect, useState } from 'react'
import { Renderer, Program, Triangle, Mesh } from 'ogl'

interface RaymarchingTerrainProps {
  speed?: number
  className?: string
}

const RaymarchingTerrain: React.FC<RaymarchingTerrainProps> = ({
  speed = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<{
    iTime: { value: number }
    iResolution: { value: [number, number] }
  } | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const cleanupFunctionRef = useRef<(() => void) | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(containerRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible || !containerRef.current) return

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current()
      cleanupFunctionRef.current = null
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return

      await new Promise((resolve) => setTimeout(resolve, 10))

      if (!containerRef.current) return

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      })
      rendererRef.current = renderer

      const gl = renderer.gl
      gl.canvas.style.width = '100%'
      gl.canvas.style.height = '100%'

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
      containerRef.current.appendChild(gl.canvas)

      const vert = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }`

      const frag = `
        #ifdef GL_ES
        precision highp float;
        #endif

        uniform float iTime;
        uniform vec2 iResolution;

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

        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
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
          
          fragColor = vec4(col, 1.0);
        }

        void main() {
          vec4 color;
          mainImage(color, gl_FragCoord.xy);
          gl_FragColor = color;
        }`

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] as [number, number] },
      }
      uniformsRef.current = uniforms

      const geometry = new Triangle(gl)
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms,
      })
      const mesh = new Mesh(gl, { geometry, program })
      meshRef.current = mesh

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return

        renderer.dpr = Math.min(window.devicePixelRatio, 2)

        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current
        renderer.setSize(wCSS, hCSS)

        const dpr = renderer.dpr
        const w = wCSS * dpr
        const h = hCSS * dpr

        uniforms.iResolution.value = [w, h] as [number, number]
      }

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return
        }

        uniforms.iTime.value = t * 0.001 * speed

        try {
          renderer.render({ scene: mesh })
          animationIdRef.current = requestAnimationFrame(loop)
        } catch (error) {
          console.warn('WebGL rendering error:', error)
          return
        }
      }

      window.addEventListener('resize', updatePlacement)
      updatePlacement()
      animationIdRef.current = requestAnimationFrame(loop)

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
          animationIdRef.current = null
        }

        window.removeEventListener('resize', updatePlacement)

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas
            const loseContextExt =
              renderer.gl.getExtension('WEBGL_lose_context')
            if (loseContextExt) {
              loseContextExt.loseContext()
            }

            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas)
            }
          } catch (error) {
            console.warn('Error during WebGL cleanup:', error)
          }
        }

        rendererRef.current = null
        uniformsRef.current = null
        meshRef.current = null
      }
    }

    initializeWebGL()

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current()
        cleanupFunctionRef.current = null
      }
    }
  }, [isVisible, speed])

  return <div ref={containerRef} className={`w-full h-full bg-black`} />
}

export default RaymarchingTerrain
