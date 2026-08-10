import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

/**
 * Base glassmorphic card used across the app. Accepts a `glow` accent
 * ('indigo' | 'purple' | 'cyan') for hover shadow color, and `interactive`
 * to enable lift + border animation on hover.
 */
export default function GlassCard({
  children,
  className = '',
  glow = 'indigo',
  interactive = false,
  as: Component = motion.div,
  ...props
}) {
  const glowShadow = {
    indigo: 'hover:shadow-glow-card-purple',
    purple: 'hover:shadow-glow-card-purple',
    cyan: 'hover:shadow-glow-card-cyan',
  }[glow]

  const glowAccent = {
    indigo: 'from-nova-purple/10 via-transparent to-nova-cyan/5',
    purple: 'from-nova-purple/12 via-transparent to-transparent',
    cyan: 'from-nova-cyan/10 via-transparent to-nova-purple/5',
  }[glow]

  return (
    <Component
      className={cn(
        'glass-panel border-glow relative isolate overflow-hidden rounded-dashboard',
        interactive && 'group cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/15',
        interactive && glowShadow,
        className
      )}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80', glowAccent)} />
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-nova-purple/5 blur-2xl" />
      {children}
    </Component>
  )
}
