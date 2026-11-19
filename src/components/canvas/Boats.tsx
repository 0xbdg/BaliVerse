import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BOATS = [
  { x: 0.0, z: 3.7, rotation: 0.4, sail: true },
  { x: 1.6, z: 4.1, rotation: -0.7, sail: false },
  { x: 2.5, z: 7.3, rotation: 0.9, sail: true },
  { x: 5.8, z: 6.2, rotation: 0.2, sail: false },
  { x: 9.8, z: 2.0, rotation: -0.5, sail: true },
  { x: 3.0, z: -7.5, rotation: 1.3, sail: false },
  { x: 8.35, z: 4.25, rotation: -1.1, sail: true },
  { x: 6.6, z: -6.6, rotation: 0.7, sail: false },
]

/** Perahu jukung dengan cadik, mengapung dan bergoyang di laut. */
export function Boats() {
  const groups = useRef<Array<THREE.Group | null>>([])

  const hullGeometry = useMemo(() => {
    const hull = new THREE.CapsuleGeometry(0.045, 0.22, 4, 8)
    hull.rotateZ(Math.PI / 2)
    hull.scale(1, 0.55, 0.82)
    return hull
  }, [])

  const floatGeometry = useMemo(() => {
    const float = new THREE.CapsuleGeometry(0.012, 0.18, 3, 6)
    float.rotateZ(Math.PI / 2)
    return float
  }, [])

  const hullMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#7c5738', roughness: 0.9 }),
    [],
  )
  const floatMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c9b28a', roughness: 0.9 }),
    [],
  )
  const sailMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f2e6cf',
        roughness: 0.85,
        side: THREE.DoubleSide,
      }),
    [],
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    groups.current.forEach((group, index) => {
      if (!group) return
      const phase = index * 1.7
      group.position.y = 0.035 + Math.sin(time * 1.1 + phase) * 0.014
      group.rotation.z = Math.sin(time * 0.9 + phase) * 0.055
      group.rotation.x = Math.cos(time * 0.72 + phase * 1.3) * 0.035
    })
  })

  return (
    <group>
      {BOATS.map((boat, index) => (
        <group
          key={`${boat.x}-${boat.z}`}
          ref={(group) => {
            groups.current[index] = group
          }}
          position={[boat.x, 0.035, boat.z]}
          rotation={[0, boat.rotation, 0]}
          scale={0.95}
        >
          <mesh geometry={hullGeometry} material={hullMaterial} castShadow />
          <mesh
            geometry={floatGeometry}
            material={floatMaterial}
            position={[0, -0.012, 0.085]}
          />
          <mesh
            geometry={floatGeometry}
            material={floatMaterial}
            position={[0, -0.012, -0.085]}
          />
          <mesh material={floatMaterial} position={[0.055, 0.005, 0]}>
            <boxGeometry args={[0.014, 0.012, 0.19]} />
          </mesh>
          <mesh material={floatMaterial} position={[-0.055, 0.005, 0]}>
            <boxGeometry args={[0.014, 0.012, 0.19]} />
          </mesh>

          {boat.sail && (
            <>
              <mesh material={floatMaterial} position={[0.015, 0.11, 0]}>
                <cylinderGeometry args={[0.004, 0.005, 0.18, 4]} />
              </mesh>
              <mesh material={sailMaterial} position={[0.045, 0.145, 0]}>
                <planeGeometry args={[0.12, 0.15]} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  )
}
