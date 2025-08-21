'use client'

import React, { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Transform, Triangle } from 'ogl'
import { cn } from '@heroui/theme'

const vertex = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  iMouse;
uniform float glowWidth;
uniform float glowIntensity;
uniform float pulseSpeed;
uniform vec3  color1;
uniform vec3  color2;
uniform vec3  color3;
uniform float cornerRadius;
varying vec2  vUv;

// --- SDFs ---
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float gradientNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                 dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                 dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float getPerimeterPosition(vec2 uvCentered) {
  vec2 np = uvCentered * 2.0;
  float dl = abs(np.x + 1.0);
  float dr = abs(np.x - 1.0);
  float db = abs(np.y + 1.0);
  float dt = abs(np.y - 1.0);
  float md = min(min(dl, dr), min(db, dt));
  float perimeter = 0.0;
  if (md == dt) {
    perimeter = (np.x + 1.0) / 2.0 * 0.25;
  } else if (md == dr) {
    perimeter = 0.25 + (1.0 - np.y) / 2.0 * 0.25;
  } else if (md == db) {
    perimeter = 0.5 + (1.0 - np.x) / 2.0 * 0.25;
  } else {
    perimeter = 0.75 + (np.y + 1.0) / 2.0 * 0.25;
  }
  return perimeter;
}

void main() {
  vec2 uv  = vUv;
  vec2 pos = (uv - 0.5) * 2.0;

  float dist = -sdRoundBox(pos, vec2(1.0, 1.0), cornerRadius);
  float screenGlowWidth = glowWidth * 2.0;

  float glow = 0.0;
  float alpha = 0.0;

  if (dist > 0.0) {
    float innerFade = 1.0 - smoothstep(0.0, screenGlowWidth * 0.8, dist);
    glow += innerFade * 0.7;
    alpha = innerFade;
  }

  float edgeHighlight = exp(-dist * dist * 500.0 / (screenGlowWidth * screenGlowWidth)) * 0.9;
  glow += edgeHighlight;

  float secondaryGlow = exp(-dist * dist * 50.0 / (screenGlowWidth * screenGlowWidth)) * 0.4;
  glow += secondaryGlow;

  float tertiaryGlow = exp(-dist * dist * 10.0 / (screenGlowWidth * screenGlowWidth)) * 0.2;
  glow += tertiaryGlow;

  float timeFlow = iTime * pulseSpeed;

  float perimeterPos = getPerimeterPosition(uv - 0.5);
  float noiseVal = gradientNoise(vec2(perimeterPos * 8.0, timeFlow * 0.3)) * 0.1;

  float wave1 = sin((perimeterPos + timeFlow * 0.2 + noiseVal) * 6.2831853) * 0.5 + 0.5;
  float wave2 = sin((perimeterPos + timeFlow * 0.2 + 0.33 + noiseVal) * 6.2831853) * 0.5 + 0.5;
  float wave3 = sin((perimeterPos + timeFlow * 0.2 + 0.66 + noiseVal) * 6.2831853) * 0.5 + 0.5;

  float blend1 = pow(wave1, 2.0);
  float blend2 = pow(wave2, 2.0);
  float blend3 = pow(wave3, 2.0);
  float totalBlend = blend1 + blend2 + blend3 + 0.001;
  blend1 /= totalBlend; blend2 /= totalBlend; blend3 /= totalBlend;

  vec3 color = color1 * blend1 + color2 * blend2 + color3 * blend3;

  float edgeDist = max(0.0, dist) / screenGlowWidth;
  color = mix(color * 1.4, color, edgeDist);

  float pulse = sin(timeFlow * 2.0) * 0.08 + 0.92;
  float finalGlow = glow * pulse * glowIntensity;

  vec2 mousePos = (iMouse / iResolution - 0.5) * 2.0;
  float mouseDist = length(pos - mousePos);
  float mouseGlow = exp(-mouseDist * mouseDist * 2.0) * 0.2;
  float edgeProx = exp(-dist * dist * 20.0 / (screenGlowWidth * screenGlowWidth));
  finalGlow += mouseGlow * edgeProx;

  float finalAlpha = alpha * glowIntensity;

  if (dist > screenGlowWidth * 1.5) {
    finalAlpha = 0.0;
    finalGlow = 0.0;
  }

  finalAlpha = clamp(finalAlpha, 0.0, 1.0);
  finalGlow = clamp(finalGlow, 0.0, 2.0);

  gl_FragColor = vec4(color * finalGlow, finalAlpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace('#', '').toLowerCase()
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  } else if (h.length === 4) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (h.length === 8) {
    h = h.slice(0, 6)
  }
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return [1, 1, 1]
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return [r, g, b]
}

