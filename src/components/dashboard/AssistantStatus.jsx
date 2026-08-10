import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bot, Headset } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import { ROLES } from '../../utils/constants'

const ICONS = { hr: Bot, support: Headset }

export default function AssistantStatus() {
  const navigate = useNavigate()

  return (
    <GlassCard glow="purple" className="h-full p-6 md:p-7">
      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">AI Assistant Status</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Live Personas</h2>
      </div>

      <div className="relative mt-6 space-y-3">
        {ROLES.map((role, i) => {
          const Icon = ICONS[role.id] || Bot
          const isPurple = role.accent === 'indigo' || role.accent === 'purple'

          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              onClick={() => navigate(role.path)}
              className="group flex w-full items-center gap-4 rounded-dashboard border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-dashboard border ${
                  isPurple
                    ? 'border-nova-purple/30 bg-nova-purple/10 shadow-[0_0_24px_-4px_rgba(176,75,240,0.4)]'
                    : 'border-nova-cyan/30 bg-nova-cyan/10 shadow-[0_0_24px_-4px_rgba(63,224,208,0.4)]'
                }`}
              >
                <Icon size={20} className={isPurple ? 'text-nova-purple' : 'text-nova-cyan'} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-white">{role.persona}</p>
                <p className="text-sm text-ink-muted">{role.name}</p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                </span>
                <span className="text-sm font-medium text-emerald-300">Online</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </GlassCard>
  )
}
