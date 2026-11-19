import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { useSceneStore } from './store/useSceneStore'

if (import.meta.env.DEV) {
  // Alat bantu debug saat pengembangan: atur kamera dari console.
  ;(window as unknown as { __scene: typeof useSceneStore }).__scene = useSceneStore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
