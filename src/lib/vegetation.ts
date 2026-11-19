import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function fract(value: number) {
  return value - Math.floor(value)
}

function paint(
  geometry: THREE.BufferGeometry,
  color: THREE.Color,
  jitter = 0.08,
): THREE.BufferGeometry {
  const painted = geometry.index ? geometry.toNonIndexed() : geometry
  painted.deleteAttribute('uv')
  painted.deleteAttribute('uv1')
  painted.deleteAttribute('uv2')
  painted.deleteAttribute('tangent')

  const count = painted.getAttribute('position').count
  const colors = new Float32Array(count * 3)
  const scratch = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    const noise = fract(Math.sin(i * 12.9898 + 4.1414) * 43758.5453)
    scratch.copy(color).multiplyScalar(1 - jitter / 2 + noise * jitter)
    colors[i * 3] = scratch.r
    colors[i * 3 + 1] = scratch.g
    colors[i * 3 + 2] = scratch.b
  }

  painted.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return painted
}

function createLeafGeometry(length: number, width: number, droop: number) {
  const xs = [0, length * 0.36, length * 0.7, length]
  const ys = [0, 0.012, -0.025, -droop]
  const halfWidths = [0.012, width * 0.5, width * 0.4, 0.004]
  const positions: number[] = []

  for (let i = 0; i < 3; i += 1) {
    const x0 = xs[i]
    const x1 = xs[i + 1]
    const y0 = ys[i]
    const y1 = ys[i + 1]
    const w0 = halfWidths[i]
    const w1 = halfWidths[i + 1]

    positions.push(
      x0, y0, -w0,
      x1, y1, -w1,
      x0, y0, w0,
      x0, y0, w0,
      x1, y1, -w1,
      x1, y1, w1,
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

const TRUNK_COLOR = new THREE.Color('#7c5a3b')
const FROND_COLORS = ['#2f6b39', '#3c7d42', '#34733c', '#448748'].map(
  (hex) => new THREE.Color(hex),
)
const COCONUT_COLOR = new THREE.Color('#5b4026')

export function createPalmGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []

  const trunk = new THREE.CylinderGeometry(0.026, 0.052, 0.56, 5, 1)
  trunk.translate(0, 0.28, 0)
  parts.push(paint(trunk, TRUNK_COLOR, 0.12))

  const frondCount = 9
  for (let i = 0; i < frondCount; i += 1) {
    const length = 0.36 + (i % 3) * 0.035
    const droop = 0.09 + (i % 2) * 0.03
    const leaf = createLeafGeometry(length, 0.1, droop)
    leaf.rotateZ(-0.12 - (i % 3) * 0.1)
    leaf.rotateY((i / frondCount) * Math.PI * 2 + (i % 2) * 0.16)
    leaf.translate(0, 0.56, 0)
    parts.push(paint(leaf, FROND_COLORS[i % FROND_COLORS.length], 0.1))
  }

  for (let i = 0; i < 3; i += 1) {
    const angle = (i / 3) * Math.PI * 2
    const coconut = new THREE.SphereGeometry(0.024, 5, 4)
    coconut.translate(Math.cos(angle) * 0.035, 0.535, Math.sin(angle) * 0.035)
    parts.push(paint(coconut, COCONUT_COLOR, 0.08))
  }

  const merged = mergeGeometries(parts, false)
  if (!merged) throw new Error('Gagal menggabungkan geometri pohon kelapa.')
  merged.computeBoundingSphere()
  return merged
}

const FRANGIPANI_TRUNK = new THREE.Color('#6d5339')
const FRANGIPANI_COLORS = [
  '#f7e9df',
  '#f2d7d7',
  '#eebfc8',
  '#6f9a5a',
  '#f8eee6',
  '#f3d9dc',
  '#5f8d50',
  '#f6e3e1',
  '#eab6c2',
].map((hex) => new THREE.Color(hex))

export function createFrangipaniGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []

  const trunk = new THREE.CylinderGeometry(0.018, 0.034, 0.22, 5, 1)
  trunk.translate(0, 0.11, 0)
  parts.push(paint(trunk, FRANGIPANI_TRUNK, 0.1))

  for (let i = 0; i < 3; i += 1) {
    const branch = new THREE.CylinderGeometry(0.007, 0.014, 0.18, 4, 1)
    branch.translate(0, 0.09, 0)
    branch.rotateZ(0.72)
    branch.rotateY((i / 3) * Math.PI * 2)
    branch.translate(0, 0.2, 0)
    parts.push(paint(branch, FRANGIPANI_TRUNK, 0.1))
  }

  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2
    const radius = i === 8 ? 0 : 0.095
    const blob = new THREE.IcosahedronGeometry(0.062, 0)
    blob.scale(1.1, 0.82, 1.1)
    blob.translate(
      Math.cos(angle) * radius,
      0.31 + (i % 3) * 0.035 + (i === 8 ? 0.06 : 0),
      Math.sin(angle) * radius,
    )
    parts.push(paint(blob, FRANGIPANI_COLORS[i], 0.06))
  }

  const merged = mergeGeometries(parts, false)
  if (!merged) throw new Error('Gagal menggabungkan geometri pohon kamboja.')
  merged.computeBoundingSphere()
  return merged
}

let palmGeometry: THREE.BufferGeometry | null = null
let frangipaniGeometry: THREE.BufferGeometry | null = null

export function getPalmGeometry() {
  if (!palmGeometry) palmGeometry = createPalmGeometry()
  return palmGeometry
}

export function getFrangipaniGeometry() {
  if (!frangipaniGeometry) frangipaniGeometry = createFrangipaniGeometry()
  return frangipaniGeometry
}

/** PRNG deterministik agar sebaran vegetasi stabil antar-render. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
