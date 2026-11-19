import { useMemo } from 'react'
import { LANDMARKS } from '../../../data/landmarks'
import { createRockPillarGeometry } from '../../../lib/rock'
import { HeroPalm } from './HeroPalm'

const landmark = LANDMARKS.find((item) => item.id === 'kelingking')!

/**
 * Nusa Penida + tebing Kelingking versi prosedural.
 * Mesh `bali.glb` hanya memuat Bali mainland, jadi pulau kecil ini ditambahkan
 * agar selat dan posisi Penida di tenggara tetap terbaca.
 */
export function KelingkingCliff() {
  const islandBase = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 1.15,
        topRadius: 1.02,
        height: 0.12,
        sides: 9,
        seed: 31,
      }),
    [],
  )

  const islandTop = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 1.0,
        topRadius: 0.94,
        height: 0.06,
        sides: 9,
        seed: 32,
      }),
    [],
  )

  const lobeBase = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.66,
        topRadius: 0.56,
        height: 0.1,
        sides: 7,
        seed: 33,
      }),
    [],
  )

  const lobeTop = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.55,
        topRadius: 0.5,
        height: 0.05,
        sides: 7,
        seed: 34,
      }),
    [],
  )

  const mainCliff = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.44,
        topRadius: 0.26,
        height: 1.05,
        sides: 7,
        seed: 21,
        leanX: -0.12,
        leanZ: -0.04,
      }),
    [],
  )

  const mainCap = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.27,
        topRadius: 0.25,
        height: 0.05,
        sides: 7,
        seed: 24,
        leanX: -0.12,
        leanZ: -0.04,
      }),
    [],
  )

  const ridgeCliff = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.3,
        topRadius: 0.17,
        height: 0.56,
        sides: 6,
        seed: 22,
        leanX: 0.05,
      }),
    [],
  )

  const ridgeCap = useMemo(
    () =>
      createRockPillarGeometry({
        bottomRadius: 0.18,
        topRadius: 0.16,
        height: 0.04,
        sides: 6,
        seed: 25,
        leanX: 0.05,
      }),
    [],
  )

  return (
    <group position={[landmark.x, 0, landmark.z]}>
      {/* Dasar pulau: pasir lalu tutupan hijau, dengan dua lobus organik. */}
      <mesh geometry={islandBase} castShadow receiveShadow>
        <meshStandardMaterial color="#d3bf8b" roughness={0.98} flatShading />
      </mesh>
      <mesh geometry={islandTop} position={[0, 0.12, 0]} receiveShadow>
        <meshStandardMaterial color="#4f7d45" roughness={0.96} flatShading />
      </mesh>
      <mesh
        geometry={lobeBase}
        position={[0.58, 0, -0.42]}
        rotation={[0, 0.4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#cdb884" roughness={0.98} flatShading />
      </mesh>
      <mesh
        geometry={lobeTop}
        position={[0.58, 0.1, -0.42]}
        rotation={[0, 0.4, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#557f45" roughness={0.96} flatShading />
      </mesh>

      {/* Pantai kecil di sisi timur + spit pasir. */}
      <mesh position={[0.58, 0.185, 0.18]} rotation={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[0.62, 0.015, 0.26]} />
        <meshStandardMaterial color="#e2d09a" roughness={0.98} />
      </mesh>
      <mesh position={[0.9, 0.175, 0.38]} rotation={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[0.34, 0.012, 0.13]} />
        <meshStandardMaterial color="#e2d09a" roughness={0.98} />
      </mesh>

      {/* Tebing utama dengan lapisan batuan dan puncak hijau. */}
      <group position={[-0.42, 0.14, 0.12]}>
        <mesh geometry={mainCliff} castShadow receiveShadow>
          <meshStandardMaterial color="#6b5f4b" roughness={1} flatShading />
        </mesh>
        <mesh geometry={mainCap} position={[0, 1.05, 0]} receiveShadow>
          <meshStandardMaterial color="#557f45" roughness={0.96} flatShading />
        </mesh>

        <mesh position={[-0.02, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.41, 0.43, 0.03, 7]} />
          <meshStandardMaterial color="#7a6d55" roughness={1} flatShading />
        </mesh>
        <mesh position={[-0.06, 0.7, -0.01]} castShadow>
          <cylinderGeometry args={[0.33, 0.35, 0.03, 7]} />
          <meshStandardMaterial color="#786a50" roughness={1} flatShading />
        </mesh>
      </group>

      {/* Punggung tebing yang lebih rendah ke arah selatan. */}
      <group position={[-0.02, 0.14, -0.5]}>
        <mesh geometry={ridgeCliff} castShadow receiveShadow>
          <meshStandardMaterial color="#665b47" roughness={1} flatShading />
        </mesh>
        <mesh geometry={ridgeCap} position={[0, 0.56, 0]} receiveShadow>
          <meshStandardMaterial color="#4f7d45" roughness={0.96} flatShading />
        </mesh>
      </group>

      <mesh position={[0.52, 0.08, -0.62]} scale={[1, 0.6, 0.8]} castShadow>
        <dodecahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color="#6f6450" roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.82, 0.05, -0.2]} scale={[1, 0.5, 0.9]} castShadow>
        <dodecahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color="#6a5e4a" roughness={1} flatShading />
      </mesh>

      <HeroPalm position={[0.38, 0.16, -0.22]} scale={0.8} rotation={0.5} />
      <HeroPalm position={[0.1, 0.16, 0.4]} scale={0.7} rotation={2.2} />
      <HeroPalm position={[-0.22, 0.16, 0.3]} scale={0.88} rotation={3.8} />
      <HeroPalm position={[0.66, 0.16, -0.3]} scale={0.64} rotation={5.1} />
      <HeroPalm position={[-0.54, 1.1, 0.08]} scale={0.5} rotation={1.4} />
      <HeroPalm position={[-0.34, 1.1, 0.04]} scale={0.44} rotation={4.6} />
    </group>
  )
}
