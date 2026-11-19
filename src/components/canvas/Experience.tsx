import { Suspense } from 'react'
import { Sky, useGLTF } from '@react-three/drei'
import { FOG_COLOR, FOG_FAR, FOG_NEAR, ISLAND_ASSET, SUN_POSITION } from '../../data/island'
import { CameraRig } from './CameraRig'
import { IslandWorld } from './IslandWorld'
import { Lighting } from './Lighting'

useGLTF.preload(ISLAND_ASSET)

export function Experience() {
  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />

      <Sky
        sunPosition={SUN_POSITION}
        turbidity={5}
        rayleigh={1.4}
        mieCoefficient={0.004}
        mieDirectionalG={0.85}
      />

      <Lighting />

      <Suspense fallback={null}>
        <IslandWorld />
      </Suspense>

      <CameraRig />
    </>
  )
}
