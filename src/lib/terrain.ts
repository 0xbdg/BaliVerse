import * as THREE from 'three'
import { ISLAND_SCALE } from '../data/island'

export interface PreparedIsland {
  geometry: THREE.BufferGeometry
  shoreMask: THREE.DataTexture
  /** minX, minZ, 1 / width, 1 / depth */
  shoreBounds: THREE.Vector4
  maxHeight: number
  /** Sampel ketinggian untuk menempatkan vegetasi & landmark. */
  heightField: HeightField
}

/**
 * Heightfield kasar (grid) hasil sampling mesh terrain.
 * Dipakai untuk menempelkan objek ke permukaan tanpa raycast 322k triangle.
 */
export class HeightField {
  readonly minX: number
  readonly maxX: number
  readonly minZ: number
  readonly maxZ: number
  readonly resolution: number
  private readonly data: Float32Array

  constructor(
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    resolution: number,
    data: Float32Array,
  ) {
    this.minX = minX
    this.maxX = maxX
    this.minZ = minZ
    this.maxZ = maxZ
    this.resolution = resolution
    this.data = data
  }

  heightAt(x: number, z: number): number {
    const u = (x - this.minX) / (this.maxX - this.minX)
    const v = (z - this.minZ) / (this.maxZ - this.minZ)
    if (u < 0 || u > 1 || v < 0 || v > 1) return 0

    const size = this.resolution - 1
    const fx = u * size
    const fz = v * size
    const x0 = Math.min(size - 1, Math.floor(fx))
    const z0 = Math.min(size - 1, Math.floor(fz))
    const tx = fx - x0
    const tz = fz - z0

    const row = z0 * this.resolution
    const v00 = this.data[row + x0]
    const v10 = this.data[row + x0 + 1]
    const v01 = this.data[row + this.resolution + x0]
    const v11 = this.data[row + this.resolution + x0 + 1]

    const a = v00 + (v10 - v00) * tx
    const b = v01 + (v11 - v01) * tx
    return a + (b - a) * tz
  }

  /** Kemiringan lokal (rise / run) untuk menolak tebing terjal. */
  slopeAt(x: number, z: number, delta = 0.06): number {
    const dx = this.heightAt(x + delta, z) - this.heightAt(x - delta, z)
    const dz = this.heightAt(x, z + delta) - this.heightAt(x, z - delta)
    return Math.hypot(dx, dz) / (delta * 2)
  }
}

const preparedCache = new WeakMap<THREE.BufferGeometry, PreparedIsland>()

/** Koreksi orientasi: mesh aset miring ~34° searah jarum jam dari utara. */
const NORTH_UP_ROTATION = THREE.MathUtils.degToRad(33.8)

/**
 * Menyiapkan mesh `bali.glb`:
 *  - konversi Z-up -> Y-up, skala, rotasi north-up, dan pusatkan pulau di origin
 *  - pewarnaan vertex berdasarkan ketinggian, kemiringan, dan noise halus
 *  - pembuatan peta shoreline (R = gradasi dangkal, G = garis pantai tajam)
 */
export function prepareIsland(scene: THREE.Object3D): PreparedIsland {
  let source: THREE.Mesh | null = null
  scene.traverse((object) => {
    if (!source && (object as THREE.Mesh).isMesh) source = object as THREE.Mesh
  })

  if (!source) {
    throw new Error('bali.glb tidak berisi mesh terrain.')
  }

  const geometry = (source as THREE.Mesh).geometry

  // Cache juga disimpan di userData agar aman terhadap HMR/StrictMode.
  const cached = preparedCache.get(geometry) ?? readPreparedCache(geometry)
  if (cached) return cached

  // Aset diekspor dalam ruang Z-up.
  geometry.rotateX(-Math.PI / 2)
  geometry.rotateY(NORTH_UP_ROTATION)
  geometry.scale(ISLAND_SCALE, ISLAND_SCALE, ISLAND_SCALE)
  geometry.computeBoundingBox()

  const rawBox = geometry.boundingBox!
  geometry.translate(
    -(rawBox.min.x + rawBox.max.x) / 2,
    -rawBox.min.y,
    -(rawBox.min.z + rawBox.max.z) / 2,
  )
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()

  const bounds = geometry.boundingBox!
  const maxHeight = Math.max(bounds.max.y, 0.001)
  const heightField = buildHeightField(geometry, bounds)

  colorizeTerrain(geometry, maxHeight)

  const { texture, shoreBounds } = buildShoreMask(geometry, bounds)

  const prepared: PreparedIsland = {
    geometry,
    shoreMask: texture,
    shoreBounds,
    maxHeight,
    heightField,
  }
  preparedCache.set(geometry, prepared)
  writePreparedCache(geometry, prepared)
  return prepared
}

