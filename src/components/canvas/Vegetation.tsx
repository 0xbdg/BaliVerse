import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { LANDMARK_CLEARANCES } from '../../data/landmarks'
import type { HeightField } from '../../lib/terrain'
import {
  getFrangipaniGeometry,
  getPalmGeometry,
  mulberry32,
} from '../../lib/vegetation'

interface VegetationProps {
  heightField: HeightField
}

interface PlantInstance {
  x: number
  y: number
  z: number
  rotation: number
  tiltX: number
  tiltZ: number
  scale: number
  tint: number
}

const PALM_COUNT = 300

const FRANGIPANI_ZONES = [
  { x: 4.05, z: 0.55, radius: 0.5, count: 8 },
  { x: 2.6, z: 3.66, radius: 0.65, count: 16 },
  { x: 1.5, z: 3.5, radius: 0.5, count: 10 },
  { x: 1.2, z: 7.0, radius: 0.42, count: 6 },
  { x: 0.55, z: 3.25, radius: 0.35, count: 4 },
]

function buildPalms(heightField: HeightField): PlantInstance[] {
  const random = mulberry32(0x5a17)
  const palms: PlantInstance[] = []
  const { minX, maxX, minZ, maxZ } = heightField
  let attempts = 0

  while (palms.length < PALM_COUNT && attempts < 60000) {
    attempts += 1
    const x = minX + 0.35 + random() * (maxX - minX - 0.7)
    const z = minZ + 0.35 + random() * (maxZ - minZ - 0.7)
    const y = heightField.heightAt(x, z)

    if (y < 0.045 || y > 0.95) continue
    if (heightField.slopeAt(x, z) > 0.8) continue
    if (
      LANDMARK_CLEARANCES.some(
        (zone) => (x - zone.x) ** 2 + (z - zone.z) ** 2 < zone.radius ** 2,
      )
    ) {
      continue
    }

    palms.push({
      x,
      y: y - 0.01,
      z,
      rotation: random() * Math.PI * 2,
      tiltX: (random() - 0.5) * 0.16,
      tiltZ: (random() - 0.5) * 0.16,
      scale: 0.78 + random() * 0.5,
      tint: 0.86 + random() * 0.16,
    })
  }

  return palms
}

function buildFrangipani(heightField: HeightField): PlantInstance[] {
  const random = mulberry32(0x9c4e)
  const trees: PlantInstance[] = []

  for (const zone of FRANGIPANI_ZONES) {
    let placed = 0
    let attempts = 0
    while (placed < zone.count && attempts < 400) {
      attempts += 1
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * zone.radius
      const x = zone.x + Math.cos(angle) * radius
      const z = zone.z + Math.sin(angle) * radius
      const y = heightField.heightAt(x, z)

      if (y < 0.02 || heightField.slopeAt(x, z) > 1.3) continue

      trees.push({
        x,
        y: y - 0.005,
        z,
        rotation: random() * Math.PI * 2,
        tiltX: (random() - 0.5) * 0.1,
        tiltZ: (random() - 0.5) * 0.1,
        scale: 0.75 + random() * 0.45,
        tint: 0.9 + random() * 0.14,
      })
      placed += 1
    }
  }

  return trees
}

function useInstances(
  instances: PlantInstance[],
  meshRef: RefObject<THREE.InstancedMesh | null>,
) {
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    instances.forEach((plant, index) => {
      dummy.position.set(plant.x, plant.y, plant.z)
      dummy.rotation.set(plant.tiltX, plant.rotation, plant.tiltZ)
      dummy.scale.setScalar(plant.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      color.setScalar(plant.tint)
      mesh.setColorAt(index, color)
    })

    mesh.count = instances.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [instances, meshRef])
}

export function Vegetation({ heightField }: VegetationProps) {
  const palmRef = useRef<THREE.InstancedMesh>(null)
  const frangipaniRef = useRef<THREE.InstancedMesh>(null)

  const palmGeometry = useMemo(() => getPalmGeometry(), [])
  const frangipaniGeometry = useMemo(() => getFrangipaniGeometry(), [])
  const palms = useMemo(() => buildPalms(heightField), [heightField])
  const frangipani = useMemo(() => buildFrangipani(heightField), [heightField])

  const palmMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.92,
        metalness: 0,
        flatShading: true,
        side: THREE.DoubleSide,
      }),
    [],
  )

  const frangipaniMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.88,
        metalness: 0,
        flatShading: true,
      }),
    [],
  )

  useInstances(palms, palmRef)
  useInstances(frangipani, frangipaniRef)

  return (
    <>
      <instancedMesh
        ref={palmRef}
        args={[palmGeometry, palmMaterial, palms.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
      <instancedMesh
        ref={frangipaniRef}
        args={[frangipaniGeometry, frangipaniMaterial, frangipani.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
    </>
  )
}
