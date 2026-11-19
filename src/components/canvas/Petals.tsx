import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from '../../lib/vegetation'

const COUNT = 140

const CENTERS: Array<[number, number]> = [
  [3.45, 1.04],
  [2.6, 3.66],
  [1.1, 3.38],
  [0.85, 3.28],
  [1.12, 6.82],
]

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float size = 55.0 * uPixelRatio / max(-mvPosition.z, 1.0);
    gl_PointSize = clamp(size * (0.85 + 0.25 * sin(uTime * 2.0 + aPhase)), 1.0, 7.0 * uPixelRatio);
    vAlpha = 0.5 + 0.35 * sin(uTime * 1.4 + aPhase * 1.7);
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceToCenter = length(point);
    if (distanceToCenter > 0.5) discard;
    float alpha = smoothstep(0.5, 0.12, distanceToCenter) * vAlpha * 0.85;
    gl_FragColor = vec4(0.99, 0.8, 0.85, alpha);
    #include <colorspace_fragment>
  }
`

/** Kelopak kamboja yang melayang di sekitar pura dan kota. */
export function Petals() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const dpr = useThree((state) => state.viewport.dpr)

  const { geometry, seeds } = useMemo(() => {
    const random = mulberry32(0x0beef)
    const seeds = Array.from({ length: COUNT }, () => {
      const center = CENTERS[Math.floor(random() * CENTERS.length)]
      return {
        baseX: center[0] + (random() - 0.5) * 1.8,
        baseZ: center[1] + (random() - 0.5) * 1.8,
        startY: 0.2 + random() * 1.5,
        speed: 0.05 + random() * 0.07,
        sway: 0.04 + random() * 0.07,
        phase: random() * Math.PI * 2,
      }
    })

    const positions = new Float32Array(COUNT * 3)
    const phases = new Float32Array(COUNT)
    seeds.forEach((seed, index) => {
      positions[index * 3] = seed.baseX
      positions[index * 3 + 1] = seed.startY
      positions[index * 3 + 2] = seed.baseZ
      phases[index] = seed.phase
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    return { geometry, seeds }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    }),
    [dpr],
  )

  useFrame((state, delta) => {
    const material = materialRef.current
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uPixelRatio.value = state.viewport.dpr
    }

    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute
    const positions = attribute.array as Float32Array
    const time = state.clock.elapsedTime

    seeds.forEach((seed, index) => {
      let y = positions[index * 3 + 1] - seed.speed * delta
      if (y < 0.06) y = 1.55 + (index % 6) * 0.05
      positions[index * 3] = seed.baseX + Math.sin(time * 0.8 + seed.phase) * seed.sway
      positions[index * 3 + 1] = y
      positions[index * 3 + 2] =
        seed.baseZ + Math.cos(time * 0.62 + seed.phase * 1.3) * seed.sway * 0.7
    })

    attribute.needsUpdate = true
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
