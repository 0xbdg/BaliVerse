import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DAY_PALETTE, NIGHT_PALETTE } from '../../data/environment'
import { useSceneStore } from '../../store/useSceneStore'

/** Menyilangkan warna langit/latar dan kabut antara siang & malam. */
export function Atmosphere() {
  const scene = useThree((state) => state.scene)
  const mode = useSceneStore((state) => state.mode)
  const blend = useRef(mode === 'night' ? 1 : 0)

  const colors = useMemo(
    () => ({
      dayFog: new THREE.Color(DAY_PALETTE.fog),
      nightFog: new THREE.Color(NIGHT_PALETTE.fog),
      current: new THREE.Color(DAY_PALETTE.fog),
    }),
    [],
  )

  useFrame((_, delta) => {
    const target = mode === 'night' ? 1 : 0
    blend.current = THREE.MathUtils.damp(blend.current, target, 1.8, delta)

    colors.current.copy(colors.dayFog).lerp(colors.nightFog, blend.current)
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(colors.current)
    }

    const fog = scene.fog
    if (fog instanceof THREE.Fog) {
      fog.color.copy(colors.current)
      fog.near = THREE.MathUtils.lerp(45, 36, blend.current)
      fog.far = THREE.MathUtils.lerp(150, 128, blend.current)
    }
  })

  return null
}
