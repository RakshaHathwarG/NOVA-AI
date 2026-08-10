import { motion } from 'framer-motion'
import { Bell, Search, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function DashboardHeader({ firstName }) {
  const { user } = useAuth()
  const initial = (user?.name || 'N')[0].toUpperCase()

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-ink-faint backdrop-blur-sm">
            <Sparkles size={11} className="text-nova-cyan" />
            Control Center
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-nova-purple to-nova-cyan bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted md:text-[15px]">
              Your AI command center is live. Monitor assistants, track usage, and launch sessions instantly.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="group relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-nova-cyan"
            />
            <input
              type="search"
              placeholder="Search assistants, sessions..."
              className="w-full rounded-dashboard border border-white/[0.08] bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-ink-faint backdrop-blur-xl transition-all duration-300 focus:border-nova-cyan/30 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-nova-cyan/20 sm:w-72"
            />
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-dashboard border border-white/[0.08] bg-white/[0.03] text-ink-muted backdrop-blur-xl transition-colors hover:border-nova-purple/30 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-nova-purple shadow-[0_0_8px_rgba(176,75,240,0.8)]" />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 rounded-dashboard border border-white/[0.08] bg-white/[0.03] px-3 py-2 backdrop-blur-xl"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-nova-purple to-nova-cyan text-sm font-semibold text-white">
                  {initial}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-navy bg-emerald-400 status-pulse" />
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium text-white">{user?.name || 'Guest'}</p>
                <p className="truncate text-xs text-ink-faint">{user?.email || 'guest@nova.ai'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
