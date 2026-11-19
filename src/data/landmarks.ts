import type { Vec3 } from './island'

export interface LandmarkDefinition {
  id: string
  name: string
  /** Koordinat x/z di scene (pulau sudah north-up). */
  x: number
  z: number
  /** Radius area yang dibersihkan dari vegetasi otomatis. */
  clearance: number
  /** Sudut kamera untuk fitur "jelajahi destinasi" pada Fase 3. */
  view: {
    position: Vec3
    target: Vec3
  }
}

export const LANDMARKS: LandmarkDefinition[] = [
  {
    id: 'tanah-lot',
    name: 'Pura Tanah Lot',
    x: 0.55,
    z: 3.25,
    clearance: 0.8,
    view: { position: [-0.2, 1.15, 4.7], target: [0.55, 0.24, 3.25] },
  },
  {
    id: 'uluwatu',
    name: 'Pura Uluwatu',
    x: 1.12,
    z: 6.82,
    clearance: 1.05,
    view: { position: [0.05, 1.55, 7.85], target: [1.12, 0.6, 6.82] },
  },
  {
    id: 'ubud',
    name: 'Terasering Ubud',
    x: 3.35,
    z: 1.12,
    clearance: 1.4,
    view: { position: [1.95, 1.9, 2.9], target: [3.35, 0.42, 1.12] },
  },
  {
    id: 'batur',
    name: 'Gunung & Danau Batur',
    x: 5.11,
    z: -3.26,
    clearance: 1.2,
    view: { position: [3.9, 2.2, -2.0], target: [5.11, 1.0, -3.26] },
  },
  {
    id: 'kelingking',
    name: 'Tebing Kelingking',
    x: 7.25,
    z: 5.55,
    clearance: 1.7,
    view: { position: [5.95, 1.35, 6.7], target: [7.25, 0.5, 5.55] },
  },
  {
    id: 'canggu',
    name: 'Pantai Canggu',
    x: 1.35,
    z: 3.45,
    clearance: 0.7,
    view: { position: [0.35, 1.1, 4.5], target: [1.35, 0.1, 3.45] },
  },
]

/** Titik lampu kota/pura yang menyala saat malam. */
export const NIGHT_LIGHT_SPOTS: Array<{ x: number; z: number; height: number; scale: number }> = [
  { x: 2.6, z: 3.66, height: 0.28, scale: 0.22 },
  { x: 4.05, z: 0.55, height: 0.2, scale: 0.18 },
  { x: 1.5, z: 3.5, height: 0.18, scale: 0.16 },
  { x: 1.12, z: 6.82, height: 0.92, scale: 0.18 },
  { x: 0.55, z: 3.25, height: 0.48, scale: 0.18 },
]

export const LANDMARK_CLEARANCES = LANDMARKS.map((landmark) => ({
  x: landmark.x,
  z: landmark.z,
  radius: landmark.clearance,
}))