export default function Siri({
  glowWidth = 0.12,
  glowIntensity = 1.0,
  pulseSpeed = 1.0,
  color1 = '#6b55d8',
  color2 = '#000',
  color3 = '#f1603b',
  cornerRadius = 0,
  className = '',
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const sceneRef = useRef<Transform | null>(null)
  const rafRef = useRef<number>(0)

  const mouseTarget = useRef({ x: 0, y: 0 })
  const mouseUniform = useRef({ x: 0, y: 0 })

  const getDPR = () => {
    return /Android/i.test(navigator.userAgent)
      ? 1.0
      : Math.min(window.devicePixelRatio, 2)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = getDPR()
    const renderer = new Renderer({
      canvas,
      dpr,
      alpha: true,
      antialias: false, // Changed to false for better performance
      powerPreference: 'high-performance',
    })
    rendererRef.current = renderer

    const gl = renderer.gl

    const tri = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        iMouse: { value: [0, 0] },
        glowWidth: { value: glowWidth },
        glowIntensity: { value: glowIntensity },
        pulseSpeed: { value: pulseSpeed },
        color1: { value: hexToRgb(color1) },
        color2: { value: hexToRgb(color2) },
        color3: { value: hexToRgb(color3) },
        cornerRadius: { value: cornerRadius },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry: tri, program })
    meshRef.current = mesh
    const scene = new Transform()
    mesh.setParent(scene)
    sceneRef.current = scene

    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    const setSize = () => {
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
      program.uniforms.iResolution.value = [w * currentDpr, h * currentDpr]
    }
    setSize()

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const currentDpr = getDPR()

      mouseTarget.current.x = (e.clientX - rect.left) * currentDpr
      mouseTarget.current.y =
        (rect.height - (e.clientY - rect.top)) * currentDpr
    }

    const resize = () => setSize()

    canvas.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', () => {
      setTimeout(resize, 100)
    })

    const start = performance.now()
    const loop = () => {
      const t = (performance.now() - start) / 1000
      mouseUniform.current.x +=
        (mouseTarget.current.x - mouseUniform.current.x) * 0.1
      mouseUniform.current.y +=
        (mouseTarget.current.y - mouseUniform.current.y) * 0.1

      program.uniforms.iTime.value = t
      program.uniforms.iMouse.value = [
        mouseUniform.current.x,
        mouseUniform.current.y,
      ]

      renderer.render({ scene })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [
    glowWidth,
    glowIntensity,
    pulseSpeed,
    color1,
    color2,
    color3,
    cornerRadius,
  ])

  useEffect(() => {
    const program = programRef.current
    if (!program) return
    program.uniforms.glowWidth.value = glowWidth
    program.uniforms.glowIntensity.value = glowIntensity
    program.uniforms.pulseSpeed.value = pulseSpeed
    program.uniforms.cornerRadius.value = cornerRadius
    program.uniforms.color1.value = hexToRgb(color1)
    program.uniforms.color2.value = hexToRgb(color2)
    program.uniforms.color3.value = hexToRgb(color3)
  }, [
    glowWidth,
    glowIntensity,
    pulseSpeed,
    cornerRadius,
    color1,
    color2,
    color3,
  ])

  return <canvas ref={canvasRef} className={cn(`w-full h-96`, className)} />
}
