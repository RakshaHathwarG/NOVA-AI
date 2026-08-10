import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'

const DATA = [
  { day: 'Mon', hr: 5, support: 7 },
  { day: 'Tue', hr: 7, support: 8 },
  { day: 'Wed', hr: 6, support: 6 },
  { day: 'Thu', hr: 8, support: 7 },
  { day: 'Fri', hr: 9, support: 9 },
  { day: 'Sat', hr: 4, support: 5 },
  { day: 'Sun', hr: 3, support: 4 },
]

const MAX = 10
const GRID_LINES = [2, 4, 6, 8, 10]

export default function WeeklyChart() {
  return (
    <GlassCard className="h-full p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Weekly interaction pulse</h3>
          <p className="mt-1 text-sm text-ink-muted">A grounded view of assistant engagement across the week.</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-nova-indigo" /> HR
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-nova-cyan" /> Support
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-ink-faint">
          <span>Peak demand on Friday</span>
          <span>8.2 avg sessions</span>
        </div>
        <div className="relative h-48">
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            {GRID_LINES.map((line) => (
              <div key={line} className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">{line}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex h-full items-end justify-between gap-3 pt-2">
            {DATA.map((d, i) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.hr / MAX) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="w-3 rounded-t-md bg-nova-indigo/85"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.support / MAX) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05 + 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="w-3 rounded-t-md bg-nova-cyan/85"
                  />
                </div>
                <span className="text-[11px] text-ink-faint">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
