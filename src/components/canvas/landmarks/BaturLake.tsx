import { LANDMARKS } from '../../../data/landmarks'
import type { HeightField } from '../../../lib/terrain'

interface BaturLakeProps {
  heightField: HeightField
}

const landmark = LANDMARKS.find((item) => item.id === 'batur')!

/** Danau Batur di dalam kaldera, dengan permukaan air tenang. */
export function BaturLake({ heightField }: BaturLakeProps) {
  const base = heightField.heightAt(landmark.x, landmark.z)

  return (
    <group position={[landmark.x, base, landmark.z]}>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.44, 48]} />
        <meshStandardMaterial
          color="#2f8f92"
          roughness={0.14}
          metalness={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh
        position={[0, 0.011, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <ringGeometry args={[0.44, 0.52, 48]} />
        <meshStandardMaterial color="#b9a97e" roughness={0.98} />
      </mesh>
      <mesh position={[0.14, 0.02, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 12]} />
        <meshStandardMaterial color="#4d7a45" roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}
