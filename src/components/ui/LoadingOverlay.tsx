import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgress } from '@react-three/drei'

const FACTS = [
  'Tahukah kamu? Subak adalah sistem irigasi tradisional Bali yang diakui UNESCO sejak 2012.',
  'Bali memiliki lebih dari 10.000 pura, dari pura keluarga hingga Pura Besakih di lereng Gunung Agung.',
  'Gunung Agung setinggi 3.031 meter diyakini sebagai rumah para dewa oleh masyarakat Bali.',
  'Tari Kecak diciptakan pada 1930-an dan melibatkan puluhan penari pria tanpa alat musik.',
  'Nusa Penida terpisah dari Bali oleh Selat Badung dan dikenal dengan tebing Kelingkingnya.',
]

export function LoadingOverlay() {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)
  const [fact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)])

  useEffect(() => {
    if (!active && progress >= 99.5) {
      const timeout = window.setTimeout(() => setVisible(false), 650)
      return () => window.clearTimeout(timeout)
    }
  }, [active, progress])

  const percent = Math.min(100, Math.round(progress))

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          role="status"
          aria-live="polite"
          aria-label="Memuat pengalaman Bali 3D"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, #fffdf8 0%, #faf6ee 45%, #f0e7d6 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
        >
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <CandiBentarMark />

            <p className="mt-8 font-display text-lg font-semibold tracking-[0.42em] text-stone-900">
              BALI 3D
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-stone-500">
              Interactive Island Explorer
            </p>

            <div className="mt-9 w-full">
              <div className="flex items-end justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500">
                <span>Memuat Pulau Bali</span>
                <span className="tabular-nums text-stone-700">{percent}%</span>
              </div>
              <div
                className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-stone-900/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Progres pemuatan aset"
              >
                <motion.div
                  className="h-full rounded-full bg-bali-gold"
                  initial={{ width: '0%' }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            </div>

            <p className="mt-8 max-w-sm text-[12px] leading-relaxed text-stone-500">{fact}</p>
          </div>

          <p className="absolute bottom-7 text-[10px] uppercase tracking-[0.22em] text-stone-400">
            Drag untuk memutar · Scroll untuk zoom
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CandiBentarMark() {
  return (
    <motion.svg
      viewBox="0 0 160 118"
      className="h-24 w-auto text-bali-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <path d="M26 108V66l13-8 7-26 7 26 13 8v42" />
      <path d="M94 108V66l13-8 7-26 7 26 13 8v42" />
      <path d="M20 108h120" />
      <path d="M18 112h124" strokeOpacity="0.45" />
      <path d="M46 42h18M96 42h18" strokeOpacity="0.55" />
      <circle cx="55" cy="58" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="105" cy="58" r="2.4" fill="currentColor" stroke="none" />
    </motion.svg>
  )
}
