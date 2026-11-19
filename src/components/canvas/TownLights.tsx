import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NIGHT_LIGHT_SPOTS } from '../../data/landmarks'
import type { HeightField } from '../../lib/terrain'
import { getGlowTexture } from '../../lib/textures'
import { useSceneStore } from '../../store/useSceneStore'

interface TownLightsProps {
  heightField: HeightField
}

/** Lampu kota dan pura yang menyala perlahan saat mode malam. */
export function TownLights({ heightField }: TownLightsProps) {
  const mode = useSceneStore((state) => state.mode)
  const blend = useRef(mode === 'night' ? 1 : 0)
  const lights = useRef<Array<THREE.PointLight | null>>([])
  const materials = useRef<Array<THREE.SpriteMaterial | null>>([])
  const texture = useMemo(() => getGlowTexture(), [])

  const spots = useMemo(
    () =>
      NIGHT_LIGHT_SPOTS.map((spot) => ({
        ...spot,
        y: heightField.heightAt(spot.x, spot.z) + spot.height,
      })),
    [heightField],
  )

  useFrame((_, delta) => {
    const target = mode === 'night' ? 1 : 0
    blend.current = THREE.MathUtils.damp(blend.current, target, 1.9, delta)

    lights.current.forEach((light) => {
      if (light) light.intensity = 2.2 * blend.current
    })
    materials.current.forEach((material) => {
      if (material) material.opacity = 0.32 * blend.current
    })
  })

  return (
    <group>
      {spots.map((spot, index) => (
        <group key={`${spot.x}-${spot.z}`}>
          <pointLight
            ref={(light) => {
              lights.current[index] = light
            }}
            position={[spot.x, spot.y, spot.z]}
            color="#ffb45e"
            intensity={0}
            distance={3}
            decay={2}
          />
          <sprite position={[spot.x, spot.y, spot.z]} scale={[spot.scale, spot.scale, 1]}>
            <spriteMaterial
              ref={(material) => {
                materials.current[index] = material
              }}
              map={texture}
              color="#ffc37a"
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>
        </group>
      ))}
    </group>
  )
}
