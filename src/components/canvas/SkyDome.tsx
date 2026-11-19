import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  DAY_PALETTE,
  MOON_DIRECTION,
  NIGHT_PALETTE,
  SUN_DIRECTION,
} from '../../data/environment'
import { skyFragmentShader, skyVertexShader } from '../../shaders/sky'
import { useSceneStore } from '../../store/useSceneStore'

export function SkyDome() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const mode = useSceneStore((state) => state.mode)
  const blend = useRef(mode === 'night' ? 1 : 0)

  const uniforms = useMemo(
    () => ({
      uDayTop: { value: new THREE.Color(DAY_PALETTE.skyTop) },
      uDayHorizon: { value: new THREE.Color(DAY_PALETTE.skyHorizon) },
      uNightTop: { value: new THREE.Color(NIGHT_PALETTE.skyTop) },
      uNightHorizon: { value: new THREE.Color(NIGHT_PALETTE.skyHorizon) },
      uSunColor: { value: new THREE.Color(DAY_PALETTE.sunColor) },
      uMoonColor: { value: new THREE.Color(NIGHT_PALETTE.moonColor) },
      uSunDir: { value: new THREE.Vector3(...SUN_DIRECTION).normalize() },
      uMoonDir: { value: new THREE.Vector3(...MOON_DIRECTION).normalize() },
      uNight: { value: blend.current },
      uTime: { value: 0 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const material = materialRef.current
    if (!material) return

    const target = mode === 'night' ? 1 : 0
    blend.current = THREE.MathUtils.damp(blend.current, target, 2.1, delta)
    material.uniforms.uNight.value = blend.current
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[220, 32, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  )
}
