import { motion } from 'framer-motion'
import { Languages, Mic } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import { LANGUAGES } from '../../utils/constants'

const WEEKLY_DATA = [
  { day: 'Mon', hr: 5, support: 7, voice: 4 },
  { day: 'Tue', hr: 7, support: 8, voice: 6 },
  { day: 'Wed', hr: 6, support: 6, voice: 5 },
  { day: 'Thu', hr: 8, support: 7, voice: 7 },
  { day: 'Fri', hr: 9, support: 9, voice: 8 },
  { day: 'Sat', hr: 4, support: 5, voice: 3 },
  { day: 'Sun', hr: 3, support: 4, voice: 2 },
]

const VOICE_USAGE = [
  { label: 'HR Sessions', value: 68, color: 'bg-nova-purple' },
  { label: 'Support Sessions', value: 84, color: 'bg-nova-cyan' },
  { label: 'Multilingual', value: 42, color: 'bg-gradient-to-r from-nova-purple to-nova-cyan' },
]

const CHART_W = 560
const CHART_H = 160
const PADDING = { top: 12, right: 8, bottom: 24, left: 8 }
const MAX = 10

function buildPath(key) {
  const innerW = CHART_W - PADDING.left - PADDING.right
  const innerH = CHART_H - PADDING.top - PADDING.bottom
  const step = innerW / (WEEKLY_DATA.length - 1)

  const points = WEEKLY_DATA.map((d, i) => ({
    x: PADDING.left + i * step,
    y: PADDING.top + innerH - (d[key] / MAX) * innerH,
  }))

  return points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`
    const prev = points[i - 1]
    const cx = (prev.x + point.x) / 2
    return `${path} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
  }, '')
}

function buildArea(key) {
  const line = buildPath(key)
  const innerW = CHART_W - PADDING.left - PADDING.right
  const innerH = CHART_H - PADDING.top - PADDING.bottom
  const bottom = PADDING.top + innerH
  const lastX = PADDING.left + innerW
  return `${line} L ${lastX} ${bottom} L ${PADDING.left} ${bottom} Z`
}

export default function AnalyticsPanel() {
  const hrPath = buildPath('hr')
  const supportPath = buildPath('support')
  const hrArea = buildArea('hr')
  const supportArea = buildArea('support')

  return (
    <GlassCard glow="purple" className="p-6 md:p-8" id="analytics">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Analytics</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Weekly Interactions</h2>
          <p className="mt-1 text-sm text-ink-muted">HR and support engagement across the week.</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-ink-muted">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-nova-purple shadow-[0_0_8px_rgba(176,75,240,0.8)]" />
            HR
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-nova-cyan shadow-[0_0_8px_rgba(63,224,208,0.8)]" />
            Support
          </span>
        </div>
      </div>

      <div className="relative mt-8 rounded-dashboard border border-white/[0.06] bg-white/[0.02] p-5 md:p-6">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="hr-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(176,75,240,0.25)" />
              <stop offset="100%" stopColor="rgba(176,75,240,0)" />
            </linearGradient>
            <linearGradient id="support-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(63,224,208,0.2)" />
              <stop offset="100%" stopColor="rgba(63,224,208,0)" />
            </linearGradient>
            <filter id="line-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={PADDING.left}
              x2={CHART_W - PADDING.right}
              y1={PADDING.top + (CHART_H - PADDING.top - PADDING.bottom) * ratio}
              y2={PADDING.top + (CHART_H - PADDING.top - PADDING.bottom) * ratio}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}

          <motion.path
            d={supportArea}
            fill="url(#support-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.path
            d={hrArea}
            fill="url(#hr-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          <motion.path
            d={supportPath}
            fill="none"
            stroke="#3FE0D0"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#line-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={hrPath}
            fill="none"
            stroke="#B04BF0"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#line-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />

          {WEEKLY_DATA.map((d, i) => {
            const innerW = CHART_W - PADDING.left - PADDING.right
            const step = innerW / (WEEKLY_DATA.length - 1)
            const x = PADDING.left + i * step
            return (
              <text key={d.day} x={x} y={CHART_H - 4} textAnchor="middle" className="fill-ink-faint text-[10px]">
                {d.day}
              </text>
            )
          })}
        </svg>
      </div>

      <div className="relative mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-dashboard border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Mic size={16} className="text-nova-cyan" />
            Voice Usage
          </div>
          <div className="mt-5 space-y-4">
            {VOICE_USAGE.map((item, i) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-ink-muted">{item.label}</span>
                  <span className="font-medium text-white">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className={`h-full rounded-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ boxShadow: '0 0 12px rgba(63,224,208,0.4)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-dashboard border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Languages size={16} className="text-nova-purple" />
            Languages Used
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {LANGUAGES.map((lang, i) => (
              <motion.span
                key={lang}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-nova-purple/30 hover:text-white"
              >
                {lang}
              </motion.span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            Multilingual sessions active across all supported locales this week.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
