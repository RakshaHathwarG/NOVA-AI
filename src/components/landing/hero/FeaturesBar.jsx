import { motion } from 'framer-motion'
import { BriefcaseBusiness, Languages, MessageSquareText, Volume2 } from 'lucide-react'

const STATS = [
  { icon: BriefcaseBusiness, stat: 'ARIA + SNOW', label: 'Separate HR and support roles', color: '#8A2EFF' },
  { icon: Languages, stat: '5 languages', label: 'Built-in rule-based reply templates', color: '#00D9FF' },
  { icon: Volume2, stat: 'Browser voice', label: 'Uses voices available on your device', color: '#B16CFF' },
  { icon: MessageSquareText, stat: 'Saved chats', label: 'Account-scoped conversation history', color: '#38BDF8' },
]

/**
 * FeaturesBar Component
 * Renders a floating glassmorphic statistics bar below the hero section.
 */
export default function FeaturesBar() {
  return (
    <div className="relative z-30 mx-auto w-full max-w-6xl px-6 -mt-6 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="rounded-2xl border border-white/10 bg-[#060814]/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-4 group">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110"
                  style={{ boxShadow: `0 0 20px ${item.color}30` }}
                >
                  <Icon size={22} color={item.color} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white tracking-tight font-display">
                    {item.stat}
                  </span>
                  <span className="text-xs font-light text-slate-400">
                    {item.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
