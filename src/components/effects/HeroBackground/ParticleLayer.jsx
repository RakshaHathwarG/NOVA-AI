import { motion } from 'framer-motion'
import { CORE_POSITION } from './constants'

const STREAM_PARTICLES = [
  { left: '8%', top: '18%', size: 1.3, x: 220, y: -18, duration: 16, delay: 0.2, opacity: 0.25 },
  { left: '10%', top: '30%', size: 1.1, x: 240, y: 16, duration: 18, delay: 0.8, opacity: 0.36 },
  { left: '9%', top: '44%', size: 1.5, x: 260, y: -20, duration: 20, delay: 1.4, opacity: 0.28 },
  { left: '12%', top: '58%', size: 1.2, x: 240, y: 14, duration: 17, delay: 2.1, opacity: 0.3 },
  { left: '11%', top: '72%', size: 1.4, x: 220, y: -24, duration: 22, delay: 2.8, opacity: 0.32 },
  { left: '14%', top: '82%', size: 1.1, x: 250, y: 20, duration: 19, delay: 3.6, opacity: 0.27 },
  { left: '16%', top: '24%', size: 1.6, x: 210, y: -12, duration: 21, delay: 0.5, opacity: 0.35 },
  { left: '18%', top: '38%', size: 1.2, x: 230, y: 18, duration: 18, delay: 1.3, opacity: 0.29 },
  { left: '17%', top: '56%', size: 1.3, x: 250, y: -16, duration: 23, delay: 2.4, opacity: 0.31 },
  { left: '20%', top: '70%', size: 1.4, x: 220, y: 24, duration: 20, delay: 3.1, opacity: 0.34 },
  { left: '22%', top: '20%', size: 1.1, x: 200, y: 12, duration: 17, delay: 4.1, opacity: 0.24 },
  { left: '24%', top: '34%', size: 1.5, x: 210, y: -18, duration: 19, delay: 4.6, opacity: 0.3 },
]

const CORE_PARTICLES = [
  { left: '68%', top: '43%', size: 1.2, x: 24, y: -18, duration: 12, delay: 0.1 },
  { left: '72%', top: '48%', size: 1.1, x: -18, y: 12, duration: 14, delay: 1.2 },
  { left: '70%', top: '51%', size: 1.3, x: 18, y: 20, duration: 13, delay: 2.2 },
  { left: '75%', top: '46%', size: 1.2, x: -12, y: -16, duration: 15, delay: 3.1 },
  { left: '73%', top: '42%', size: 1, x: 16, y: 16, duration: 11, delay: 4.3 },
  { left: '77%', top: '50%', size: 1.4, x: -24, y: 12, duration: 16, delay: 5.2 },
]

const DUST = [
  { left: '12%', top: '14%', opacity: 0.18, duration: 11, delay: 0.3 },
  { left: '26%', top: '26%', opacity: 0.2, duration: 15, delay: 1.5 },
  { left: '40%', top: '12%', opacity: 0.15, duration: 13, delay: 2.7 },
  { left: '54%', top: '20%', opacity: 0.2, duration: 17, delay: 3.4 },
  { left: '66%', top: '16%', opacity: 0.16, duration: 14, delay: 4.5 },
  { left: '82%', top: '26%', opacity: 0.17, duration: 12, delay: 5.2 },
  { left: '88%', top: '40%', opacity: 0.19, duration: 16, delay: 6.1 },
  { left: '72%', top: '70%', opacity: 0.16, duration: 13, delay: 6.7 },
  { left: '22%', top: '78%', opacity: 0.16, duration: 12, delay: 7.3 },
  { left: '38%', top: '84%', opacity: 0.18, duration: 15, delay: 8.2 },
  { left: '58%', top: '76%', opacity: 0.2, duration: 14, delay: 8.9 },
  { left: '78%', top: '82%', opacity: 0.15, duration: 16, delay: 9.4 },
]

/**
 * Thousands-feel of tiny moving particles — implemented efficiently as a
 * bounded set of Framer Motion divs (GPU-accelerated transforms/opacity),
 * not a canvas particle system. Three groups: traveling along streams,
 * clustered near the core, and slow background dust.
 */
export default function ParticleLayer({ parallax }) {
  return (
    <>
      <style>{`
        @keyframes twinkle { 0%,100% { opacity: 0.16; transform: scale(0.8); } 50% { opacity: 0.75; transform: scale(1.15); } }
        .twinkle-dot { animation: twinkle 3.8s ease-in-out infinite; }
      `}</style>

      <motion.div
        className="absolute inset-0"
        animate={{ x: parallax.x * 0.15, y: parallax.y * 0.12 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {STREAM_PARTICLES.map((p, i) => (
          <motion.div
            key={`stream-p-${i}`}
            className="absolute rounded-full bg-white/90 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ x: [0, p.x, 0], y: [0, p.y, 0], opacity: [p.opacity, 0.85, p.opacity], scale: [0.8, 1.25, 0.8] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0">
        {CORE_PARTICLES.map((p, i) => (
          <motion.div
            key={`core-p-${i}`}
            className="absolute rounded-full bg-white/90 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ x: [0, p.x, 0], y: [0, p.y, 0], opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {DUST.map((d, i) => (
          <div
            key={`dust-${i}`}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/70 twinkle-dot"
            style={{ left: d.left, top: d.top, opacity: d.opacity, animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s` }}
          />
        ))}
      </div>
    </>
  )
}
