import { create } from 'zustand'
import { CAMERA_HOME, type Vec3 } from '../data/island'

export interface CameraRequest {
  id: number
  position: Vec3
  target: Vec3
  duration?: number
}

interface SceneState {
  cameraRequest: CameraRequest | null
  flyTo: (position: Vec3, target: Vec3, duration?: number) => void
  resetCamera: () => void
}

let requestId = 0

export const useSceneStore = create<SceneState>((set) => ({
  cameraRequest: null,
  flyTo: (position, target, duration) =>
    set({
      cameraRequest: {
        id: (requestId += 1),
        position,
        target,
        duration,
      },
    }),
  resetCamera: () =>
    set({
      cameraRequest: {
        id: (requestId += 1),
        position: CAMERA_HOME.position,
        target: CAMERA_HOME.target,
      },
    }),
}))
