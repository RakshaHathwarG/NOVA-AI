import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, BarChart3, Bot, Headset, Mic } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const ACTIONS = [
  {
    label: 'Launch HR Assistant',
    hint: 'Policy guidance and people support',
    path: '/assistant/hr',
    icon: Bot,
    glow: 'purple',
  },
  {
    label: 'Launch Customer Support',
    hint: 'Order help and issue resolution',
    path: '/assistant/support',
    icon: Headset,
    glow: 'cyan',
  },
  {
    label: 'Open ARIA chat',
    hint: 'Start a new HR conversation',
    path: '/assistant/hr',
    icon: Mic,
    glow: 'cyan',
  },
  {
    label: 'View Analytics',
    hint: 'Weekly interactions and usage',
    scrollTo: 'analytics',
    icon: BarChart3,
    glow: 'purple',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()

  function handleAction(action) {
    if (action.scrollTo) {
      document.getElementById(action.scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    navigate(action.path)
  }

  return (
    <GlassCard glow="cyan" className="h-full p-6 md:p-7">
      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Quick Actions</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Launch & Navigate</h2>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon
          const isPurple = action.glow === 'purple'

          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action)}
              className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-dashboard border p-4 text-left transition-all duration-300 ${
                isPurple
                  ? 'border-nova-purple/20 bg-nova-purple/[0.04] hover:border-nova-purple/40 hover:shadow-[0_0_40px_-8px_rgba(176,75,240,0.35)]'
                  : 'border-nova-cyan/20 bg-nova-cyan/[0.04] hover:border-nova-cyan/40 hover:shadow-[0_0_40px_-8px_rgba(63,224,208,0.35)]'
              }`}
            >
              <div className="flex w-full items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-dashboard border ${
                    isPurple ? 'border-nova-purple/30 bg-nova-purple/10' : 'border-nova-cyan/30 bg-nova-cyan/10'
                  }`}
                >
                  <Icon size={18} className={isPurple ? 'text-nova-purple' : 'text-nova-cyan'} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{action.hint}</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </GlassCard>
  )
}
