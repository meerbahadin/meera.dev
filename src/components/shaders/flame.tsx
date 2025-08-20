'use client'

import { useRef, useEffect } from 'react'
import { Renderer, Program, Triangle, Mesh, Vec2, Texture } from 'ogl'

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
uniform float uSpeed;
uniform float uIntensity;
uniform float uSaturation;
uniform sampler2D uNoiseTexture;

/*
    "Turbulent Flame" by @XorDev
    
    For my tutorial on Turbulence:
    https://mini.gmshaders.com/p/turbulence
    
    Simulating proper fluid dynamics can be complicated, limited, and requires a multi-pass setup.
    Sometimes you just want some smoke, fire, or fluid, and you don't want to go through all that trouble.
    This method is very simple! Start with pixel coordinates and scale them down as desired,
    then loop through adding waves, rotating the wave direction and increasing the frequency.
    To animate it, you can add a time offset to the sine wave.
    It also helps to shift each iteration with the iterator "i" to break up visible patterns.
    The resulting coordinates will appear turbulent, and you can use these coordinates in a coloring function.
    
    Smooth, continious equations look best!
    
    To complete the flame look, we need to scroll the waves and expand the coordinate space upwards 
*/

//Fire ring radius
#define RADIUS 0.4
//Falloff gradient
#define GRADIENT 0.3
//Scroll speed
#define SCROLL 1.6
//Flicker intensity
#define FLICKER 0.12
//Flicker animation speed
#define FLICKER_SPEED 12.0
//Number of turbulence waves
#define TURB_NUM 10.0
//Turbulence wave amplitude
#define TURB_AMP 0.4
//Turbulence wave speed
#define TURB_SPEED 6.0
//Turbulence frequency (inverse of scale)
#define TURB_FREQ 7.0
//Turbulence frequency multiplier
#define TURB_EXP 1.3

vec3 adjustSaturation(vec3 color, float saturation) {
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(vec3(gray), color, saturation);
}

//Apply turbulence to coordinates
vec2 turbulence(vec2 p)
{
    //Turbulence starting scale
    float freq = TURB_FREQ;
    
    //Turbulence rotation matrix
    mat2 rot = mat2(0.6, -0.8, 0.8, 0.6);
    
    //Loop through turbulence octaves
    for(float i=0.0; i<TURB_NUM; i++)
    {
        //Scroll along the rotated y coordinate
        float phase = freq * (p * rot).y + TURB_SPEED*uTime + i;
        //Add a perpendicular sine wave offset
        p += TURB_AMP * rot[0] * sin(phase) / freq;
        
        //Rotate for the next octave
        rot *= mat2(0.6, -0.8, 0.8, 0.6);
        //Scale down for the next octave
        freq *= TURB_EXP;
    }
    
    return p;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //Screen coordinates, centered and aspect corrected
    vec2 p = (fragCoord.xy*2.0-uResolution.xy) / uResolution.y;
    vec2 screen = p;
    
    //Expand vertically
    float xstretch = 2.0 - 1.5*smoothstep(-2.0,2.0,p.y);
    //Decelerate horizontally
    float ystretch = 1.0 - 0.5 / (1.0+p.x*p.x);
    //Combine
    vec2 stretch = vec2(xstretch, ystretch);
    //Stretch coordinates
    p *= stretch;
    
    //Scroll upward
    float scroll = SCROLL*uTime;
    p.y -= scroll;
    
    p = turbulence(p);
    
    //Reverse the scrolling offset
    p.y += scroll;
    
    //Distance to fireball
    float dist = length(min(p,p/vec2(1,stretch.y))) - RADIUS;
    //Attenuate outward and fade vertically
    float light = 1.0/pow(dist*dist+GRADIENT*max(p.y+.5,0.0),3.0);
    //Coordinates relative to the source
    vec2 source = p + 2.0*vec2(0,RADIUS) * stretch;
    //RGB falloff gradient
    vec3 grad = 0.1 / (1.0 + 8.0*length(source) / vec3(9, 2, 1));
    
    //Flicker animation time
    float ft = FLICKER_SPEED * uTime;
    //Flicker brightness
    float flicker = 1.0+FLICKER*cos(ft+sin(ft*1.618-p.y));
    //Ambient lighting
    vec3 amb = 16.0*flicker/(1.0+dot(screen,screen))*grad;
    
    //Scrolling texture uvs
    vec2 uv = (p - SCROLL*vec2(0,uTime)) / 1e2 * TURB_FREQ;
    //Sample texture for fire
    vec3 tex = texture2D(uNoiseTexture,uv).rgb;
    
    //Combine ambient light and fire
    vec3 col = amb + light*grad*tex;
    //Exponential tonemap
    //https://mini.gmshaders.com/p/tonemaps
    col = 1.0 - exp(-col);
    
    // Apply intensity and saturation
    col *= uIntensity;
    col = adjustSaturation(col, uSaturation);
    
    fragColor = vec4(col,1);
}

void main() {
  vec4 col;
  mainImage(col, gl_FragCoord.xy);
  gl_FragColor = col;
}
`

type FlameProps = {
  speed?: number
  intensity?: number
  saturation?: number
  resolutionScale?: number
  className?: string
}

const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

// Define DPR calculation once and reuse it
const getDPR = () => {
  return /Android/i.test(navigator.userAgent)
    ? 1.0
    : Math.min(window.devicePixelRatio, 2)
}

export default function Flame({
  speed = 1.0,
  intensity = 1.0,
  saturation = 1.0,
  className = '',
}: FlameProps) {
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
    intensity: intensity,
    saturation: saturation,
    targetSpeed: speed,
    targetIntensity: intensity,
    targetSaturation: saturation,
  })

  useEffect(() => {
    if (!ref.current) return

    const canvas = ref.current
    const parent = canvas.parentElement as HTMLElement
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

    // Create noise texture
    const createNoiseTexture = () => {
      const size = 256
      const data = new Uint8Array(size * size * 4)
      for (let i = 0; i < size * size; i++) {
        const noise = Math.random()
        data[i * 4] = noise * 255
        data[i * 4 + 1] = noise * 255
        data[i * 4 + 2] = noise * 255
        data[i * 4 + 3] = 255
      }

      return new Texture(gl, {
        image: data,
        width: size,
        height: size,
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.REPEAT,
        wrapT: gl.REPEAT,
      })
    }

    const noiseTexture = createNoiseTexture()

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uSpeed: { value: animatedValuesRef.current.speed },
        uIntensity: { value: animatedValuesRef.current.intensity },
        uSaturation: { value: animatedValuesRef.current.saturation },
        uNoiseTexture: { value: noiseTexture },
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

      const w = parent.clientWidth
      const h = parent.clientHeight

      // Use consistent DPR calculation
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

      animatedValuesRef.current.intensity = lerp(
        animatedValuesRef.current.intensity,
        animatedValuesRef.current.targetIntensity,
        lerpFactor
      )

      animatedValuesRef.current.saturation = lerp(
        animatedValuesRef.current.saturation,
        animatedValuesRef.current.targetSaturation,
        lerpFactor
      )

      timeAccumulatorRef.current += deltaTime * animatedValuesRef.current.speed

      program.uniforms.uTime.value = timeAccumulatorRef.current
      program.uniforms.uSpeed.value = animatedValuesRef.current.speed
      program.uniforms.uIntensity.value = animatedValuesRef.current.intensity
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
    animatedValuesRef.current.targetIntensity = intensity
    animatedValuesRef.current.targetSaturation = saturation
  }, [speed, intensity, saturation])

  return <canvas ref={ref} className={`w-full h-full block ${className}`} />
}
