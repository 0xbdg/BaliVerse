import { useMemo } from 'react'
import { LANDMARKS } from '../../../data/landmarks'
import type { HeightField } from '../../../lib/terrain'
import { createRockPillarGeometry } from '../../../lib/rock'
import { CandiBentai } from './CandiBentai'
import { HeroPalm } from './HeroPalm'
import { MeruShrine } from './MeruShrine'

interface UluwatuProps {
  heightField: HeightField
}

const landmark = LANDMARKS.find((item) => item.id === 'uluwatu')!

/** Pura Uluwatu di puncak tebing karang Semenanjung Bukit. */
export function Uluwatu({ heightField }: UluwatuProps) {
  const base = Math.max(0, heightField.heightAt(landmark.x, landmark.z) - 0.02)

  const mainCliff = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.5,
        topRadius: 0.32,
        height: 0.72,
        sides: 7,
        seed: 11,
        leanX: 0.04,
        leanZ: 0.02,
      }),
    [],
  )

  const sideCliff = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.24,
        topRadius: 0.13,
        height: 0.48,
        sides: 6,
        seed: 12,
        leanX: 0.06,
      }),
    [],
  )

  const spurCliff = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.18,
        topRadius: 0.09,
        height: 0.3,
        sides: 5,
        seed: 13,
        leanX: -0.04,
      }),
    [],
  )

  return (
    <group position={[landmark.x, base, landmark.z]}>
      <mesh geometry={mainCliff} castShadow receiveShadow>
        <meshStandardMaterial color="#5b5142" roughness={1} flatShading />
      </mesh>
      <mesh
        geometry={sideCliff}
        position={[-0.3, 0, 0.16]}
        rotation={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#514838" roughness={1} flatShading />
      </mesh>
      <mesh
        geometry={spurCliff}
        position={[0.24, 0, -0.22]}
        rotation={[0, 1.1, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#635845" roughness={1} flatShading />
      </mesh>

      <mesh position={[0.04, 0.735, 0.02]} receiveShadow>
        <cylinderGeometry args={[0.31, 0.34, 0.06, 7]} />
        <meshStandardMaterial color="#4d7a45" roughness={0.95} flatShading />
      </mesh>

      <group position={[0.04, 0.765, 0.02]} rotation={[0, -1.15, 0]}>
        <CandiBentai scale={0.8} />
        <MeruShrine position={[0.08, 0, -0.16]} scale={0.95} rotation={0.2} />
      </group>

      <HeroPalm position={[0.26, 0.76, 0.16]} scale={0.6} rotation={0.6} />
      <HeroPalm position={[-0.22, 0.76, -0.06]} scale={0.54} rotation={2.1} />
    </group>
  )
}
