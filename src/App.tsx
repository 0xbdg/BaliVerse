import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Experience } from './components/canvas/Experience'
import { ControlsHint } from './components/ui/ControlsHint'
import { HeaderHud } from './components/ui/HeaderHud'
import { LoadingOverlay } from './components/ui/LoadingOverlay'

export default function App() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0b3d47]">
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 300, position: [0, 30, 32] }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
        aria-label="Peta tiga dimensi Pulau Bali yang dapat diputar dan diperbesar"
      >
        <Experience />
      </Canvas>

      <HeaderHud />
      <ControlsHint />
      <LoadingOverlay />
    </main>
  )
}
