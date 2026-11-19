import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CLOUDS = [
  { x: -22, y: 11.5, z: -14, scale: 2.1, speed: 0.12 },
  { x: 8, y: 12.8, z: -24, scale: 2.3, speed: 0.08 },
  { x: 24, y: 10.8, z: -4, scale: 1.9, speed: 0.16 },
  { x: -16, y: 12.2, z: -26, scale: 2.2, speed: 0.1 },
  { x: 2, y: 11.8, z: -28, scale: 2.0, speed: 0.13 },
]

const BLOBS = [
  [0, 0, 0, 1.3],
  [0.6, 0.1, 0.1, 1.0],
  [-0.55, 0.05, -0.1, 1.05],
  [0.2, 0.3, -0.2, 0.8],
  [-0.25, 0.22, 0.25, 0.75],
  [0.45, -0.05, 0.3, 0.85],
  [-0.1, 0.05, -0.45, 0.9],
  [0.15, 0.35, 0.1, 0.65],
] as const

/** Awan low-poly yang melayang pelan di sekitar pulau. */
export function Clouds() {
  const groups = useRef<Array<THREE.Group | null>>([])

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 1), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fbfdff',
        emissive: '#d6e9f5',
        emissiveIntensity: 0.4,
        roughness: 1,
        metalness: 0,
        flatShading: false,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      }),
    [],
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    groups.current.forEach((group, index) => {
      if (!group) return
      const cloud = CLOUDS[index]
      const travel = (cloud.x + time * cloud.speed + 30) % 60
      group.position.x = travel - 30
    })
  })

  return (
    <group>
      {CLOUDS.map((cloud, index) => (
        <group
          key={`${cloud.x}-${cloud.z}`}
          ref={(group) => {
            groups.current[index] = group
          }}
          position={[cloud.x, cloud.y, cloud.z]}
          scale={cloud.scale}
        >
          {BLOBS.map((blob, blobIndex) => (
            <mesh
              key={blobIndex}
              geometry={geometry}
              material={material}
              position={[blob[0], blob[1], blob[2]]}
              scale={[blob[3] * 1.3, blob[3] * 0.58, blob[3] * 1.05]}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
