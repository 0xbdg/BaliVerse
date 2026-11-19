import type { Vec3 } from '../../../data/island'

interface MeruShrineProps {
  position?: Vec3
  rotation?: number
  scale?: number
}

const STONE = '#5c5144'
const THATCH = '#b98d55'
const GOLD = '#e0b050'

/** Meru bertingkat khas pura Bali dengan atap ijuk dan puncak emas. */
export function MeruShrine({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}: MeruShrineProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.018, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.17, 0.036, 0.17]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.083, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.09, 0.1]} />
        <meshStandardMaterial color="#675a4a" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.07, 0.051]} castShadow>
        <boxGeometry args={[0.036, 0.052, 0.006]} />
        <meshStandardMaterial color="#241d17" roughness={1} />
      </mesh>

      {[
        { y: 0.148, radius: 0.095, height: 0.06 },
        { y: 0.196, radius: 0.076, height: 0.052 },
        { y: 0.238, radius: 0.058, height: 0.045 },
      ].map((roof) => (
        <mesh
          key={roof.y}
          position={[0, roof.y, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <coneGeometry args={[roof.radius, roof.height, 4]} />
          <meshStandardMaterial color={THATCH} roughness={0.98} flatShading />
        </mesh>
      ))}

      <mesh position={[0, 0.278, 0]} castShadow>
        <coneGeometry args={[0.022, 0.042, 4]} />
        <meshStandardMaterial
          color={GOLD}
          roughness={0.4}
          metalness={0.55}
          emissive={GOLD}
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  )
}
