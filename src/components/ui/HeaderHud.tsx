import { Moon, Sun } from 'lucide-react'
import { useSceneStore } from '../../store/useSceneStore'

export function HeaderHud() {
  const mode = useSceneStore((state) => state.mode)
  const toggleMode = useSceneStore((state) => state.toggleMode)
  const isNight = mode === 'night'

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 sm:p-7">
      <div className="rounded-2xl border border-white/50 bg-[rgba(255,252,245,0.72)] px-4 py-3 shadow-[0_10px_36px_rgba(12,45,52,0.14)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-bali-gold" />
          <p className="font-display text-[15px] font-semibold tracking-[0.3em] text-stone-900">
            BALI 3D
          </p>
        </div>
        <p className="mt-1 pl-4 text-[9px] font-medium uppercase tracking-[0.22em] text-stone-500">
          Interactive Island Explorer
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden rounded-full border border-white/40 bg-[rgba(18,24,28,0.42)] px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/75 backdrop-blur-md md:block">
          Pulau Bali · Diorama 3D
        </div>

        <button
          type="button"
          onClick={toggleMode}
          aria-pressed={isNight}
          aria-label={isNight ? 'Ganti ke suasana siang' : 'Ganti ke suasana malam'}
          title={isNight ? 'Suasana siang' : 'Suasana malam'}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/40 bg-[rgba(18,24,28,0.5)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md transition-colors duration-300 hover:bg-[rgba(18,24,28,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          {isNight ? <Sun size={13} /> : <Moon size={13} />}
          <span className="hidden sm:inline">{isNight ? 'Siang' : 'Malam'}</span>
        </button>
      </div>
    </header>
  )
}
