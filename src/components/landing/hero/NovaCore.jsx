import { useEffect, useRef } from 'react'

/**
 * NovaCore Component
 * Renders the central glowing NOVA AI energy core orb, multi-ring rotating radar circles,
 * orbiting particle sparks, radial light bloom, and breathing pulse animation.
 */
export default function NovaCore({ parallax = { x: 0, y: 0 } }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let dpr = window.devicePixelRatio || 1
    let width = (canvas.width = window.innerWidth * dpr)
    let height = (canvas.height = window.innerHeight * dpr)
    ctx.scale(dpr, dpr)

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1
      width = canvas.width = window.innerWidth * dpr
      height = canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', handleResize)

    // Orbiting Spark Particles
    const sparkCount = 42
    const sparks = Array.from({ length: sparkCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 70 + 65,
      speed: (Math.random() * 0.016 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2.2 + 1.1,
      alpha: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.5 ? '#00D9FF' : '#8A2EFF',
    }))

    let time = 0
    let currentPX = 0
    let currentPY = 0

    const render = () => {
      time += 0.016
      const w = window.innerWidth
      const h = window.innerHeight

      currentPX += (parallax.x - currentPX) * 0.08
      currentPY += (parallax.y - currentPY) * 0.08

      const coreX = w * 0.76 + currentPX * 1.2
      const coreY = h * 0.5 + currentPY * 1.2

      ctx.clearRect(0, 0, w, h)

      // 1. Outer Dashed Radar Ring (Clockwise Rotation)
      ctx.save()
      ctx.translate(coreX, coreY)
      ctx.rotate(time * 0.25)
      ctx.beginPath()
      ctx.arc(0, 0, 165, 0, Math.PI * 2)
      ctx.setLineDash([12, 22])
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.65)'
      ctx.lineWidth = 2.0
      ctx.shadowColor = '#00D9FF'
      ctx.shadowBlur = 14
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // 2. Inner Ticked Radar Circle (Counter-Clockwise Rotation)
      ctx.save()
      ctx.translate(coreX, coreY)
      ctx.rotate(-time * 0.18)
      ctx.beginPath()
      ctx.arc(0, 0, 112, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(138, 46, 255, 0.55)'
      ctx.lineWidth = 1.4
      ctx.stroke()

      for (let a = 0; a < 360; a += 15) {
        const rad = (a * Math.PI) / 180
        const innerR = 104
        const outerR = a % 45 === 0 ? 120 : 110
        ctx.beginPath()
        ctx.moveTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR)
        ctx.lineTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR)
        ctx.strokeStyle = a % 45 === 0 ? 'rgba(0, 217, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = a % 45 === 0 ? 2.0 : 1.0
        ctx.stroke()
      }
      ctx.restore()

      // 3. Orbiting Spark Dust
      sparks.forEach((spark) => {
        spark.angle += spark.speed
        const sx = coreX + Math.cos(spark.angle) * spark.distance
        const sy = coreY + Math.sin(spark.angle) * spark.distance

        ctx.beginPath()
        ctx.arc(sx, sy, spark.size, 0, Math.PI * 2)
        ctx.fillStyle = spark.color
        ctx.globalAlpha = spark.alpha
        ctx.shadowColor = spark.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1.0
      })

      // 4. Core Energy Orb Atmosphere Glow
      const orbGrad = ctx.createRadialGradient(coreX, coreY, 10, coreX, coreY, 82)
      orbGrad.addColorStop(0, '#ffffff')
      orbGrad.addColorStop(0.28, '#00D9FF')
      orbGrad.addColorStop(0.68, '#8A2EFF')
      orbGrad.addColorStop(1, 'rgba(6, 8, 20, 0)')

      ctx.beginPath()
      ctx.arc(coreX, coreY, 56, 0, Math.PI * 2)
      ctx.fillStyle = orbGrad
      ctx.shadowColor = '#00D9FF'
      ctx.shadowBlur = 50
      ctx.fill()
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [parallax])

  return (
    <div className="pointer-events-auto absolute inset-0 z-20">
      <style>{`
        @keyframes core-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.92; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
        }
        @keyframes pulse-ring-expand {
          0% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.85; }
          100% { transform: translate(-50%, -50%) scale(1.55); opacity: 0; }
        }
        .core-breathe-anim { animation: core-breathe 4.2s ease-in-out infinite; }
        .pulse-ring-anim { animation: pulse-ring-expand 3.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
      `}</style>

      {/* Canvas Radar & Orbit Sparks Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />

      {/* Center NOVA AI Sphere Emblem */}
      <div
        className="absolute cursor-pointer group"
        style={{
          left: '76%',
          top: '50%',
          transform: `translate3d(${parallax.x * 1.2}px, ${parallax.y * 1.2}px, 0)`,
        }}
      >
        {/* Expanding Pulse Ring */}
        <div className="pulse-ring-anim absolute -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full border border-[#00D9FF]/45 pointer-events-none" />

        {/* Core Glassmorphic Badge Sphere */}
        <div className="core-breathe-anim relative flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#00D9FF]/50 bg-[#04081c]/85 backdrop-blur-md shadow-[0_0_70px_rgba(0,217,255,0.65)] transition-transform duration-500 group-hover:scale-110">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#00D9FF]/30 via-[#8A2EFF]/30 to-transparent" />
          <span className="relative z-10 text-sm font-black tracking-widest text-white drop-shadow-[0_0_16px_rgba(0,217,255,0.95)] font-display">
            NOVA AI
          </span>
        </div>
      </div>
    </div>
  )
}
