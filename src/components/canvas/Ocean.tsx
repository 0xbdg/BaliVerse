import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  FOG_COLOR,
  FOG_FAR,
  FOG_NEAR,
  OCEAN_SIZE,
  SUN_POSITION,
} from '../../data/island'
import { oceanFragmentShader, oceanVertexShader } from '../../shaders/ocean'

interface OceanProps {
  shoreMask: THREE.DataTexture
  shoreBounds: THREE.Vector4
}

export function Ocean({ shoreMask, shoreBounds }: OceanProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, 180, 180)
    plane.rotateX(-Math.PI / 2)
    return plane
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uShore: { value: shoreMask },
      uShoreBounds: { value: shoreBounds },
      uSunDir: {
        value: new THREE.Vector3(...SUN_POSITION).normalize(),
      },
      uDeep: { value: new THREE.Color('#0a4a59') },
      uShallow: { value: new THREE.Color('#10949a') },
      uLagoon: { value: new THREE.Color('#5cd9ca') },
      uFoam: { value: new THREE.Color('#eaf7f4') },
      uSky: { value: new THREE.Color('#c9e9f2') },
      uFogColor: { value: new THREE.Color(FOG_COLOR) },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    }),
    [shoreMask, shoreBounds],
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
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
