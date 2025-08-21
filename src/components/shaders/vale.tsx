'use client'

import { useRef, useEffect } from 'react'
import { Renderer, Program, Triangle, Mesh, Vec2 } from 'ogl'
import { cn } from '@/lib/utils'

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;
uniform float uSaturation;

#define STEP 256
#define EPS 0.001
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

vec3 adjustSaturation(vec3 color, float saturation) {
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(gray), color, saturation);
}

vec3 gPosition;

float sphere(vec3 center, float radius) {
  return length(gPosition - center) - radius;
}

float swingPlane(float height) {
  vec3 pos = gPosition + vec3(0.0, 0.0, uTime * 2.5);
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
  vec2 uv = (fragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  
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
    
    position += rayDir * curDist * 0.5;
    totalDist += curDist * 0.5;
    nbStep = i;
  }
  
  float f = float(nbStep) / float(STEP);
  f *= 0.8;
  
  vec3 col = vec3(f);
  col = mix(col, vec3(0.8, 0.9, 1.0), f * 0.3);
  
  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 col;
  mainImage(col, gl_FragCoord.xy);
  col.rgb = adjustSaturation(col.rgb, uSaturation);
  gl_FragColor = vec4(clamp(col.rgb, 0.0, 1.0), 1.0);
}
`

interface ValeBackgroundProps {
  speed?: number
  saturation?: number
  className?: string
}

const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

const ValeBackground: React.FC<ValeBackgroundProps> = ({
  speed = 1.0,
  saturation = 1.0,
  className = '',
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const timeAccumulatorRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)

  const animatedValuesRef = useRef({
    speed: speed,
    saturation: saturation,
    targetSpeed: speed,
    targetSaturation: saturation,
  })

  const getDPR = () => {
    return /Android/i.test(navigator.userAgent)
      ? 1.0
      : Math.min(window.devicePixelRatio, 2)
  }

  useEffect(() => {
    if (!ref.current) return

    const canvas = ref.current
    const dpr = getDPR()

    const renderer = new Renderer({
      dpr,
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })

    const gl = renderer.gl
    const geometry = new Triangle(gl)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uSaturation: { value: animatedValuesRef.current.saturation },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    rendererRef.current = renderer
    programRef.current = program
    meshRef.current = mesh
    startTimeRef.current = performance.now()
    lastFrameTimeRef.current = performance.now()
    timeAccumulatorRef.current = 0

    const resize = () => {
      if (!canvas.parentElement) return

      const parent = canvas.parentElement
      const w = parent.clientWidth
      const h = parent.clientHeight

      const currentDpr = getDPR()
      canvas.width = w * currentDpr
      canvas.height = h * currentDpr

      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'

      renderer.setSize(w, h)
      program.uniforms.uResolution.value.set(w * currentDpr, h * currentDpr)
    }

    const loop = () => {
      const lerpFactor = 0.08
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000
      lastFrameTimeRef.current = currentTime

      animatedValuesRef.current.speed = lerp(
        animatedValuesRef.current.speed,
        animatedValuesRef.current.targetSpeed,
        lerpFactor
      )

      animatedValuesRef.current.saturation = lerp(
        animatedValuesRef.current.saturation,
        animatedValuesRef.current.targetSaturation,
        lerpFactor
      )

      timeAccumulatorRef.current += deltaTime * animatedValuesRef.current.speed

      program.uniforms.uTime.value = timeAccumulatorRef.current
      program.uniforms.uSaturation.value = animatedValuesRef.current.saturation

      renderer.render({ scene: mesh })
      frameRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', () => {
      setTimeout(resize, 100)
    })

    resize()
    loop()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
    }
  }, [])

  useEffect(() => {
    animatedValuesRef.current.targetSpeed = speed
    animatedValuesRef.current.targetSaturation = saturation
  }, [speed, saturation])

  return (
    <canvas
      ref={ref}
      className={cn(`w-full h-full bg-background`, className)}
    />
  )
}

export default ValeBackground
