import { create } from 'zustand'
import { CAMERA_HOME, type Vec3 } from '../data/island'
import type { SceneMode } from '../data/environment'

export interface CameraRequest {
  id: number
  position: Vec3
  target: Vec3
  duration?: number
}

interface SceneState {
  cameraRequest: CameraRequest | null
  mode: SceneMode
  flyTo: (position: Vec3, target: Vec3, duration?: number) => void
  resetCamera: () => void
  setMode: (mode: SceneMode) => void
  toggleMode: () => void
}

let requestId = 0

export const useSceneStore = create<SceneState>((set) => ({
  cameraRequest: null,
  mode: 'day',
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
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ mode: state.mode === 'day' ? 'night' : 'day' })),
}))
