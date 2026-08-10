import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

const STREAMS = [
  {
    id: 'stream-hr',
    d: 'M -90 205 C 140 165, 240 180, 405 218 S 740 272, 1080 306',
    stroke: 'url(#stream-purple)',
    className: 'stream-flow stream-flow-1',
  },
  {
    id: 'stream-support',
    d: 'M -90 286 C 165 246, 270 258, 448 300 S 780 352, 1100 332',
    stroke: 'url(#stream-violet)',
    className: 'stream-flow stream-flow-2',
  },
  {
    id: 'stream-voice',
    d: 'M -90 366 C 180 332, 284 340, 490 382 S 822 430, 1120 406',
    stroke: 'url(#stream-cyan)',
    className: 'stream-flow stream-flow-3',
  },
  {
    id: 'stream-multilingual',
    d: 'M -80 448 C 180 414, 300 426, 508 464 S 848 504, 1088 474',
    stroke: 'url(#stream-blue)',
    className: 'stream-flow stream-flow-4',
  },
]

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

const NEURAL_LINKS = [
  'M 160 170 C 290 124, 340 132, 460 168 S 650 224, 790 218',
  'M 180 590 C 330 532, 400 540, 530 568 S 690 620, 800 600',
  'M 760 220 C 880 200, 1020 210, 1120 248',
  'M 820 590 C 932 564, 1048 568, 1144 612',
]

const NEURAL_NODES = [
  { left: '16%', top: '24%', size: 4 },
  { left: '32%', top: '18%', size: 3 },
  { left: '44%', top: '28%', size: 3 },
  { left: '60%', top: '24%', size: 4 },
  { left: '74%', top: '32%', size: 3 },
  { left: '24%', top: '58%', size: 3 },
  { left: '40%', top: '64%', size: 4 },
  { left: '56%', top: '58%', size: 3 },
  { left: '70%', top: '62%', size: 3 },
  { left: '82%', top: '54%', size: 4 },
]

