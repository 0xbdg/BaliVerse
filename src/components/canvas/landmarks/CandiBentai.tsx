import type { Vec3 } from '../../../data/island'

interface CandiBentaiProps {
  position?: Vec3
  rotation?: number
  scale?: number
}

const STONE = '#5a5044'
const STONE_LIGHT = '#6b5f50'
const GOLD = '#e0b050'

/**
 * Gapura Candi Bentar: dua menara batu vulkanik simetris dengan puncak emas.
 * Dibuat dari kotak bertingkat agar terbaca sebagai siluet khas Bali.
 */
export function CandiBentai({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}: CandiBentaiProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.03, 0.15]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.088, 0, 0]}>
          <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.11, 0.05, 0.1]} />
            <meshStandardMaterial color={STONE} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.096, 0.06, 0.088]} />
            <meshStandardMaterial color={STONE_LIGHT} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.06, 0.076]} />
            <meshStandardMaterial color={STONE} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.225, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.064, 0.05, 0.064]} />
            <meshStandardMaterial color={STONE_LIGHT} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.04, 0.052]} />
            <meshStandardMaterial color={STONE} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.302, 0]} castShadow>
            <coneGeometry args={[0.026, 0.045, 4]} />
            <meshStandardMaterial
              color={GOLD}
              roughness={0.42}
              metalness={0.5}
              emissive={GOLD}
              emissiveIntensity={0.12}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
