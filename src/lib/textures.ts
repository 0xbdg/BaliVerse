import * as THREE from 'three'

let glowTexture: THREE.CanvasTexture | null = null

/** Tekstur radial lembut untuk glow lampu, kabut, dan partikel. */
export function getGlowTexture() {
  if (glowTexture) return glowTexture

  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D tidak tersedia untuk tekstur glow.')

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.32, 'rgba(255,255,255,0.65)')
  gradient.addColorStop(0.68, 'rgba(255,255,255,0.18)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  glowTexture.needsUpdate = true
  return glowTexture
}
