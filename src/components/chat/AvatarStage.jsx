import { motion } from 'framer-motion'

const ACCENTS = {
  indigo: { core: 'bg-nova-indigo', ring: 'border-nova-indigo/40', glow: 'shadow-glow-indigo' },
  cyan: { core: 'bg-nova-cyan', ring: 'border-nova-cyan/40', glow: 'shadow-glow-cyan' },
}

/**
 * Abstract holographic avatar visualization — a reactive core that pulses
 * while the assistant is "speaking" (isSpeaking) and idles gently otherwise.
 * Intentionally abstract rather than a literal human figure.
 */
export default function AvatarStage({ persona, accent = 'indigo', isSpeaking = false, isTyping = false }) {
  const a = ACCENTS[accent]

  return (
    <div className="relative flex flex-col items-center justify-center py-10">
      <div className="relative h-40 w-40">
        <motion.div
          className={`absolute inset-0 rounded-full border ${a.ring}`}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
        />
        <motion.div
          className={`absolute inset-4 rounded-full border border-dashed ${a.ring}`}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
        />

        <motion.div
          className={`absolute inset-10 rounded-full ${a.core} ${a.glow}`}
          animate={
            isSpeaking
              ? { scale: [1, 1.15, 0.95, 1.1, 1], opacity: [0.85, 1, 0.8, 1, 0.85] }
              : isTyping
              ? { scale: [1, 1.06, 1] }
              : { scale: [1, 1.03, 1] }
          }
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.1 : isTyping ? 0.9 : 3.2,
            ease: 'easeInOut',
          }}
        />

        {/* Sound-reactive bars, visible while speaking */}
        {isSpeaking && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-1 h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className={`w-1 rounded-full ${a.core}`}
                animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.08, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 font-display text-lg font-semibold text-white">{persona}</p>
      <p className="text-xs text-ink-faint mt-1">
        {isSpeaking ? 'Speaking…' : isTyping ? 'Thinking…' : 'Online'}
      </p>
    </div>
  )
}
