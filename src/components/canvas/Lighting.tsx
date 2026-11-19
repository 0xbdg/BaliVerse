import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  DAY_PALETTE,
  MOON_DIRECTION,
  NIGHT_PALETTE,
  SUN_DIRECTION,
} from '../../data/environment'
import { useSceneStore } from '../../store/useSceneStore'

export function Lighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const fillRef = useRef<THREE.DirectionalLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const mode = useSceneStore((state) => state.mode)
  const blend = useRef(mode === 'night' ? 1 : 0)

  const palette = useMemo(
    () => ({
      sunDay: new THREE.Color(DAY_PALETTE.sunLight),
      sunNight: new THREE.Color(NIGHT_PALETTE.sunLight),
      fillDay: new THREE.Color(DAY_PALETTE.fillLight),
      fillNight: new THREE.Color(NIGHT_PALETTE.fillLight),
      hemiSkyDay: new THREE.Color(DAY_PALETTE.hemiSky),
      hemiSkyNight: new THREE.Color(NIGHT_PALETTE.hemiSky),
      hemiGroundDay: new THREE.Color(DAY_PALETTE.hemiGround),
      hemiGroundNight: new THREE.Color(NIGHT_PALETTE.hemiGround),
      ambientDay: new THREE.Color(DAY_PALETTE.ambient),
      ambientNight: new THREE.Color(NIGHT_PALETTE.ambient),
      sunDayPosition: new THREE.Vector3(...SUN_DIRECTION),
      sunNightPosition: new THREE.Vector3(...MOON_DIRECTION),
    }),
    [],
  )

  useFrame((_, delta) => {
    const target = mode === 'night' ? 1 : 0
    blend.current = THREE.MathUtils.damp(blend.current, target, 1.7, delta)
    const t = blend.current

    const sun = sunRef.current
    if (sun) {
      sun.intensity = THREE.MathUtils.lerp(
        DAY_PALETTE.sunIntensity,
        NIGHT_PALETTE.sunIntensity,
        t,
      )
      sun.color.copy(palette.sunDay).lerp(palette.sunNight, t)
      sun.position
        .copy(palette.sunDayPosition)
        .lerp(palette.sunNightPosition, t)
        .normalize()
        .multiplyScalar(26)
    }

    const fill = fillRef.current
    if (fill) {
      fill.intensity = THREE.MathUtils.lerp(
        DAY_PALETTE.fillIntensity,
        NIGHT_PALETTE.fillIntensity,
        t,
      )
      fill.color.copy(palette.fillDay).lerp(palette.fillNight, t)
    }

    const hemi = hemiRef.current
    if (hemi) {
      hemi.intensity = THREE.MathUtils.lerp(
        DAY_PALETTE.hemiIntensity,
        NIGHT_PALETTE.hemiIntensity,
        t,
      )
      hemi.color.copy(palette.hemiSkyDay).lerp(palette.hemiSkyNight, t)
      hemi.groundColor.copy(palette.hemiGroundDay).lerp(palette.hemiGroundNight, t)
    }

    const ambient = ambientRef.current
    if (ambient) {
      ambient.intensity = THREE.MathUtils.lerp(
        DAY_PALETTE.ambientIntensity,
        NIGHT_PALETTE.ambientIntensity,
        t,
      )
      ambient.color.copy(palette.ambientDay).lerp(palette.ambientNight, t)
    }
  })

  return (
    <>
      <hemisphereLight ref={hemiRef} args={[DAY_PALETTE.hemiSky, DAY_PALETTE.hemiGround, 0.7]} />
      <ambientLight ref={ambientRef} intensity={0.22} color={DAY_PALETTE.ambient} />
      <directionalLight
        ref={sunRef}
        position={SUN_DIRECTION}
        intensity={DAY_PALETTE.sunIntensity}
        color={DAY_PALETTE.sunLight}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Pantulan langit hangat dari arah berlawanan matahari. */}
      <directionalLight
        ref={fillRef}
        position={[-10, 6, -12]}
        intensity={DAY_PALETTE.fillIntensity}
        color={DAY_PALETTE.fillLight}
      />
    </>
  )
}
