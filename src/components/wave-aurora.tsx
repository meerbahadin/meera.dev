'use client'

import { useRef, useEffect } from 'react'
import {
  Renderer,
  Program,
  Mesh,
  Triangle,
  Vec2,
  Texture,
  OGLRenderingContext,
} from 'ogl'

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

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uChannel0;
uniform float uSaturation;
uniform float uSpeed;
uniform float uNoise;

#define iTime uTime
#define iResolution uResolution
#define iChannel0 uChannel0

// Convert RGB to HSV
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Adjust saturation
vec3 adjustSaturation(vec3 color, float saturation) {
    vec3 hsv = rgb2hsv(color);
    hsv.y *= saturation;
    return hsv2rgb(hsv);
}

// Random noise function
float rand(vec2 co) {
    return fract(sin(dot(co * 0.123, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash12(vec2 p) {
  p = fract(p * vec2(443.8975, 441.4238));
  p += dot(p.yx, p.xy + 19.19);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i + vec2(0.0, 0.0)), hash12(i + vec2(1.0, 0.0)), u.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), 
    u.y
  );
}

float mNoise(in vec2 pos) {
  vec2 q = pos;
  mat2 m = mat2(0.36, 0.80, -0.80, 0.36);
  
  float amplitude = 0.5;
  float f = amplitude * noise(q);
  float scale = 2.12;
  
  for (int i = 0; i < 5; ++i) {    
    q = m * q * scale;
    f += amplitude * noise(q);
    amplitude *= 0.5;
  }
  return f;
}

vec3 stars(in vec2 pos) {
  vec3 col = vec3(0.0);
  vec2 n = floor(pos);
  vec2 f = fract(pos);
  vec2 dir = sign(f - 0.5);
  
  for(float j = 0.0; j <= 1.0; j += 1.0) {
    for(float i = 0.0; i <= 1.0; i += 1.0) {
      vec2 cell = vec2(i * dir.x, j * dir.y);
      vec2 p = (n + cell) + 0.5;
      vec4 rnd1 = texture2D(iChannel0, p / 256.0);
      float d = length(cell + rnd1.xy - f);                
      rnd1.w = max(0.2, rnd1.w);
      
      float dist = max(0.1, 1.0 - d);
      float starfo = pow(dist, 60.0) * 6.5 + pow(dist, 120.0);
      col += vec3(rnd1.z * 0.2) * rnd1.w * starfo;
    }
  }
  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  
  vec2 uv = p;
  
  float ny = p.y + 0.5;
  uv.y *= 0.45;
  uv.x *= 2.95;
  float t = iTime * 0.23 * uSpeed;
  uv.y += t;
  
  float fval1 = mNoise(uv);
  uv.x *= 0.64;
  
  float fval = 0.18 + (ny * 0.15);
  uv.x += 3.5 + (fval1 * fval);
  uv.y -= t * 0.91;
  float fval2 = mNoise(uv);
  
  float cut = 0.4;  
  fval1 = smoothstep(cut - 0.1, 1.8, fval1);
  fval2 = smoothstep(cut, 1.8, fval2);
  fval1 = fval1 + fval2;
  
  vec3 col1top = vec3(0.65, 1.0, 0.5);
  vec3 col1bot = vec3(1.35, 0.6, 0.55);
  vec3 col2top = vec3(0.5, 0.65, 1.1);
  vec3 col2bot = vec3(0.45, 0.6, 0.7);
  
  vec3 col1 = mix(col1bot, col1top, ny) * fval1;
  vec3 col2 = mix(col2bot, col2top, ny) * fval2;
  
  float blend = 0.5 + (sin(fval1 * 4.25 + fval2 * 1.75) * 0.225);
  vec3 color = mix(col1, col2, blend) * 1.61;
  ny = smoothstep(-0.5, 1.0, ny);
  color *= ny;
  
  color = clamp(color, vec3(0.0), vec3(1.0));
  float a = smoothstep(0.4, 0.0, length(color));
  color += stars(p * 15.0) * a;
  
  color *= 1.0 - 0.4 * dot(p, p);
  
  // Apply saturation adjustment
  color = adjustSaturation(color, uSaturation);
  
  fragColor = vec4(color.xyz, 1.0);
}

void main() {
  vec4 col;
  mainImage(col, gl_FragCoord.xy);
  
  // Add noise (like in reference)
  col.rgb += (rand(gl_FragCoord.xy + uTime) - 0.5) * uNoise;
  
  gl_FragColor = vec4(clamp(col.rgb, 0.0, 1.0), 1.0);
}
`

type Props = {
  speed?: number
  saturation?: number
  noiseIntensity?: number
  resolutionScale?: number
}

// Helper function for smooth interpolation (copied from reference)
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

export default function WaveAurora({
  speed = 1.0,
  saturation = 1.0,
  noiseIntensity = 0.0,
  resolutionScale = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  // persistent animated values that survive re-renders
  const animatedValuesRef = useRef({
    speed: speed,
    saturation: saturation,
    noiseIntensity: noiseIntensity,
    targetSpeed: speed,
    targetSaturation: saturation,
    targetNoiseIntensity: noiseIntensity,
  })

  const createNoiseTexture = (gl: WebGLRenderingContext) => {
    const size = 256
    const data = new Uint8Array(size * size * 4)

    for (let i = 0; i < size * size; i++) {
      const idx = i * 4
      data[idx] = Math.random() * 255
      data[idx + 1] = Math.random() * 255
      data[idx + 2] = Math.random() * 255
      data[idx + 3] = Math.random() * 255
    }

    return new Texture(gl as OGLRenderingContext, {
      image: data,
      width: size,
      height: size,
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      magFilter: gl.NEAREST,
      minFilter: gl.NEAREST,
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT,
    })
  }

  // Initialize WebGL only once
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const parent = canvas.parentElement as HTMLElement

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
    })

    const gl = renderer.gl
    const geometry = new Triangle(gl)

    // Create noise texture
    const noiseTexture = createNoiseTexture(gl)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uChannel0: { value: noiseTexture },
        uSaturation: { value: saturation },
        uSpeed: { value: speed },
        uNoise: { value: noiseIntensity },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    // Store refs
    rendererRef.current = renderer
    programRef.current = program
    meshRef.current = mesh
    startTimeRef.current = performance.now()

    const resize = () => {
      const w = parent.clientWidth
      const h = parent.clientHeight
      renderer.setSize(w * resolutionScale, h * resolutionScale)
      program.uniforms.uResolution.value.set(w, h)
    }

    const loop = () => {
      const lerpFactor = 0.02 // Same as reference

      // Smoothly interpolate towards target values (like in reference)
      animatedValuesRef.current.speed = lerp(
        animatedValuesRef.current.speed,
        animatedValuesRef.current.targetSpeed || speed,
        lerpFactor
      )
      animatedValuesRef.current.saturation = lerp(
        animatedValuesRef.current.saturation,
        animatedValuesRef.current.targetSaturation || saturation,
        lerpFactor
      )
      animatedValuesRef.current.noiseIntensity = lerp(
        animatedValuesRef.current.noiseIntensity,
        animatedValuesRef.current.targetNoiseIntensity || noiseIntensity,
        lerpFactor
      )

      // Update uniforms with animated values
      program.uniforms.uTime.value =
        ((performance.now() - startTimeRef.current) / 1000) *
        animatedValuesRef.current.speed
      program.uniforms.uSpeed.value = animatedValuesRef.current.speed
      program.uniforms.uSaturation.value = animatedValuesRef.current.saturation
      program.uniforms.uNoise.value = animatedValuesRef.current.noiseIntensity

      renderer.render({ scene: mesh })
      frameRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    resize()
    loop()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency - initialize once

  // Update target values when props change (but don't recreate WebGL)
  useEffect(() => {
    // Update target values for smooth interpolation
    animatedValuesRef.current.targetSpeed = speed
    animatedValuesRef.current.targetSaturation = saturation
    animatedValuesRef.current.targetNoiseIntensity = noiseIntensity
  }, [speed, saturation, noiseIntensity, resolutionScale])

  return <canvas ref={canvasRef} className='w-full h-full block' />
}