function readPreparedCache(geometry: THREE.BufferGeometry): PreparedIsland | undefined {
  return (geometry.userData as { baliPrepared?: PreparedIsland }).baliPrepared
}

function writePreparedCache(geometry: THREE.BufferGeometry, prepared: PreparedIsland) {
  ;(geometry.userData as { baliPrepared?: PreparedIsland }).baliPrepared = prepared
}

const HEIGHTFIELD_RESOLUTION = 384

function buildHeightField(
  geometry: THREE.BufferGeometry,
  bounds: THREE.Box3,
): HeightField {
  const { min, max } = bounds
  const width = max.x - min.x
  const depth = max.z - min.z
  const data = new Float32Array(HEIGHTFIELD_RESOLUTION * HEIGHTFIELD_RESOLUTION)
  const position = geometry.getAttribute('position')

  for (let i = 0; i < position.count; i += 1) {
    const u = (position.getX(i) - min.x) / width
    const v = (position.getZ(i) - min.z) / depth
    if (u < 0 || u > 1 || v < 0 || v > 1) continue

    const x = Math.min(HEIGHTFIELD_RESOLUTION - 1, Math.floor(u * HEIGHTFIELD_RESOLUTION))
    const z = Math.min(HEIGHTFIELD_RESOLUTION - 1, Math.floor(v * HEIGHTFIELD_RESOLUTION))
    const index = z * HEIGHTFIELD_RESOLUTION + x
    const y = position.getY(i)
    if (y > data[index]) data[index] = y
  }

  return new HeightField(
    min.x,
    max.x,
    min.z,
    max.z,
    HEIGHTFIELD_RESOLUTION,
    data,
  )
}

type Stop = { at: number; color: THREE.Color }

const HEIGHT_STOPS: Stop[] = [
  { at: 0.0, color: new THREE.Color('#e8d7ab') }, // pasir pantai
  { at: 0.025, color: new THREE.Color('#d6c18d') },
  { at: 0.05, color: new THREE.Color('#8fa860') }, // vegetasi pesisir
  { at: 0.18, color: new THREE.Color('#5f8f49') },
  { at: 0.5, color: new THREE.Color('#41753d') }, // hutan tropis
  { at: 0.9, color: new THREE.Color('#3a6538') },
  { at: 1.25, color: new THREE.Color('#556a46') },
  { at: 1.6, color: new THREE.Color('#6f6a55') }, // batuan vulkanik
  { at: 1.9, color: new THREE.Color('#857c67') },
  { at: 2.25, color: new THREE.Color('#9a917c') }, // puncak Gunung Agung
]

const ROCK_COLOR = new THREE.Color('#736a58')

function sampleRamp(height: number): THREE.Color {
  if (height <= HEIGHT_STOPS[0].at) return HEIGHT_STOPS[0].color.clone()

  for (let i = 1; i < HEIGHT_STOPS.length; i += 1) {
    const previous = HEIGHT_STOPS[i - 1]
    const next = HEIGHT_STOPS[i]
    if (height <= next.at) {
      const t = THREE.MathUtils.smoothstep(height, previous.at, next.at)
      return previous.color.clone().lerp(next.color, t)
    }
  }

  return HEIGHT_STOPS[HEIGHT_STOPS.length - 1].color.clone()
}

function colorizeTerrain(geometry: THREE.BufferGeometry, maxHeight: number) {
  const position = geometry.getAttribute('position')
  const normal = geometry.getAttribute('normal')
  const count = position.count
  const colors = new Float32Array(count * 3)
  const scratch = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)

    scratch.copy(sampleRamp(y))

    // Variasi warna alami agar permukaan tidak terlihat datar.
    const noise = fract(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453)
    scratch.multiplyScalar(0.94 + noise * 0.12)

    // Patch vegetasi berskala besar untuk memecah bidang hijau yang monoton.
    const patch =
      0.5 + 0.5 * Math.sin(x * 0.55 + z * 0.31) * Math.cos(z * 0.47 - x * 0.23)
    scratch.multiplyScalar(0.92 + patch * 0.12)

    // Tebing/curam diberi warna batuan.
    if (normal) {
      const slope = 1 - THREE.MathUtils.clamp(normal.getY(i), 0, 1)
      const rock = THREE.MathUtils.smoothstep(slope, 0.32, 0.72)
      if (rock > 0) scratch.lerp(ROCK_COLOR, rock * 0.72)
    }

    // Sedikit penguatan tinggi agar relief puncak terbaca.
    const lift = THREE.MathUtils.smoothstep(y / maxHeight, 0.55, 1)
    scratch.multiplyScalar(1 + lift * 0.08)

    colors[i * 3] = scratch.r
    colors[i * 3 + 1] = scratch.g
    colors[i * 3 + 2] = scratch.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

