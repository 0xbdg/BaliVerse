import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LANDMARKS } from '../../data/landmarks'
import type { HeightField } from '../../lib/terrain'
import { getGlowTexture } from '../../lib/textures'
import { mulberry32 } from '../../lib/vegetation'

interface MistProps {
  heightField: HeightField
}

const landmark = LANDMARKS.find((item) => item.id === 'batur')!
const COUNT = 12

/** Kabut tipis yang bergulir di kawah Gunung Batur. */
export function Mist({ heightField }: MistProps) {
  const sprites = useRef<Array<THREE.Sprite | null>>([])
  const texture = useMemo(() => getGlowTexture(), [])
  const base = heightField.heightAt(landmark.x, landmark.z)

  const wisps = useMemo(() => {
    const random = mulberry32(0x77aa)
    return Array.from({ length: COUNT }, () => {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * 0.55
      return {
        x: landmark.x + Math.cos(angle) * radius,
        z: landmark.z + Math.sin(angle) * radius,
        y: base + 0.04 + random() * 0.14,
        scale: 0.45 + random() * 0.85,
        phase: random() * Math.PI * 2,
        drift: 0.04 + random() * 0.08,
        opacity: 0.08 + random() * 0.07,
      }
    })
  }, [base])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    sprites.current.forEach((sprite, index) => {
      if (!sprite) return
      const wisp = wisps[index]
      sprite.position.x = wisp.x + Math.sin(time * 0.14 + wisp.phase) * wisp.drift
      sprite.position.z = wisp.z + Math.cos(time * 0.11 + wisp.phase * 1.4) * wisp.drift
      const material = sprite.material as THREE.SpriteMaterial
      material.opacity =
        wisp.opacity * (0.75 + 0.25 * Math.sin(time * 0.3 + wisp.phase))
    })
  })

  return (
    <group>
      {wisps.map((wisp, index) => (
        <sprite
          key={index}
          ref={(sprite) => {
            sprites.current[index] = sprite
          }}
          position={[wisp.x, wisp.y, wisp.z]}
          scale={[wisp.scale, wisp.scale * 0.55, 1]}
        >
          <spriteMaterial
            map={texture}
            color="#e6f2ee"
            transparent
            opacity={wisp.opacity}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </sprite>
      ))}
    </group>
  )
}
