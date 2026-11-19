import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { CAMERA_HOME, CAMERA_HOME_PORTRAIT, CAMERA_LIMITS } from '../../data/island'
import { useSceneStore } from '../../store/useSceneStore'

interface OrbitLike {
  target: THREE.Vector3
  update: () => void
}

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const controls = useThree((state) => state.controls) as unknown as OrbitLike | null
  const request = useSceneStore((state) => state.cameraRequest)
  const tween = useRef<gsap.core.Timeline | null>(null)
  const sizeRef = useRef(size)
  sizeRef.current = size

  // Intro sinematik: turun dari atas awan menuju peta pulau.
  useEffect(() => {
    if (!controls) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const { width, height } = sizeRef.current
    const home = width / height < 0.9 ? CAMERA_HOME_PORTRAIT : CAMERA_HOME
    const target = new THREE.Vector3(...home.target)
    const destination = new THREE.Vector3(...home.position)
    const start = destination.clone().add(new THREE.Vector3(0, 16, 14))

    controls.target.copy(target)
    camera.position.copy(start)
    camera.lookAt(target)

    const timeline = gsap.timeline({
      onUpdate: () => controls.update(),
    })
    timeline.to(camera.position, {
      x: destination.x,
      y: destination.y,
      z: destination.z,
      duration: reduced ? 0.01 : 3.2,
      ease: 'power3.inOut',
    })
    tween.current = timeline

    return () => {
      timeline.kill()
    }
  }, [controls, camera])

  // Permintaan perpindahan kamera dari UI / destinasi (dipakai Fase 3).
  useEffect(() => {
    if (!request || !controls) return

    tween.current?.kill()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = request.duration ?? (reduced ? 0.01 : 2)

    const timeline = gsap.timeline({
      onUpdate: () => controls.update(),
    })
    timeline.to(
      camera.position,
      {
        x: request.position[0],
        y: request.position[1],
        z: request.position[2],
        duration,
        ease: 'power2.inOut',
      },
      0,
    )
    timeline.to(
      controls.target,
      {
        x: request.target[0],
        y: request.target[1],
        z: request.target[2],
        duration,
        ease: 'power2.inOut',
      },
      0,
    )
    tween.current = timeline

    return () => {
      timeline.kill()
    }
  }, [request, controls, camera])

  // Jaga titik fokus tetap di area pulau.
  useFrame(() => {
    if (!controls) return
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -9.5, 9.5)
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -9.5, 9.5)
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 2.6)
  })

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.55}
      zoomSpeed={0.8}
      panSpeed={0.7}
      screenSpacePanning={false}
      minDistance={CAMERA_LIMITS.minDistance}
      maxDistance={CAMERA_LIMITS.maxDistance}
      minPolarAngle={CAMERA_LIMITS.minPolarAngle}
      maxPolarAngle={CAMERA_LIMITS.maxPolarAngle}
    />
  )
}
