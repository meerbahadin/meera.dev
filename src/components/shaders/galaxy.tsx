'use client'

import { useRef, useEffect } from 'react'
import { Renderer, Program, Triangle, Mesh, Vec2 } from 'ogl'
import { cn } from '@heroui/theme'

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

// Controls how many layers of stars
#define LAYERS 2.0

#define PI 3.141592654
#define TAU (2.0*PI)
#define TIME mod(uTime, 30.0)
#define TTIME (TAU*TIME)
#define RESOLUTION uResolution

mat2 rot(float a) {
  return mat2(cos(a), sin(a), -sin(a), cos(a));
}

float sRGBFloat(float t) { 
  return mix(1.055*pow(t, 1./2.4) - 0.055, 12.92*t, step(t, 0.0031308)); 
}

vec3 sRGBVec3(in vec3 c) { 
  return vec3(sRGBFloat(c.x), sRGBFloat(c.y), sRGBFloat(c.z)); 
}

vec3 aces_approx(vec3 v) {
  v = max(v, 0.0);
  v *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);
}

float tanh_approx(float x) {
  float x2 = x*x;
  return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
}

vec3 tanh_approx_vec3(vec3 x) {
  return vec3(tanh_approx(x.x), tanh_approx(x.y), tanh_approx(x.z));
}

const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}

vec2 mod2(inout vec2 p, vec2 size) {
  vec2 c = floor((p + size*0.5)/size);
  p = mod(p + size*0.5, size) - size*0.5;
  return c;
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p)*43758.5453123);
}

vec2 shash2(vec2 p) {
  return -1.0+2.0*hash2(p);
}

vec3 toSpherical(vec3 p) {
  float r = length(p);
  float t = acos(p.z/r);
  float ph = atan(p.y, p.x);
  return vec3(r, t, ph);
}

vec3 blackbody(float Temp) {
  vec3 col = vec3(255.);
  col.x = 56100000. * pow(Temp, (-3. / 2.)) + 148.;
  col.y = 100.04 * log(Temp) - 623.6;
  if (Temp > 6500.) col.y = 35200000. * pow(Temp, (-3. / 2.)) + 184.;
  col.z = 194.18 * log(Temp) - 1448.6;
  col = clamp(col, 0., 255.)/255.;
  if (Temp < 1000.) col *= Temp/1000.;
  return col;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  
  float n = mix(
    mix(dot(shash2(i + vec2(0.,0.)), f - vec2(0.,0.)), 
        dot(shash2(i + vec2(1.,0.)), f - vec2(1.,0.)), u.x),
    mix(dot(shash2(i + vec2(0.,1.)), f - vec2(0.,1.)), 
        dot(shash2(i + vec2(1.,1.)), f - vec2(1.,1.)), u.x), u.y);
  
  return 2.0*n;              
}

float fbm(vec2 p, float o, float s, int iters) {
  p *= s;
  p += o;
  
  const float aa = 0.5;
  const mat2 pp = mat2(2.0*cos(1.0), 2.0*sin(1.0), -2.0*sin(1.0), 2.0*cos(1.0));
  
  float h = 0.0;
  float a = 1.0;
  float d = 0.0;
  for (int i = 0; i < 4; ++i) {
    if (i >= iters) break;
    d += a;
    h += a*noise(p);
    p += vec2(10.7, 8.3);
    p = pp * p;
    a *= aa;
  }
  h /= d;
  
  return h;
}

float height(vec2 p) {
  float h = fbm(p, 0.0, 5.0, 4);
  h *= 0.3;
  return h;
}

