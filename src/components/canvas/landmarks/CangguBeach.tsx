import { LANDMARKS } from '../../../data/landmarks'
import type { HeightField } from '../../../lib/terrain'

interface CangguBeachProps {
  heightField: HeightField
}

const landmark = LANDMARKS.find((item) => item.id === 'canggu')!

const UMBRELLAS = [
  { x: -0.16, z: 0.08, color: '#e8735a', rotation: 0.3 },
  { x: 0.1, z: 0.16, color: '#f2e6cf', rotation: -0.2 },
  { x: 0.24, z: -0.08, color: '#3f9d92', rotation: 0.5 },
  { x: -0.02, z: -0.16, color: '#e6b34a', rotation: -0.4 },
]

const BOARDS = [
  { x: 0.38, z: 0.02, color: '#e8735a', rotation: 0.24, tilt: 0.16 },
  { x: 0.42, z: -0.14, color: '#f4efe2', rotation: -0.18, tilt: 0.2 },
  { x: -0.34, z: 0.18, color: '#3f9d92', rotation: 0.36, tilt: 0.12 },
]

function snapToLand(heightField: HeightField, x: number, z: number) {
  for (let radius = 0; radius <= 0.36; radius += 0.04) {
    const steps = radius === 0 ? 1 : 12
    for (let step = 0; step < steps; step += 1) {
      const angle = (step / steps) * Math.PI * 2
      const px = x + Math.cos(angle) * radius
      const pz = z + Math.sin(angle) * radius
      const height = heightField.heightAt(px, pz)
      if (height > 0.025) return { x: px, z: pz, y: height }
    }
  }

  return { x, z, y: Math.max(heightField.heightAt(x, z), 0.02) }
}

/** Deretan payung pantai, papan selancar, dan gubuk bambu di Canggu. */
export function CangguBeach({ heightField }: CangguBeachProps) {
  return (
    <group position={[landmark.x, 0, landmark.z]}>
      {UMBRELLAS.map((umbrella) => {
        const spot = snapToLand(heightField, umbrella.x, umbrella.z)
        return (
          <group
            key={umbrella.color + umbrella.x}
            position={[spot.x, spot.y - 0.005, spot.z]}
            rotation={[0, umbrella.rotation, 0.08]}
          >
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.007, 0.009, 0.24, 5]} />
              <meshStandardMaterial color="#8a7454" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.245, 0]} castShadow>
              <coneGeometry args={[0.13, 0.075, 8]} />
              <meshStandardMaterial
                color={umbrella.color}
                roughness={0.85}
                flatShading
              />
            </mesh>
            <mesh position={[0, 0.285, 0]}>
              <sphereGeometry args={[0.014, 6, 5]} />
              <meshStandardMaterial color="#f6efdf" roughness={0.8} />
            </mesh>

            <mesh position={[0.11, 0.012, 0.02]} castShadow receiveShadow>
              <boxGeometry args={[0.16, 0.022, 0.065]} />
              <meshStandardMaterial color="#f1e7d3" roughness={0.9} />
            </mesh>
            <mesh
              position={[0.185, 0.04, 0.02]}
              rotation={[0, 0, -0.5]}
              castShadow
            >
              <boxGeometry args={[0.03, 0.075, 0.065]} />
              <meshStandardMaterial color="#e6dac2" roughness={0.9} />
            </mesh>
          </group>
        )
      })}

      {BOARDS.map((board) => {
        const spot = snapToLand(heightField, board.x, board.z)
        return (
          <mesh
            key={board.color + board.x}
            position={[spot.x, spot.y + 0.075, spot.z]}
            rotation={[board.tilt, board.rotation, 0.06]}
            scale={[1, 1, 0.38]}
            castShadow
          >
            <capsuleGeometry args={[0.022, 0.13, 4, 6]} />
            <meshStandardMaterial color={board.color} roughness={0.7} />
          </mesh>
        )
      })}

      {(() => {
        const spot = snapToLand(heightField, 0.22, -0.28)
        return (
          <group position={[spot.x, spot.y - 0.005, spot.z]} rotation={[0, -0.4, 0]}>
            <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.12, 0.16]} />
              <meshStandardMaterial color="#9b7650" roughness={0.92} />
            </mesh>
            <mesh position={[0, 0.155, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[0.17, 0.1, 4]} />
              <meshStandardMaterial color="#b58a52" roughness={0.98} flatShading />
            </mesh>
            <mesh position={[0, 0.07, 0.081]}>
              <boxGeometry args={[0.06, 0.07, 0.006]} />
              <meshStandardMaterial color="#3a2a1c" roughness={1} />
            </mesh>
          </group>
        )
      })()}
    </group>
  )
}
