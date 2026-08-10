import { motion } from 'framer-motion'
import { User, Headphones, Mic, Globe } from 'lucide-react'

const MODULES = [
  {
    id: 'hr',
    icon: User,
    title: 'HR Assistant',
    description: 'Enterprise HR policy guidance and employee support',
    color: '#8A2EFF',
    glow: 'rgba(138, 46, 255, 0.5)',
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Customer Support',
    description: 'Intelligent 24/7 customer conversations',
    color: '#00D9FF',
    glow: 'rgba(0, 217, 255, 0.5)',
  },
  {
    id: 'voice',
    icon: Mic,
    title: 'Voice AI',
    description: 'Natural speech recognition and expressive voice responses',
    color: '#B16CFF',
    glow: 'rgba(177, 108, 255, 0.5)',
  },
  {
    id: 'multilingual',
    icon: Globe,
    title: 'Multilingual AI',
    description: 'Real-time multilingual communication',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.5)',
  },
]

/**
 * AICapabilityModules Component
 * Replaces fake stat numbers with 4 elegant glassmorphic AI Capability Cards
 * connected by an animated NOVA Core energy line with floating dust particles.
 */
export default function AICapabilityModules() {
  return (
    <div className="relative z-30 mx-auto w-full max-w-7xl px-6 -mt-4 mb-24">
      <style>{`
        @keyframes line-energy-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes icon-soft-breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .energy-line-flow {
          background: linear-gradient(90deg, #8A2EFF, #00D9FF, #B16CFF, #00D9FF, #8A2EFF);
          background-size: 200% 100%;
          animation: line-energy-flow 6s linear infinite;
        }
        .icon-soft-pulse { animation: icon-soft-breathe 3.6s ease-in-out infinite; }
      `}</style>

      {/* Floating Background Particles behind the cards */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-40">
        <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-[#8A2EFF]/20 blur-3xl" />
        <div className="absolute right-[15%] bottom-[10%] h-40 w-40 rounded-full bg-[#00D9FF]/20 blur-3xl" />
      </div>

      {/* Connecting Thin Animated Energy Line spanning across all modules */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="h-[2px] w-full rounded-full energy-line-flow opacity-70 shadow-[0_0_12px_rgba(0,217,255,0.6)]" />
        <div className="absolute rounded-full border border-[#00D9FF]/40 bg-[#04081c] px-3.5 py-1 text-[10px] font-semibold tracking-widest text-[#00D9FF] uppercase shadow-[0_0_14px_rgba(0,217,255,0.4)] backdrop-blur-md">
          POWERED BY NOVA CORE
        </div>
      </div>

      {/* 4 AI Capability Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((module, index) => {
          const Icon = module.icon
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#060814]/85 p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-white/30 hover:shadow-[0_0_35px_rgba(0,217,255,0.22)]"
            >
              {/* Subtle Card Ambient Glow overlay on hover */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-2xl"
                style={{ backgroundColor: module.color }}
              />

              {/* Card Header: Soft Pulsing Icon */}
              <div>
                <div
                  className="icon-soft-pulse flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110"
                  style={{ boxShadow: `0 0 20px ${module.glow}` }}
                >
                  <Icon size={20} color={module.color} strokeWidth={1.9} />
                </div>

                {/* Module Title */}
                <h3 className="mt-5 text-base font-semibold tracking-wide text-white font-display">
                  {module.title}
                </h3>

                {/* Module Description */}
                <p className="mt-2 text-xs font-light leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                  {module.description}
                </p>
              </div>

              {/* Bottom Subtle Status Indicator */}
              <div className="mt-6 flex items-center gap-1.5 border-t border-white/5 pt-3">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: module.color, boxShadow: `0 0 8px ${module.color}` }}
                />
                <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                  Active AI Module
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
