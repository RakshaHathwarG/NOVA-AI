import { motion } from 'framer-motion'

/**
 * Premium orb loader — a rotating gradient ring with a pulsing core.
 * Used for full-page transitions and async waits.
 */
export default function Loader({ label = 'Loading NOVA' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#6D5AE6',
            borderRightColor: '#B04BF0',
            borderBottomColor: '#3FE0D0',
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-3 rounded-full bg-nova-gradient blur-[2px]"
          animate={{ scale: [0.85, 1, 0.85], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-sm tracking-[0.2em] uppercase text-ink-muted font-medium">{label}</p>
    </div>
  )
}
