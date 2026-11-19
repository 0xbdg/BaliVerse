import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  DAY_PALETTE,
  MOON_DIRECTION,
  NIGHT_PALETTE,
  SUN_DIRECTION,
} from '../../data/environment'
import { OCEAN_SIZE } from '../../data/island'
import { oceanFragmentShader, oceanVertexShader } from '../../shaders/ocean'
import { useSceneStore } from '../../store/useSceneStore'

interface OceanProps {
  shoreMask: THREE.DataTexture
  shoreBounds: THREE.Vector4
}

export function Ocean({ shoreMask, shoreBounds }: OceanProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const mode = useSceneStore((state) => state.mode)
  const blend = useRef(mode === 'night' ? 1 : 0)

  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, 180, 180)
    plane.rotateX(-Math.PI / 2)
    return plane
  }, [])

  const palette = useMemo(
    () => ({
      deepDay: new THREE.Color(DAY_PALETTE.oceanDeep),
      deepNight: new THREE.Color(NIGHT_PALETTE.oceanDeep),
      shallowDay: new THREE.Color(DAY_PALETTE.oceanShallow),
      shallowNight: new THREE.Color(NIGHT_PALETTE.oceanShallow),
      lagoonDay: new THREE.Color(DAY_PALETTE.oceanLagoon),
      lagoonNight: new THREE.Color(NIGHT_PALETTE.oceanLagoon),
      foamDay: new THREE.Color(DAY_PALETTE.oceanFoam),
      foamNight: new THREE.Color(NIGHT_PALETTE.oceanFoam),
      skyDay: new THREE.Color(DAY_PALETTE.oceanSky),
      skyNight: new THREE.Color(NIGHT_PALETTE.oceanSky),
      fogDay: new THREE.Color(DAY_PALETTE.fog),
      fogNight: new THREE.Color(NIGHT_PALETTE.fog),
      sunDay: new THREE.Vector3(...SUN_DIRECTION).normalize(),
      sunNight: new THREE.Vector3(...MOON_DIRECTION).normalize(),
    }),
    [],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uShore: { value: shoreMask },
      uShoreBounds: { value: shoreBounds },
      uSunDir: { value: palette.sunDay.clone() },
      uDeep: { value: palette.deepDay.clone() },
      uShallow: { value: palette.shallowDay.clone() },
      uLagoon: { value: palette.lagoonDay.clone() },
      uFoam: { value: palette.foamDay.clone() },
      uSky: { value: palette.skyDay.clone() },
      uFogColor: { value: palette.fogDay.clone() },
      uFogNear: { value: 45 },
      uFogFar: { value: 150 },
    }),
    [shoreMask, shoreBounds, palette],
  )

  useFrame((state, delta) => {
    const material = materialRef.current
    if (!material) return

    const target = mode === 'night' ? 1 : 0
    blend.current = THREE.MathUtils.damp(blend.current, target, 1.8, delta)
    const t = blend.current

    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uDeep.value.copy(palette.deepDay).lerp(palette.deepNight, t)
    material.uniforms.uShallow.value
      .copy(palette.shallowDay)
      .lerp(palette.shallowNight, t)
    material.uniforms.uLagoon.value
      .copy(palette.lagoonDay)
      .lerp(palette.lagoonNight, t)
    material.uniforms.uFoam.value.copy(palette.foamDay).lerp(palette.foamNight, t)
    material.uniforms.uSky.value.copy(palette.skyDay).lerp(palette.skyNight, t)
    material.uniforms.uFogColor.value.copy(palette.fogDay).lerp(palette.fogNight, t)
    material.uniforms.uFogNear.value = THREE.MathUtils.lerp(45, 36, t)
    material.uniforms.uFogFar.value = THREE.MathUtils.lerp(150, 128, t)
    material.uniforms.uSunDir.value
      .copy(palette.sunDay)
      .lerp(palette.sunNight, t)
      .normalize()
  })

  return (
    <mesh geometry={geometry} position={[0, 0.006, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={oceanVertexShader}
        fragmentShader={oceanFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
