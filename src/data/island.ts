export type Vec3 = [number, number, number]

/** Path aset pulau (mesh DEM hasil ekspor, Z-up). */
export const ISLAND_ASSET = '/bali.glb'

/** Skala dari satuan aset ke satuan scene (pulau menjadi ~18 unit). */
export const ISLAND_SCALE = 0.1

/** Posisi kamera awal: bird's-eye view menghadap ke utara pulau. */
export const CAMERA_HOME = {
  position: [0, 13.5, 17] as Vec3,
  target: [0, 0.4, 0.8] as Vec3,
}

/** Kamera untuk layar portrait agar seluruh pulau tetap masuk frame. */
export const CAMERA_HOME_PORTRAIT = {
  position: [0, 36, 46] as Vec3,
  target: [0, 0.4, 0.6] as Vec3,
}

export const CAMERA_LIMITS = {
  minDistance: 6,
  maxDistance: 60,
  minPolarAngle: Math.PI * 0.12,
  maxPolarAngle: Math.PI * 0.47,
}

export const SUN_POSITION: Vec3 = [14, 18, 9]
export const FOG_COLOR = '#d8edf2'
export const FOG_NEAR = 45
export const FOG_FAR = 150

/** Ukuran bidang laut (cukup besar agar tepinya habis oleh kabut). */
export const OCEAN_SIZE = 400
