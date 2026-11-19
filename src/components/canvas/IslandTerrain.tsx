import type { BufferGeometry } from 'three'

interface IslandTerrainProps {
  geometry: BufferGeometry
}

export function IslandTerrain({ geometry }: IslandTerrainProps) {
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.96} metalness={0} dithering />
    </mesh>
  )
}
