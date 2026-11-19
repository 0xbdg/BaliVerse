import { FOG_COLOR, SUN_POSITION } from '../../data/island'

export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#cfe8ff', '#6d5c40', 0.7]} />
      <ambientLight intensity={0.22} color="#ffe9c9" />
      <directionalLight
        position={SUN_POSITION}
        intensity={2.4}
        color="#fff0d2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Pantulan langit hangat dari arah berlawanan matahari. */}
      <directionalLight position={[-10, 6, -12]} intensity={0.35} color={FOG_COLOR} />
    </>
  )
}
