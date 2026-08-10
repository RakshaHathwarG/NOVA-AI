import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { BOOT_SEQUENCE_STEPS } from '../../data/avatarPersonas'

const STEP_DURATION = 420

/**
 * Premium AI initialization sequence shown before the chat surface appears.
 * Purely presentational — calls `onComplete` once every step has finished.
 */
export default function AvatarBootSequence({ persona, onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (activeIndex >= BOOT_SEQUENCE_STEPS.length) {
      const t = setTimeout(() => {
        setDone(true)
        setTimeout(() => onComplete?.(), 500)
      }, 250)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActiveIndex((i) => i + 1), STEP_DURATION)
    return () => clearTimeout(t)
  }, [activeIndex, onComplete])

  const progress = Math.min((activeIndex / BOOT_SEQUENCE_STEPS.length) * 100, 100)
  const accentClass = persona.accent === 'indigo' ? 'text-nova-indigo' : 'text-nova-cyan'
  const barGradient = persona.accent === 'indigo' ? 'from-nova-indigo to-nova-purple' : 'from-nova-cyan to-nova-sky'

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-24 w-24 mb-8"
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: persona.accent === 'indigo' ? '#6D5AE6' : '#3FE0D0',
            borderRightColor: persona.accent === 'indigo' ? '#B04BF0' : '#4BB4F0',
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        />
        <motion.span
          className={`absolute inset-4 rounded-full bg-nova-gradient blur-[1px]`}
          animate={done ? { scale: 1.15, opacity: 1 } : { scale: [0.85, 1, 0.85], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: done ? 0 : Infinity, duration: 2 }}
        />
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check size={30} className="text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className={`text-xs font-mono tracking-[0.25em] uppercase mb-2 ${accentClass}`}>
        {done ? 'Avatar Ready' : 'Booting Avatar Engine'}
      </p>
      <h3 className="text-xl font-semibold text-white mb-8">{persona.name} — {persona.role}</h3>

      <div className="w-full max-w-xs">
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-4">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <AnimatePresence mode="popLayout">
            {BOOT_SEQUENCE_STEPS.slice(Math.max(0, activeIndex - 2), activeIndex + 1).map((step, i, arr) => {
              const isCurrent = i === arr.length - 1 && !done
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isCurrent ? 1 : 0.4, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-xs"
                >
                  {isCurrent ? (
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-nova-cyan shrink-0"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  ) : (
                    <Check size={11} className="text-ink-faint shrink-0" />
                  )}
                  <span className={isCurrent ? 'text-white' : 'text-ink-faint'}>{step}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
