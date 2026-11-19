import { useMemo } from 'react'
import * as THREE from 'three'
import type { Vec3 } from '../../../data/island'
import { getPalmGeometry } from '../../../lib/vegetation'

interface HeroPalmProps {
  position: Vec3
  scale?: number
  rotation?: number
}

/** Pohon kelapa tunggal untuk landmark (di luar InstancedMesh vegetasi). */
export function HeroPalm({ position, scale = 1, rotation = 0 }: HeroPalmProps) {
  const geometry = useMemo(() => getPalmGeometry(), [])

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        roughness={0.92}
        metalness={0}
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
