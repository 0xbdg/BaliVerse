import { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { DAY_PALETTE } from '../../data/environment'
import { FOG_FAR, FOG_NEAR, ISLAND_ASSET } from '../../data/island'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { IslandWorld } from './IslandWorld'
import { Lighting } from './Lighting'
import { SkyDome } from './SkyDome'

useGLTF.preload(ISLAND_ASSET)

/** Ekspos scene Three.js saat development untuk inspeksi visual. */
function DebugBridge() {
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    if (import.meta.env.DEV) {
      ;(window as unknown as { __three?: typeof scene }).__three = scene
    }
  }, [scene])

  return null
}

export function Experience() {
  return (
    <>
      <color attach="background" args={[DAY_PALETTE.fog]} />
      <fog attach="fog" args={[DAY_PALETTE.fog, FOG_NEAR, FOG_FAR]} />

      <SkyDome />
      <Atmosphere />
      <Lighting />

      <Suspense fallback={null}>
        <IslandWorld />
      </Suspense>

      <CameraRig />
      <DebugBridge />
    </>
  )
}