function fract(value: number) {
  return value - Math.floor(value)
}

const SHORE_RESOLUTION = 256
const SHORE_PADDING = 2.4

function buildShoreMask(geometry: THREE.BufferGeometry, bounds: THREE.Box3) {
  const minX = bounds.min.x - SHORE_PADDING
  const maxX = bounds.max.x + SHORE_PADDING
  const minZ = bounds.min.z - SHORE_PADDING
  const maxZ = bounds.max.z + SHORE_PADDING
  const width = maxX - minX
  const depth = maxZ - minZ

  const position = geometry.getAttribute('position')
  const land = new Float32Array(SHORE_RESOLUTION * SHORE_RESOLUTION)

  for (let i = 0; i < position.count; i += 1) {
    const u = (position.getX(i) - minX) / width
    const v = (position.getZ(i) - minZ) / depth
    if (u < 0 || u > 1 || v < 0 || v > 1) continue

    const x = Math.min(SHORE_RESOLUTION - 1, Math.floor(u * SHORE_RESOLUTION))
    const y = Math.min(SHORE_RESOLUTION - 1, Math.floor(v * SHORE_RESOLUTION))
    land[y * SHORE_RESOLUTION + x] = 1
  }

  // Gradasi lebar untuk kedalaman air + versi tajam untuk garis busa.
  const soft = boxBlur(land, SHORE_RESOLUTION, 20, 2)
  const sharp = boxBlur(land, SHORE_RESOLUTION, 3, 1)

  const data = new Uint8Array(SHORE_RESOLUTION * SHORE_RESOLUTION * 4)
  for (let i = 0; i < soft.length; i += 1) {
    data[i * 4] = Math.round(soft[i] * 255)
    data[i * 4 + 1] = Math.round(sharp[i] * 255)
    data[i * 4 + 2] = 0
    data[i * 4 + 3] = 255
  }

  const texture = new THREE.DataTexture(
    data,
    SHORE_RESOLUTION,
    SHORE_RESOLUTION,
    THREE.RGBAFormat,
  )
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.generateMipmaps = false
  texture.needsUpdate = true

  return {
    texture,
    shoreBounds: new THREE.Vector4(minX, minZ, 1 / width, 1 / depth),
  }
}

/** Box blur separable dengan edge clamp, dipakai untuk peta shoreline. */
function boxBlur(
  source: Float32Array,
  size: number,
  radius: number,
  passes: number,
): Float32Array {
  const current = new Float32Array(source)
  const next = new Float32Array(size * size)
  const windowSize = radius * 2 + 1
  const last = size - 1

  for (let pass = 0; pass < passes; pass += 1) {
    // Horizontal pass: current -> next
    for (let y = 0; y < size; y += 1) {
      const row = y * size
      let sum = 0
      for (let k = -radius; k <= radius; k += 1) {
        sum += current[row + THREE.MathUtils.clamp(k, 0, last)]
      }
      for (let x = 0; x < size; x += 1) {
        next[row + x] = sum / windowSize
        sum -= current[row + Math.max(0, x - radius)]
        sum += current[row + Math.min(last, x + radius + 1)]
      }
    }

    // Vertical pass: next -> current
    for (let x = 0; x < size; x += 1) {
      let sum = 0
      for (let k = -radius; k <= radius; k += 1) {
        sum += next[THREE.MathUtils.clamp(k, 0, last) * size + x]
      }
      for (let y = 0; y < size; y += 1) {
        current[y * size + x] = sum / windowSize
        sum -= next[Math.max(0, y - radius) * size + x]
        sum += next[Math.min(last, y + radius + 1) * size + x]
      }
    }
  }

  return current
}
