import { LANDMARKS } from '../../../data/landmarks'
import type { HeightField } from '../../../lib/terrain'
import { HeroPalm } from './HeroPalm'

interface RiceTerracesProps {
  heightField: HeightField
}

const landmark = LANDMARKS.find((item) => item.id === 'ubud')!

const TERRACE_COLORS = [
  '#5c9445',
  '#6fa84f',
  '#7fb85a',
  '#6aa54c',
  '#7dbd61',
  '#8cc76d',
]

const RADII = [0.85, 0.76, 0.67, 0.58, 0.49, 0.4, 0.31, 0.22]
const STEP = 0.042

/** Terasering sawah Ubud versi low-poly: lingkaran bertingkat mengikuti lereng. */
export function RiceTerraces({ heightField }: RiceTerracesProps) {
  const base = heightField.heightAt(landmark.x, landmark.z) - 0.09

  return (
    <group position={[landmark.x, base, landmark.z]}>
      {RADII.map((radius, index) => {
        const y = STEP * (index + 0.5)
        const offsetX = Math.sin(index * 1.9) * 0.05 + index * 0.018
        const offsetZ = Math.cos(index * 1.4) * 0.045 - index * 0.012
        return (
          <group key={radius} position={[offsetX, 0, offsetZ]}>
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius + 0.04, STEP, 16]} />
              <meshStandardMaterial
                color={TERRACE_COLORS[index % TERRACE_COLORS.length]}
                roughness={0.94}
                flatShading
              />
            </mesh>
            {index % 2 === 1 && (
              <mesh
                position={[0, STEP * (index + 1) + 0.002, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[radius - 0.05, radius - 0.016, 20]} />
                <meshStandardMaterial
                  color="#7fd0bd"
                  roughness={0.35}
                  metalness={0.15}
                  transparent
                  opacity={0.28}
                />
              </mesh>
            )}
          </group>
        )
      })}

      <group position={[0.12, STEP * RADII.length, -0.03]}>
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.11, 0.06, 0.1]} />
          <meshStandardMaterial color="#7b5a3d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.105, 0.08, 4]} />
          <meshStandardMaterial color="#b58a52" roughness={0.98} flatShading />
        </mesh>
      </group>

      <HeroPalm position={[-0.7, 0.02, 0.5]} scale={0.82} rotation={0.8} />
      <HeroPalm position={[0.55, 0.34, 0.55]} scale={0.66} rotation={2.6} />
      <HeroPalm position={[-0.2, 0.36, -0.62]} scale={0.7} rotation={4.2} />
    </group>
  )
}
