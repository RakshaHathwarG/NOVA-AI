import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'

export default function StatsCard({ icon: Icon, label, value, detail, trend, glow = 'purple', delay = 0 }) {
  const isCyan = glow === 'cyan'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <GlassCard
        glow={glow}
        className={`group relative h-full overflow-hidden p-6 ${
          isCyan ? 'glow-card-cyan' : 'glow-card-purple'
        }`}
      >
        <motion.div
          className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-3xl ${
            isCyan ? 'bg-nova-cyan/15' : 'bg-nova-purple/15'
          }`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-dashboard border backdrop-blur-sm ${
              isCyan
                ? 'border-nova-cyan/25 bg-nova-cyan/10 shadow-[0_0_20px_-4px_rgba(63,224,208,0.5)]'
                : 'border-nova-purple/25 bg-nova-purple/10 shadow-[0_0_20px_-4px_rgba(176,75,240,0.5)]'
            }`}
          >
            <Icon size={20} className={isCyan ? 'text-nova-cyan' : 'text-nova-purple'} />
          </div>
          {trend && (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              {trend}
            </span>
          )}
        </div>

        <div className="relative mt-8">
          <motion.p
            className="text-3xl font-semibold tracking-tight text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-ink-faint">{label}</p>
          {detail && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{detail}</p>}
        </div>
      </GlassCard>
    </motion.div>
  )
}
