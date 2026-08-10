import { motion } from 'framer-motion'

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${8 + (i * 5.2) % 84}%`,
  top: `${12 + (i * 7.3) % 76}%`,
  size: 1 + (i % 3) * 0.5,
  duration: 12 + (i % 6) * 3,
  delay: i * 0.4,
  color: i % 2 === 0 ? 'rgba(176,75,240,0.6)' : 'rgba(63,224,208,0.6)',
}))

export default function DashboardParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-nova-purple/10 blur-[120px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 top-1/3 h-[450px] w-[450px] rounded-full bg-nova-cyan/8 blur-[130px]"
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-nova-purple/8 blur-[100px]"
        animate={{ x: [0, 20, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${6 + p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
