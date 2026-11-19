import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { ISLAND_ASSET } from '../../data/island'
import { prepareIsland } from '../../lib/terrain'
import { Boats } from './Boats'
import { Clouds } from './Clouds'
import { IslandTerrain } from './IslandTerrain'
import { Mist } from './Mist'
import { Ocean } from './Ocean'
import { Petals } from './Petals'
import { TownLights } from './TownLights'
import { Vegetation } from './Vegetation'
import { Landmarks } from './landmarks/Landmarks'

export function IslandWorld() {
  const { scene } = useGLTF(ISLAND_ASSET)
  const island = useMemo(() => prepareIsland(scene), [scene])

  return (
    <>
      <IslandTerrain geometry={island.geometry} />
      <Ocean shoreMask={island.shoreMask} shoreBounds={island.shoreBounds} />

      <Landmarks heightField={island.heightField} />
      <Vegetation heightField={island.heightField} />
      <TownLights heightField={island.heightField} />

      <Boats />
      <Clouds />
      <Petals />
      <Mist heightField={island.heightField} />
    </>
  )
}
