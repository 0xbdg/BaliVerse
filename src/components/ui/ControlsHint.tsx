const HINTS = [
  { label: 'Drag', value: 'Putar peta' },
  { label: 'Scroll', value: 'Zoom' },
  { label: 'Klik kanan', value: 'Geser' },
]

export function ControlsHint() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4 sm:p-6">
      <div className="hidden items-center gap-4 rounded-full border border-white/35 bg-[rgba(15,29,33,0.52)] px-5 py-2 text-[11px] text-white/80 shadow-[0_8px_30px_rgba(6,24,28,0.25)] backdrop-blur-md sm:flex">
        {HINTS.map((hint, index) => (
          <div key={hint.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className="mr-2.5 h-1 w-1 rounded-full bg-white/25" aria-hidden="true" />
            )}
            <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-medium tracking-wide text-white">
              {hint.label}
            </span>
            <span className="text-white/65">{hint.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-full border border-white/35 bg-[rgba(15,29,33,0.52)] px-4 py-2 text-[10px] text-white/80 shadow-[0_8px_30px_rgba(6,24,28,0.25)] backdrop-blur-md sm:hidden">
        <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-medium text-white">
          1 jari
        </span>
        <span className="text-white/65">putar</span>
        <span className="mx-1 h-1 w-1 rounded-full bg-white/25" aria-hidden="true" />
        <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-medium text-white">
          2 jari
        </span>
        <span className="text-white/65">zoom &amp; geser</span>
      </div>
    </div>
  )
}
