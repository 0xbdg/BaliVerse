import { LANDMARKS } from '../../../data/landmarks'
import { CandiBentai } from './CandiBentai'
import { MeruShrine } from './MeruShrine'

const landmark = LANDMARKS.find((item) => item.id === 'tanah-lot')!

/** Pura Tanah Lot di atas batu karang lepas pantai barat. */
export function TanahLot() {
  return (
    <group position={[landmark.x, 0, landmark.z]}>
      <mesh position={[0, 0.06, 0]} scale={[1, 0.7, 0.95]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#4d463b" roughness={1} flatShading />
      </mesh>
      <mesh
        position={[0.18, 0.02, 0.07]}
        scale={[1, 0.5, 0.8]}
        rotation={[0, 0.7, 0]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color="#57503f" roughness={1} flatShading />
      </mesh>
      <mesh
        position={[-0.15, 0.015, -0.09]}
        scale={[1, 0.45, 0.9]}
        rotation={[0, 1.4, 0]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color="#494236" roughness={1} flatShading />
      </mesh>

      <group position={[0.03, 0.18, 0.02]} rotation={[0, 0.5, 0]}>
        <CandiBentai scale={0.85} />
        <MeruShrine position={[-0.02, 0, -0.16]} scale={1.0} rotation={0.1} />
      </group>
    </group>
  )
}