vec3 stars(vec3 ro, vec3 rd, vec2 sp, float hh) {
  vec3 col = vec3(0.0);
  
  const float m = LAYERS;
  hh = tanh_approx(20.0*hh);
  
  for (float i = 0.0; i < m; ++i) {
    vec2 pp = sp + 0.8*i;
    float s = i/(m-1.0);
    vec2 dim = vec2(mix(0.15, 0.01, s)*PI);
    vec2 np = mod2(pp, dim);
    vec2 h = hash2(np+127.0+i);
    vec2 o = -1.0+2.0*h;
    float y = sin(sp.x);
    pp += o*dim*0.3;
    pp.y *= y;
    float l = length(pp);
    
    float h1 = fract(h.x*1667.0);
    float h2 = fract(h.x*1887.0);
    float h3 = fract(h.x*2997.0);
    float h4 = fract(h.x*4321.0);
    
    vec3 scol = vec3(0.0);
    float intensity = mix(12.0*h2, 0.6*h2*h2, s);
    
    // Simplified pulsing
    float pulse = 0.9 + 0.2 * sin(uTime * 2.0 + h1 * 8.0);
    intensity *= pulse;
    
    if (h4 > 0.99) {
      // Blue supergiants - simplified
      scol = intensity * 4.0 * blackbody(mix(12000.0, 20000.0, h1)) * vec3(0.9, 1.0, 1.2);
    } else if (h4 > 0.95) {
      // Red giants - simplified
      scol = intensity * 2.5 * blackbody(mix(3000.0, 4500.0, h1)) * vec3(1.2, 0.8, 0.5);
    } else {
      // Main sequence stars
      scol = intensity * blackbody(mix(3500.0, 10000.0, h1*h1));
    }
    
    float sharpness = mix(8000.0, 1500.0, hh) / mix(3.0, 0.3, s);
    float starCore = exp(-sharpness * max(l-0.001, 0.0));
    
    // Simplified spikes for bright stars only
    if (h4 > 0.98) {
      float spike1 = exp(-150.0 * abs(pp.x)) * exp(-6000.0 * abs(pp.y));
      float spike2 = exp(-150.0 * abs(pp.y)) * exp(-6000.0 * abs(pp.x));
      starCore += 0.2 * max(spike1, spike2);
    }
    
    vec3 ccol = col + starCore * scol;
    col = h3 < y ? ccol : col;
  }
  
  return col;
}

vec2 raySphere(vec3 ro, vec3 rd, vec4 sph) {
  vec3 oc = ro - sph.xyz;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - sph.w*sph.w;
  float h = b*b - c;
  if (h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h);
}

vec4 moon(vec3 ro, vec3 rd, vec2 sp, vec3 lp, vec4 md) {
  vec2 mi = raySphere(ro, rd, md);
  
  if (mi.x < 0.0) return vec4(0.0, 0.0, 0.0, 0.0);
  
  vec3 p = ro + mi.x*rd;
  vec3 n = normalize(p-md.xyz);
  vec3 r = reflect(rd, n);
  vec3 ld = normalize(lp - p);
  float fre = dot(n, rd)+1.0;
  fre = pow(fre, 15.0);
  float dif = max(dot(ld, n), 0.0);
  float spe = pow(max(dot(ld, r), 0.0), 8.0);
  float intensity = 0.5*tanh_approx(20.0*fre*spe+0.05*dif);
  vec3 col = blackbody(1500.0)*intensity+hsv2rgb(vec3(0.6, mix(0.6, 0.0, intensity), intensity));
  
  float t = tanh_approx(0.25*(mi.y-mi.x));
  
  return vec4(vec3(col), t);
}

vec3 sky(vec3 ro, vec3 rd, vec2 sp, vec3 lp, out float cf) {
  float ld = max(dot(normalize(lp-ro), rd), 0.0);
  float y = -0.5+sp.x/PI;
  y = max(abs(y)-0.02, 0.0)+0.1*smoothstep(0.5, PI, abs(sp.y));
  vec3 blue = hsv2rgb(vec3(0.6, 0.75, 0.35*exp(-15.0*y)));
  float ci = pow(ld, 10.0)*2.0*exp(-25.0*y); 
  vec3 yellow = blackbody(1500.0)*ci;
  cf = ci;
  return blue+yellow;
}

vec3 galaxy(vec3 ro, vec3 rd, vec2 sp, out float sf) {
  vec2 gp = sp;
  gp = rot(0.67) * gp;
  gp += vec2(-1.0, 0.5);
  
  // Simplified height calculation
  float h1 = height(2.0*sp);
  
  float gcc = dot(gp, gp);
  float gcx = exp(-(abs(2.5*(gp.x))));
  float gcy = exp(-abs(9.0*(gp.y)));
  
  // Simplified spiral pattern
  float spiralAngle = atan(gp.y, gp.x);
  float spiral1 = sin(2.5 * spiralAngle + 1.0 * length(gp) + uTime * 0.2);
  float spiralPattern = 0.5 + 0.3 * spiral1;
  spiralPattern = smoothstep(0.4, 1.0, spiralPattern);
  
  // Simplified bar
  float bar = exp(-abs(6.0 * gp.x)) * exp(-abs(2.0 * gp.y));
  
  float gh = gcy * gcx * (0.8 + 0.4 * spiralPattern + 0.2 * bar);
  float cf = smoothstep(0.05, -0.2, -h1);
  
  vec3 col = vec3(0.0);
  
  // Simplified core
  vec3 coreColor = 2.0 * blackbody(mix(800.0, 1800.0, gcx*gcy)) * gcy * gcx;
  col += coreColor;
  
  // Simplified spiral arms
  vec3 armColor = hsv2rgb(vec3(0.58, 0.6, 0.002/max(gcc, 0.1)));
  col += armColor * spiralPattern * gh * 0.7;
  
  // Simplified H-II regions
  float starFormation = fbm(gp * 8.0, 0.0, 1.0, 2);
  starFormation = smoothstep(0.6, 0.8, starFormation);
  vec3 hiiColor = hsv2rgb(vec3(0.95, 0.7, 0.003/max(gcc, 0.1)));
  col += hiiColor * starFormation * spiralPattern * gh * 0.5;
  
  // Basic halo
  vec3 haloColor = hsv2rgb(vec3(0.6, 0.3, 0.0006/max(gcc, 0.05)));
  col += haloColor;
  
  // Simplified dust
  float dust = smoothstep(0.015, 0.0, abs(gp.y)) * gcx;
  col *= (1.0 - 0.4*dust);
  
  col *= mix(mix(0.15, 1.2, gcy*gcx), 1.0, cf);
  
  sf = gh*cf;
  return col;
}

