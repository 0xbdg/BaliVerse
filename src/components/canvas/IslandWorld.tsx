import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { ISLAND_ASSET } from '../../data/island'
import { prepareIsland } from '../../lib/terrain'
import { IslandTerrain } from './IslandTerrain'
import { Ocean } from './Ocean'

export function IslandWorld() {
  const { scene } = useGLTF(ISLAND_ASSET)
  const island = useMemo(() => prepareIsland(scene), [scene])

  return (
    <>
      <IslandTerrain geometry={island.geometry} />
      <Ocean shoreMask={island.shoreMask} shoreBounds={island.shoreBounds} />
    </>
  )
}
