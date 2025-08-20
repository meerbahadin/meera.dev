'use client'

import { useRef, useEffect } from 'react'
import { Renderer, Program, Triangle, Mesh, Vec2 } from 'ogl'

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
uniform vec2 uMouse;
uniform float uOpacity;
uniform float uSpeed;
uniform float uIntensity;
uniform float uMouseInfluence;
uniform vec3 uHaloColor;
uniform vec3 uEdge1Color;
uniform vec3 uEdge2Color;
uniform vec3 uBackgroundColor;

float mod289(float x) { 
  return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

vec4 mod289(vec4 x) { 
  return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

vec4 perm(vec4 x) { 
  return mod289(((x * 34.0) + 1.0) * x); 
}

float noise(vec3 p) {
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);
  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);
  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);
  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));
  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
  return o4.y * d.y + o4.x * (1.0 - d.y);
}

float rand1d(float n) { 
  return fract(sin(n) * 43758.5453123); 
}

float noise1d(float p) {
  float fl = floor(p);
  float fc = fract(p);
  return mix(rand1d(fl), rand1d(fl + 1.0), fc);
}

vec2 rot(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, s, -s, c);
  return m * v;
}

vec3 circle(vec2 uv, float off, vec2 mousePos, float mouseInfluence) {
  vec3 col = uHaloColor;
  float t = uTime * uSpeed + off;
  float rt = t * 0.4;
  
  // Manual derivative approximation instead of fwidth
  float f = 1.0 / min(uResolution.x, uResolution.y) * 4.0;
  
  // Fixed mouse coordinate conversion
  vec2 normalizedMouse = mousePos;
  float mouseDist = length(uv - normalizedMouse);
  
  // Subtle mouse effects with smoother falloff
  float mouseEffect = exp(-mouseDist * 2.0) * mouseInfluence * 1.0;
  
  // Gentle global pulsing effect
  float globalPulse = mouseInfluence * 0.3 * (sin(uTime * 3.0) * 0.5 + 0.5);
  
  // Enhanced rotation with stronger mouse influence
  float rotationAmount = 6.2831853 * (
    noise1d(rt - 6816.6) * 0.5 + 
    noise1d(rt * 1.25 - 3743.16) * 0.4 + 
    noise1d(rt * 1.5 + 1741.516) * 0.3
  );
  rotationAmount += (mouseEffect + globalPulse) * sin(uTime * 2.0) * 1.5;
  
  uv = rot(uv, rotationAmount);
  
  // Enhanced noise with subtle mouse distortion
  float noiseScale = 1.0 + (mouseEffect + globalPulse) * 0.8;
  float n = noise(vec3(uv * 1.2 * noiseScale, t)) * 0.2 + 
            noise(vec3(-uv * 1.7 * noiseScale, t)) * 0.15 + 
            noise(vec3(uv * 2.2 * noiseScale, t)) * 0.1;
  
  // Subtle mouse-responsive ripples
  n += mouseEffect * sin(mouseDist * 8.0 - uTime * 4.0) * 0.15;
  
  float d = dot(uv, uv);
  float hd = d + n * uIntensity;
  
  // Subtle color shifts with mouse interaction
  vec3 dynamicHalo = mix(uHaloColor, uEdge1Color * 1.2, mouseEffect * 0.3);
  dynamicHalo = mix(dynamicHalo, vec3(0.8, 0.4, 0.9), globalPulse * 0.2);
  col = pow(vec3(hd), vec3(3.5, 3.5, 2.0)) * dynamicHalo * smoothstep(1.0, 1.0 - f, hd);
  
  float cd = d * hd * hd * smoothstep(1.0, 1.0 - f, hd) * 1.25;
  vec3 edgeColor = mix(uEdge1Color, uEdge2Color, pow(hd, 8.0));
  
  // Moderate mouse influence on edges
  edgeColor *= (1.0 + (mouseEffect + globalPulse) * 2.0);
  edgeColor = mix(edgeColor, edgeColor * vec3(1.2, 0.6, 1.3), mouseEffect * 0.4);
  
  col += cd * cd * edgeColor - (cd * cd * cd) * col;
  col = mix(uBackgroundColor, col, smoothstep(1.0, 1.0 - f, hd));
  
  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float min_res = min(uResolution.x, uResolution.y);
  vec2 uv = (fragCoord * 2.0 - uResolution.xy) / min_res * 1.1;
  
  // Use mouse position directly (already normalized)
  vec2 mousePos = uMouse;
  
  vec3 col = mix(mix(mix(mix(
    circle(uv, 0.0, mousePos, uMouseInfluence), 
    circle(uv, 1000.0, mousePos, uMouseInfluence), uOpacity), 
    circle(uv, 2000.0, mousePos, uMouseInfluence), uOpacity), 
    circle(uv, 3000.0, mousePos, uMouseInfluence), uOpacity), 
    circle(uv, 4000.0, mousePos, uMouseInfluence), uOpacity);
    
  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 col;
  mainImage(col, gl_FragCoord.xy);
  gl_FragColor = vec4(clamp(col.rgb, 0.0, 1.0), 1.0);
}
`

interface InteractiveCircleShaderProps {
  speed?: number
  opacity?: number
  intensity?: number
  mouseInfluence?: number
  haloColor?: [number, number, number]
  edge1Color?: [number, number, number]
  edge2Color?: [number, number, number]
  backgroundColor?: [number, number, number]
  showControls?: boolean
  className?: string
}

// Export presets for external use
export const SHADER_PRESETS = {
  default: {
    speed: 1.0,
    opacity: 0.2,
    intensity: 1.0,
    mouseInfluence: 1.0,
    haloColor: [0.2, 0.6, 1.0] as [number, number, number],
    edge1Color: [0.8, 0.4, 0.4] as [number, number, number],
    edge2Color: [0.9, 0.2, 0.1] as [number, number, number],
    backgroundColor: [0.0, 0.0, 0.11] as [number, number, number],
  },
  galaxy: {
    speed: 0.8,
    opacity: 0.3,
    intensity: 0.6,
    mouseInfluence: 0.8,
    haloColor: [0.15, 0.25, 0.8] as [number, number, number],
    edge1Color: [0.4, 0.2, 0.8] as [number, number, number],
    edge2Color: [0.8, 0.3, 0.9] as [number, number, number],
    backgroundColor: [0.0, 0.0, 0.0] as [number, number, number],
  },
  aurora: {
    speed: 1.2,
    opacity: 0.25,
    intensity: 0.8,
    mouseInfluence: 1.2,
    haloColor: [0.2, 0.8, 0.4] as [number, number, number],
    edge1Color: [0.1, 0.9, 0.6] as [number, number, number],
    edge2Color: [0.3, 0.7, 0.9] as [number, number, number],
    backgroundColor: [0.0, 0.05, 0.1] as [number, number, number],
  },
  ocean: {
    speed: 0.6,
    opacity: 0.4,
    intensity: 1.2,
    mouseInfluence: 0.6,
    haloColor: [0.1, 0.4, 0.8] as [number, number, number],
    edge1Color: [0.2, 0.6, 0.9] as [number, number, number],
    edge2Color: [0.0, 0.3, 0.7] as [number, number, number],
    backgroundColor: [0.0, 0.02, 0.08] as [number, number, number],
  },
  fire: {
    speed: 1.5,
    opacity: 0.35,
    intensity: 1.1,
    mouseInfluence: 1.4,
    haloColor: [1.0, 0.4, 0.1] as [number, number, number],
    edge1Color: [1.0, 0.2, 0.0] as [number, number, number],
    edge2Color: [0.8, 0.6, 0.0] as [number, number, number],
    backgroundColor: [0.05, 0.0, 0.0] as [number, number, number],
  },
  cosmic: {
    speed: 0.4,
    opacity: 0.2,
    intensity: 0.9,
    mouseInfluence: 0.5,
    haloColor: [0.8, 0.2, 0.9] as [number, number, number],
    edge1Color: [0.9, 0.1, 0.7] as [number, number, number],
    edge2Color: [0.6, 0.3, 1.0] as [number, number, number],
    backgroundColor: [0.02, 0.0, 0.05] as [number, number, number],
  },
}

const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

const InteractiveCircleShader: React.FC<InteractiveCircleShaderProps> = ({
  speed = 0.8,
  opacity = 0.2,
  intensity = 0.8,
  mouseInfluence = 0.5,
  haloColor = [0.2, 0.6, 1.0],
  edge1Color = [0.8, 0.4, 0.4],
  edge2Color = [0.8, 0.2, 0.1],
  backgroundColor = [0.0, 0.0, 0.11],
  className = '',
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const timeAccumulatorRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)
  const mouseRef = useRef<Vec2>(new Vec2(0, 0))
  const isMouseOverRef = useRef<boolean>(false)

  // Use props directly instead of state
  const animatedValuesRef = useRef({
    speed: speed,
    opacity: opacity,
    intensity: intensity,
    mouseInfluence: mouseInfluence,
    mouseX: 0,
    mouseY: 0,
    targetSpeed: speed,
    targetOpacity: opacity,
    targetIntensity: intensity,
    targetMouseInfluence: mouseInfluence,
    targetMouseX: 0,
    targetMouseY: 0,
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
        uMouse: { value: new Vec2(0, 0) },
        uOpacity: { value: opacity },
        uSpeed: { value: speed },
        uIntensity: { value: intensity },
        uMouseInfluence: { value: mouseInfluence },
        uHaloColor: {
          value: [haloColor[0], haloColor[1], haloColor[2]],
        },
        uEdge1Color: {
          value: [edge1Color[0], edge1Color[1], edge1Color[2]],
        },
        uEdge2Color: {
          value: [edge2Color[0], edge2Color[1], edge2Color[2]],
        },
        uBackgroundColor: {
          value: [backgroundColor[0], backgroundColor[1], backgroundColor[2]],
        },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    rendererRef.current = renderer
    programRef.current = program
    meshRef.current = mesh
    lastFrameTimeRef.current = performance.now()
    timeAccumulatorRef.current = 0

    // Fixed mouse tracking with proper coordinate conversion
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()

      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = (1 - (event.clientY - rect.top) / rect.height) * 2 - 1

      // Convert to shader space (matching the UV calculation)
      const aspectRatio = rect.width / rect.height
      const normalizedX = x * Math.max(1, aspectRatio) * 1.1
      const normalizedY = y * Math.max(1, 1 / aspectRatio) * 1.1

      animatedValuesRef.current.targetMouseX = normalizedX
      animatedValuesRef.current.targetMouseY = normalizedY

      isMouseOverRef.current = true
    }

    const handleMouseEnter = () => {
      isMouseOverRef.current = true
    }

    const handleMouseLeave = () => {
      isMouseOverRef.current = false

      // Reset mouse influence when leaving
      animatedValuesRef.current.targetMouseX = 0
      animatedValuesRef.current.targetMouseY = 0
    }

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
      if (!programRef.current || !rendererRef.current || !meshRef.current)
        return

      const lerpFactor = 0.08
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000
      lastFrameTimeRef.current = currentTime

      // Faster mouse response
      const mouseLerpFactor = 0.25

      animatedValuesRef.current.speed = lerp(
        animatedValuesRef.current.speed,
        animatedValuesRef.current.targetSpeed,
        lerpFactor
      )
      animatedValuesRef.current.opacity = lerp(
        animatedValuesRef.current.opacity,
        animatedValuesRef.current.targetOpacity,
        lerpFactor
      )
      animatedValuesRef.current.intensity = lerp(
        animatedValuesRef.current.intensity,
        animatedValuesRef.current.targetIntensity,
        lerpFactor
      )

      // Dynamic mouse influence based on hover state
      const targetInfluence = isMouseOverRef.current
        ? animatedValuesRef.current.targetMouseInfluence
        : 0

      animatedValuesRef.current.mouseInfluence = lerp(
        animatedValuesRef.current.mouseInfluence,
        targetInfluence,
        lerpFactor * 2
      )

      // Smooth mouse animation
      animatedValuesRef.current.mouseX = lerp(
        animatedValuesRef.current.mouseX,
        animatedValuesRef.current.targetMouseX,
        mouseLerpFactor
      )
      animatedValuesRef.current.mouseY = lerp(
        animatedValuesRef.current.mouseY,
        animatedValuesRef.current.targetMouseY,
        mouseLerpFactor
      )

      timeAccumulatorRef.current += deltaTime * animatedValuesRef.current.speed

      const program = programRef.current
      const renderer = rendererRef.current
      const mesh = meshRef.current

      if (program.uniforms) {
        program.uniforms.uTime.value = timeAccumulatorRef.current
        mouseRef.current.set(
          animatedValuesRef.current.mouseX,
          animatedValuesRef.current.mouseY
        )
        program.uniforms.uMouse.value = mouseRef.current
        program.uniforms.uOpacity.value = animatedValuesRef.current.opacity
        program.uniforms.uSpeed.value = animatedValuesRef.current.speed
        program.uniforms.uIntensity.value = animatedValuesRef.current.intensity
        program.uniforms.uMouseInfluence.value =
          animatedValuesRef.current.mouseInfluence

        // Update colors by setting the value arrays directly
        program.uniforms.uHaloColor.value[0] = haloColor[0]
        program.uniforms.uHaloColor.value[1] = haloColor[1]
        program.uniforms.uHaloColor.value[2] = haloColor[2]

        program.uniforms.uEdge1Color.value[0] = edge1Color[0]
        program.uniforms.uEdge1Color.value[1] = edge1Color[1]
        program.uniforms.uEdge1Color.value[2] = edge1Color[2]

        program.uniforms.uEdge2Color.value[0] = edge2Color[0]
        program.uniforms.uEdge2Color.value[1] = edge2Color[1]
        program.uniforms.uEdge2Color.value[2] = edge2Color[2]

        program.uniforms.uBackgroundColor.value[0] = backgroundColor[0]
        program.uniforms.uBackgroundColor.value[1] = backgroundColor[1]
        program.uniforms.uBackgroundColor.value[2] = backgroundColor[2]
      }

      renderer.render({ scene: mesh })
      frameRef.current = requestAnimationFrame(loop)
    }

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', () => {
      setTimeout(resize, 100)
    })

    resize()
    loop()

    return () => {
      cancelAnimationFrame(frameRef.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    animatedValuesRef.current.targetSpeed = speed
    animatedValuesRef.current.targetOpacity = opacity
    animatedValuesRef.current.targetIntensity = intensity
    animatedValuesRef.current.targetMouseInfluence = mouseInfluence
  }, [speed, opacity, intensity, mouseInfluence])

  return <canvas ref={ref} className={`w-full h-full ${className}`} />
}

export default InteractiveCircleShader
