export function HeaderHud() {
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

      <div className="hidden rounded-full border border-white/40 bg-[rgba(18,24,28,0.42)] px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/75 backdrop-blur-md sm:block">
        Pulau Bali · Diorama 3D
      </div>
    </header>
  )
}
