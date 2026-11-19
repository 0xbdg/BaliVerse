import * as THREE from 'three'
import { mulberry32 } from './vegetation'

interface RockPillarOptions {
  bottomRadius: number
  topRadius: number
  height: number
  sides?: number
  seed?: number
  leanX?: number
  leanZ?: number
}

/**
 * Pilar batu low-poly dengan sisi tidak beraturan.
 * Dipakai untuk tebing Uluwatu dan Kelingking agar tidak berbentuk kerucut sempurna.
 */
export function createRockPillarGeometry({
  bottomRadius,
  topRadius,
  height,
  sides = 7,
  seed = 1,
  leanX = 0,
  leanZ = 0,
}: RockPillarOptions): THREE.BufferGeometry {
  const random = mulberry32(seed)
  const bottom: Array<[number, number, number]> = []
  const top: Array<[number, number, number]> = []

  for (let i = 0; i < sides; i += 1) {
    const angle = (i / sides) * Math.PI * 2
    const bottomJitter = 0.82 + random() * 0.36
    const topJitter = 0.82 + random() * 0.36
    bottom.push([
      Math.cos(angle) * bottomRadius * bottomJitter,
      0,
      Math.sin(angle) * bottomRadius * bottomJitter,
    ])
    top.push([
      Math.cos(angle) * topRadius * topJitter + leanX,
      height,
      Math.sin(angle) * topRadius * topJitter + leanZ,
    ])
  }

  const positions: number[] = []

  for (let i = 0; i < sides; i += 1) {
    const next = (i + 1) % sides
    const b0 = bottom[i]
    const b1 = bottom[next]
    const t0 = top[i]
    const t1 = top[next]

    positions.push(...b0, ...t0, ...b1)
    positions.push(...b1, ...t0, ...t1)
  }

  const center: [number, number, number] = [leanX, height, leanZ]
  for (let i = 0; i < sides; i += 1) {
    const next = (i + 1) % sides
    positions.push(...center, ...top[next], ...top[i])
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}
