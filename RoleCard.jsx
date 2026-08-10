import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge'

const ACCENTS = {
  indigo: {
    glow: 'hover:shadow-glow-indigo',
    ring: 'from-nova-indigo via-nova-purple to-nova-indigo',
    text: 'text-nova-indigo',
    dot: 'bg-nova-indigo',
    orb: 'bg-nova-indigo',
  },
  cyan: {
    glow: 'hover:shadow-glow-cyan',
    ring: 'from-nova-cyan via-nova-sky to-nova-cyan',
    text: 'text-nova-cyan',
    dot: 'bg-nova-cyan',
    orb: 'bg-nova-cyan',
  },
}

export default function RoleCard({ role, index }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const Icon = Icons[role.icon] || Icons.Bot
  const accent = ACCENTS[role.accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(role.path)}
      whileHover={{ y: -8 }}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl glass shadow-glass p-8 md:p-10 transition-shadow duration-500 ${accent.glow}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(role.path)}
    >
      {/* Animated gradient border */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          padding: '1.5px',
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        <div className={`h-full w-full rounded-3xl bg-gradient-to-br ${accent.ring} animate-gradient-shift bg-[length:200%_200%]`} />
      </div>

      {/* Ambient glow orb illustration */}
      <div className="relative mb-8 flex h-40 items-center justify-center">
        <motion.div
          className={`absolute h-28 w-28 rounded-full ${accent.orb} opacity-20 blur-2xl`}
          animate={hovered ? { scale: 1.3 } : { scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-white/10"
          style={{ margin: 'auto', width: 130, height: 130 }}
          animate={{ rotate: hovered ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          animate={hovered ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl glass-panel"
        >
          <Icon size={32} className={accent.text} strokeWidth={1.6} />
        </motion.div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Badge tone={role.accent === 'indigo' ? 'indigo' : 'cyan'}>{role.persona}</Badge>
          <span className={`h-1.5 w-1.5 rounded-full ${accent.dot} animate-pulse`} />
        </div>

        <h3 className="text-2xl font-semibold text-white mb-1">{role.name}</h3>
        <p className={`text-sm font-medium mb-4 ${accent.text}`}>{role.tagline}</p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6">{role.description}</p>

        <div className="flex flex-wrap gap-2 mb-7">
          {role.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-ink-muted">
              {tag}
            </span>
          ))}
        </div>

        <div className={`inline-flex items-center gap-2 text-sm font-semibold ${accent.text}`}>
          Start conversation
          <motion.span animate={hovered ? { x: 4 } : { x: 0 }} transition={{ duration: 0.3 }}>
            <ArrowRight size={16} />
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