export default function AmbientBackground({ variant = 'default', className = '' }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const isQuiet = variant === 'quiet'

  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20
      const y = (event.clientY / window.innerHeight - 0.5) * 20
      setParallax({ x, y })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020511]', className)} aria-hidden="true">
      <style>{`
        @keyframes streamFlow {
          0% { stroke-dashoffset: 840; }
          100% { stroke-dashoffset: -140; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.96); opacity: 0.72; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.16; transform: scale(0.8); }
          50% { opacity: 0.75; transform: scale(1.15); }
        }
        @keyframes packetMove {
          0% { transform: translate3d(-18px, 0, 0) scale(0.8); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translate3d(24px, 0, 0) scale(1); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(18px, -12px, 0); }
        }
        .stream-flow {
          stroke-dasharray: 24 38;
          animation: streamFlow 28s linear infinite;
          opacity: 0.92;
        }
        .stream-flow-2 { animation-duration: 34s; animation-delay: -7s; }
        .stream-flow-3 { animation-duration: 31s; animation-delay: -14s; }
        .stream-flow-4 { animation-duration: 36s; animation-delay: -4s; }
        .core-pulse { animation: pulseGlow 4.8s ease-in-out infinite; }
        .twinkle-dot { animation: twinkle 3.8s ease-in-out infinite; }
        .packet-travel { animation: packetMove 6s ease-in-out infinite; }
        .drift-soft { animation: drift 9s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(176,75,240,0.12),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(63,224,208,0.1),transparent_30%),linear-gradient(135deg,#020511_0%,#050a18_48%,#0a1020_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.55),transparent_57%)]" />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '78px 78px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 32%, transparent 82%)',
        }}
      />

      <motion.div
        className="absolute -top-24 -left-16 h-[480px] w-[480px] rounded-full bg-[#8B5CF6]/18 blur-[160px]"
        animate={{ x: parallax.x * 1.2, y: parallax.y * 1.1, scale: [1, 1.03, 1] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute right-[-8%] top-[12%] h-[560px] w-[560px] rounded-full bg-[#22D3EE]/12 blur-[180px]"
        animate={{ x: parallax.x * -0.9, y: parallax.y * 0.9, scale: [1, 1.05, 1] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[16%] h-[420px] w-[420px] rounded-full bg-[#A855F7]/14 blur-[150px]"
        animate={{ x: parallax.x * 0.7, y: parallax.y * -0.7, scale: [1, 1.02, 1] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        style={{ transform: `translate3d(${parallax.x * 0.22}px, ${parallax.y * 0.18}px, 0)` }}
      >
        <defs>
          <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.38" />
          </linearGradient>
        </defs>
        <path d="M-60 190 C 220 142, 360 186, 624 232 S 1052 300, 1496 232" stroke="url(#mesh-gradient)" strokeWidth="1.1" fill="none" />
        <path d="M-40 316 C 250 268, 384 302, 620 336 S 1040 392, 1490 328" stroke="url(#mesh-gradient)" strokeWidth="1.1" fill="none" />
        <path d="M-20 438 C 286 402, 400 436, 644 468 S 1072 518, 1510 456" stroke="url(#mesh-gradient)" strokeWidth="1.1" fill="none" />
        <path d="M150 120 C 430 90, 550 100, 742 160 S 1114 234, 1428 180" stroke="url(#mesh-gradient)" strokeWidth="1.1" fill="none" />
      </svg>

      <motion.div
        className="absolute inset-0"
        animate={{ x: parallax.x * 0.2, y: parallax.y * 0.16 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 1440 900" className="absolute inset-0 h-full w-full" style={{ opacity: isQuiet ? 0.72 : 0.95 }}>
          <defs>
            <linearGradient id="stream-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139,92,246,0)" />
              <stop offset="40%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="stream-violet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(168,85,247,0)" />
              <stop offset="45%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id="stream-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34,211,238,0)" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="stream-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0)" />
              <stop offset="45%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="stream-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {STREAMS.map((stream) => (
            <path
              key={stream.id}
              d={stream.d}
              stroke={stream.stroke}
              strokeWidth="2.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#stream-glow)"
              className={stream.className}
            />
          ))}
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ x: parallax.x * 0.15, y: parallax.y * 0.12 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="absolute inset-0">
          {STREAM_PARTICLES.map((particle, index) => (
            <motion.div
              key={`stream-particle-${index}`}
              className="absolute rounded-full bg-white/90 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
              style={{ left: particle.left, top: particle.top, width: `${particle.size}px`, height: `${particle.size}px`, opacity: particle.opacity }}
              animate={{
                x: [0, particle.x, 0],
                y: [0, particle.y, 0],
                opacity: [particle.opacity, 0.85, particle.opacity],
                scale: [0.8, 1.25, 0.8],
              }}
              transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ x: parallax.x * 0.1, y: parallax.y * 0.08 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 1440 900" className="absolute inset-0 h-full w-full opacity-[0.18]">
          {NEURAL_LINKS.map((link, index) => (
            <path
              key={`link-${index}`}
              d={link}
              stroke="url(#mesh-gradient)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drift-soft"
              style={{ animationDelay: `${index * 0.8}s` }}
            />
          ))}
        </svg>

        <div className="absolute inset-0">
          {NEURAL_NODES.map((node, index) => (
            <motion.div
              key={`node-${index}`}
              className="absolute rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
              style={{ left: node.left, top: node.top, width: `${node.size}px`, height: `${node.size}px` }}
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.35, 0.95, 0.35] }}
              transition={{ duration: 4.8 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={`packet-${index}`}
              className="absolute left-[18%] top-[24%] h-[5px] w-[5px] rounded-full bg-cyan-300/80 shadow-[0_0_10px_rgba(34,211,238,0.9)] packet-travel"
              style={{ animationDelay: `${index * 1.4}s` }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ x: parallax.x * 0.08, y: parallax.y * 0.06 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="absolute left-[71%] top-[44%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-[71%] top-[44%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-[71%] top-[44%] h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />
        <motion.div
          className="absolute left-[71%] top-[44%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute left-[71%] top-[44%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-400/15"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <div className="absolute inset-0">
        {CORE_PARTICLES.map((particle, index) => (
          <motion.div
            key={`core-particle-${index}`}
            className="absolute rounded-full bg-white/90 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
            style={{ left: particle.left, top: particle.top, width: `${particle.size}px`, height: `${particle.size}px` }}
            animate={{
              x: [0, particle.x, 0],
              y: [0, particle.y, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
          />
        ))}
      </div>

      <motion.div
        className="absolute left-[71%] top-[44%] h-[154px] w-[154px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.38),rgba(139,92,246,0.2),rgba(34,211,238,0.14),transparent_70%)] blur-[28px] core-pulse"
      />
      <motion.div
        className="absolute left-[71%] top-[44%] h-[126px] w-[126px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25 bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(139,92,246,0.16),rgba(15,23,42,0.15))] shadow-[0_0_80px_rgba(34,211,238,0.22)] core-pulse"
      />
      <motion.div
        className="absolute left-[71%] top-[44%] h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,249,195,0.94),rgba(147,197,253,0.35),rgba(139,92,246,0.24),transparent_80%)] shadow-[0_0_110px_rgba(139,92,246,0.32)] core-pulse"
      />
      <motion.div
        className="absolute left-[71%] top-[44%] h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/20 bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(34,211,238,0.2),rgba(139,92,246,0.15))] core-pulse"
      />

      <div className="absolute inset-0">
        {DUST.map((dot, index) => (
          <motion.div
            key={`dust-${index}`}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/70 twinkle-dot"
            style={{ left: dot.left, top: dot.top, opacity: dot.opacity }}
            transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(2,6,23,0.28)_72%,rgba(2,6,23,0.74)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(34,211,238,0.08),transparent_34%)]" />
    </div>
  )
}
