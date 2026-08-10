import { motion } from 'framer-motion'

/**
 * BackgroundEffects Component
 * Renders deep space backdrop, volumetric nebula cloud radial gradients,
 * and slow-moving atmospheric fog layers.
 */
export default function BackgroundEffects({ parallax = { x: 0, y: 0 } }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#020511]">
      <style>{`
        @keyframes fog-drift-slow {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate3d(40px, -20px, 0) scale(1.08); opacity: 0.45; }
        }
        @keyframes nebula-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.05); }
        }
        .fog-layer { animation: fog-drift-slow 22s ease-in-out infinite; }
        .nebula-layer { animation: nebula-pulse 14s ease-in-out infinite; }
      `}</style>

      {/* Deep Space Base Color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020511] via-[#050818] to-[#08031a]" />

      {/* Volumetric Purple Nebula Cloud (Left-Center) */}
      <motion.div
        className="absolute -left-[10%] top-[10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22)_0%,rgba(139,92,246,0.12)_45%,transparent_70%)] blur-[140px] nebula-layer"
        animate={{
          x: parallax.x * 1.5,
          y: parallax.y * 1.5,
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Volumetric Cyan Nebula Cloud (Right-Center Core) */}
      <motion.div
        className="absolute right-[5%] top-[15%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.24)_0%,rgba(56,189,248,0.14)_40%,rgba(147,51,234,0.08)_65%,transparent_80%)] blur-[160px] nebula-layer"
        style={{ animationDelay: '-5s' }}
        animate={{
          x: parallax.x * -1.2,
          y: parallax.y * 1.2,
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Volumetric Deep Violet Glow (Bottom Left) */}
      <motion.div
        className="absolute bottom-[-15%] left-[20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.18)_0%,rgba(99,102,241,0.08)_50%,transparent_75%)] blur-[150px]"
        animate={{
          x: parallax.x * 0.8,
          y: parallax.y * -0.8,
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Atmospheric Fog Overlay */}
      <div className="absolute inset-0 opacity-30 fog-layer bg-[radial-gradient(ellipse_at_50%_40%,rgba(56,189,248,0.06)_0%,transparent_70%)]" />

      {/* Deep Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,5,17,0.4)_70%,rgba(2,5,17,0.85)_100%)]" />
    </div>
  )
}