vec3 grid(vec3 ro, vec3 rd, vec2 sp) {
  const vec2 dim = vec2(1.0/8.0*PI);
  vec2 pp = sp;
  vec2 np = mod2(pp, dim);
  
  vec3 col = vec3(0.0);
  
  float y = sin(sp.x);
  float d = min(abs(pp.x), abs(pp.y*y));
  
  // Very light gray grid - no color changes, no pulsing
  vec3 gridColor = vec3(0.15, 0.15, 0.16); // Very light gray
  
  col += gridColor * exp(-2000.0*max(d-0.00025, 0.0));
  
  return 0.12*tanh_approx_vec3(col); // Reduced intensity for subtle effect
}

vec3 color(vec3 ro, vec3 rd, vec3 lp, vec4 md) {
  vec2 sp = toSpherical(rd.xzy).yz;
  
  float sf = 0.0;
  float cf = 0.0;
  vec3 col = vec3(0.0);
  
  vec4 mcol = moon(ro, rd, sp, lp, md);
  
  col += stars(ro, rd, sp, sf)*(1.0-tanh_approx(2.0*cf));
  col += galaxy(ro, rd, sp, sf);
  col = mix(col, mcol.xyz, mcol.w);
  col += sky(ro, rd, sp, lp, cf);
  col += grid(ro, rd, sp);
  
  if (rd.y < 0.0) {
    col = vec3(0.0);
  }
  
  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 q = fragCoord / uResolution.xy;
  vec2 p = -1.0 + 2.0*q;
  p.x *= RESOLUTION.x/RESOLUTION.y;
  
  vec3 ro = vec3(0.0, 0.0, 0.0);
  vec3 lp = 500.0*vec3(1.0, -0.25, 0.0);
  vec4 md = 50.0*vec4(vec3(1.0, 1., -0.6), 0.5);
  vec3 la = vec3(1.0, 0.5, 0.0);
  vec3 up = vec3(0.0, 1.0, 0.0);
  la.xz = rot(TTIME/60.0-PI/2.0) * la.xz;
  
  vec3 ww = normalize(la - ro);
  vec3 uu = normalize(cross(up, ww));
  vec3 vv = normalize(cross(ww, uu));
  vec3 rd = normalize(p.x*uu + p.y*vv + 2.0*ww);
  vec3 col = color(ro, rd, lp, md);
  
  col *= smoothstep(0.0, 4.0, TIME)*smoothstep(30.0, 26.0, TIME);
  col = aces_approx(col);
  col = sRGBVec3(col);
  
  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 col;
  mainImage(col, gl_FragCoord.xy);
  gl_FragColor = col;
}
`

interface StarGalaxyBackgroundProps {
  speed?: number
  className?: string
}

const StarGalaxyBackground: React.FC<StarGalaxyBackgroundProps> = ({
  speed = 1.0,
  className = '',
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const timeAccumulatorRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)

  const animatedValuesRef = useRef({
    speed: speed,
    targetSpeed: speed,
  })

  const getDPR = () => {
    return /Android/i.test(navigator.userAgent)
      ? 1.0
      : Math.min(window.devicePixelRatio, 2)
  }

  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor
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
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    rendererRef.current = renderer
    programRef.current = program
    meshRef.current = mesh
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

      timeAccumulatorRef.current += deltaTime * animatedValuesRef.current.speed

      program.uniforms.uTime.value = timeAccumulatorRef.current

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
  }, [speed])

  return (
    <canvas
      ref={ref}
      className={cn(`w-full h-full bg-background`, className)}
    />
  )
}

export default StarGalaxyBackground
