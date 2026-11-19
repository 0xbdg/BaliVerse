import { useMemo } from 'react'
import * as THREE from 'three'
import type { Vec3 } from '../../data/island'
import { getGlowTexture } from '../../lib/textures'

interface GlowSpriteProps {
  position: Vec3
  color?: string
  scale?: number
  opacity?: number
}

export function GlowSprite({
  position,
  color = '#ffc37a',
  scale = 0.3,
  opacity = 0.55,
}: GlowSpriteProps) {
  const texture = useMemo(() => getGlowTexture(), [])

  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}
