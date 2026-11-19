import type { HeightField } from '../../../lib/terrain'
import { BaturLake } from './BaturLake'
import { CangguBeach } from './CangguBeach'
import { KelingkingCliff } from './KelingkingCliff'
import { RiceTerraces } from './RiceTerraces'
import { TanahLot } from './TanahLot'
import { Uluwatu } from './Uluwatu'

interface LandmarksProps {
  heightField: HeightField
}

export function Landmarks({ heightField }: LandmarksProps) {
  return (
    <>
      <TanahLot />
      <Uluwatu heightField={heightField} />
      <RiceTerraces heightField={heightField} />
      <BaturLake heightField={heightField} />
      <KelingkingCliff />
      <CangguBeach heightField={heightField} />
    </>
  )
}
