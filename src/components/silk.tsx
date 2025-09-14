'use client'

import { useEffect, useRef, useMemo } from 'react'
import { Mesh, Program, Renderer, Transform, Plane } from 'ogl'

import { cn } from '@/lib/utils'

export type RGB = {
  r: number
  g: number
  b: number
}

export type SilkGradientConfig = {
  color1: RGB
  color2: RGB
  color3: RGB
  speed: number
  scale: number
  noise: number
}

export type SilkGradientProps = {
  config?: Partial<SilkGradientConfig>
  className?: string
}

export const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

export const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;  
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_scale;
  uniform float u_noise;
  uniform vec2 u_resolution;

  varying vec2 vUv;

  // Utility
  float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 silkGradient(vec2 uv, float time) {
    vec2 fragCoord = uv * u_resolution;
    vec2 invResolution = 1.0 / u_resolution.xy;
    vec2 centeredUv = (fragCoord * 2.0 - u_resolution.xy) * invResolution;
    
    centeredUv *= u_scale;
    
    float dampening = 1.0 / (1.0 + u_scale * 0.1);
    
    float d = -time * u_speed * 0.5;
    float a = 0.0;
    
    for (float i = 0.0; i < 8.0; ++i) {
        a += cos(i - d - a * centeredUv.x) * dampening;
        d += sin(centeredUv.y * i + a) * dampening;
    }
    
    d += time * u_speed * 0.5;
    
    vec3 patterns = vec3(
      cos(centeredUv.x * d + a) * 0.5 + 0.5,
      cos(centeredUv.y * a + d) * 0.5 + 0.5,
      cos((centeredUv.x + centeredUv.y) * (d + a) * 0.5) * 0.5 + 0.5
    );
    
    vec3 color1Mix = mix(u_color1, u_color2, patterns.x);
    vec3 color2Mix = mix(u_color2, u_color3, patterns.y);
    vec3 color3Mix = mix(u_color3, u_color1, patterns.z);
    
    vec3 finalColor = mix(color1Mix, color2Mix, patterns.z);
    finalColor = mix(finalColor, color3Mix, patterns.x * 0.5);
    
    vec3 originalPattern = vec3(cos(centeredUv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    originalPattern = cos(originalPattern * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
    
    return mix(finalColor, originalPattern * finalColor, 0.3);
  }

  void main() {
    vec2 uv = vUv;
    float time = u_time * u_speed;

    vec3 color = silkGradient(uv, time);

    if (u_noise > 0.001) {
      float grain = noise(uv * 200.0 + time * 0.1);
      color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`

export const DEFAULT_CONFIG: SilkGradientConfig = {
  color1: { r: 40, g: 25, b: 118 },
  color2: { r: 241, g: 96, b: 59 },
  color3: { r: 255, g: 255, b: 255 },
  speed: 0.4,
  scale: 1.2,
  noise: 0.1,
}

export const normalizeRgb = (rgb: RGB): [number, number, number] => [
  rgb.r / 255,
  rgb.g / 255,
  rgb.b / 255,
]

export default function SilkGradient({
  config: initialConfig,
  className = '',
}: SilkGradientProps) {
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...initialConfig }),
    [initialConfig]
  )

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const rafRef = useRef<number>(0)

  const normalizedColors = useMemo(
    () => ({
      color1: normalizeRgb(config.color1 as RGB),
      color2: normalizeRgb(config.color2 as RGB),
      color3: normalizeRgb(config.color3 as RGB),
    }),
    [config.color1, config.color2, config.color3]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    rendererRef.current = renderer

    const gl = renderer.gl
    const plane = new Plane(gl, { width: 2, height: 2 })

    const handleResize = () => {
      if (!canvas.parentElement) return

      const parent = canvas.parentElement
      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'

      renderer.setSize(w, h)

      if (programRef.current) {
        programRef.current.uniforms.u_resolution.value = [w, h]
      }
    }

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: normalizedColors.color1 },
        u_color2: { value: normalizedColors.color2 },
        u_color3: { value: normalizedColors.color3 },
        u_speed: { value: config.speed },
        u_scale: { value: config.scale },
        u_noise: { value: config.noise },
        u_resolution: { value: [canvas.clientWidth, canvas.clientHeight] },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry: plane, program })
    const scene = new Transform()
    mesh.setParent(scene)

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000
      program.uniforms.u_time.value = elapsed

      renderer.render({ scene: mesh })
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)

      const gl = rendererRef.current?.gl

      if (programRef.current?.program && gl) {
        gl.deleteProgram(programRef.current.program)
      }

      rendererRef.current = null
      programRef.current = null
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const program = programRef.current
    if (
      !program ||
      !rendererRef.current?.gl ||
      rendererRef.current.gl.isContextLost()
    ) {
      return
    }

    try {
      program.uniforms.u_color1.value = normalizedColors.color1
      program.uniforms.u_color2.value = normalizedColors.color2
      program.uniforms.u_color3.value = normalizedColors.color3
      program.uniforms.u_speed.value = config.speed
      program.uniforms.u_scale.value = config.scale
      program.uniforms.u_noise.value = config.noise
    } catch (error) {
      console.warn('Error updating uniforms:', error)
    }
  }, [config, normalizedColors])

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full block select-none touch-none', className)}
      aria-label='silk gradient background'
    />
  )
}
