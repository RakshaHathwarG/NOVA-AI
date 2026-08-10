import { useEffect, useRef } from 'react'

export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width, height, animationId
    let particles = []
    let time = 0

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const COLORS = [
      'rgba(176, 75, 240, 0.45)', // Purple/Magenta strand
      'rgba(0, 240, 255, 0.5)',   // Electric Cyan strand
      'rgba(109, 90, 230, 0.4)',  // Deep Indigo/Blue strand
      'rgba(255, 255, 255, 0.7)'  // Bright white/cyan highlights
    ]

    function resize() {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    function init() {
      particles = []
      const totalParticles = 2500 // Packed dense fluid strands
      
      for (let i = 0; i < totalParticles; i++) {
        const isLeftStream = Math.random() > 0.4 
        particles.push({
          isLeftStream,
          progress: Math.random(),
          speed: 0.001 + Math.random() * 0.0025,
          size: Math.random() * 1.2 + 0.3,
          seedY: Math.random() * Math.PI * 2,
          seedX: Math.random() * 20,
          track: Math.floor(Math.random() * 4),
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        })
      }
    }

    function drawScene() {
      time += 0.008
      
      // Clear with absolute deep cosmic black background
      ctx.fillStyle = '#020106'
      ctx.fillRect(0, 0, width, height)

      const hubX = width * 0.74
      const hubY = height * 0.52

      // Ambient Background Nebulas
      const leftGlow = ctx.createRadialGradient(width * 0.1, height * 0.5, 10, width * 0.1, height * 0.5, width * 0.3)
      leftGlow.addColorStop(0, 'rgba(176, 75, 240, 0.08)')
      leftGlow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = leftGlow
      ctx.fillRect(0, 0, width, height)

      const hubGlow = ctx.createRadialGradient(hubX, hubY, 20, hubX, hubY, width * 0.35)
      hubGlow.addColorStop(0, 'rgba(0, 240, 255, 0.12)')
      hubGlow.addColorStop(0.4, 'rgba(109, 90, 230, 0.04)')
      hubGlow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = hubGlow
      ctx.fillRect(0, 0, width, height)

      // Faint Concentric Background Rings
      ctx.strokeStyle = 'rgba(109, 90, 230, 0.08)'
      ctx.lineWidth = 0.5
      for (let r = 50; r <= 220; r += 35) {
        ctx.beginPath()
        ctx.arc(hubX, hubY, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Render Dense Particle Field
      particles.forEach((p) => {
        p.progress += p.speed
        if (p.progress > 1) p.progress = 0

        let x, y, alpha

        if (p.isLeftStream) {
          const startX = width * 0.05
          x = startX + (hubX - startX) * p.progress
          const trackY = height * (0.25 + p.track * 0.17)
          const baseY = trackY + (hubY - trackY) * Math.pow(p.progress, 1.5)
          const wave1 = Math.sin(p.progress * 5 - time * 2 + p.seedY) * (25 * (1 - p.progress))
          const wave2 = Math.cos(p.progress * 12 + p.seedY) * (8 * (1 - p.progress))
          y = baseY + wave1 + wave2
          alpha = p.progress < 0.1 ? p.progress * 10 : 1
        } else {
          x = hubX + (width - hubX) * p.progress
          const angle = ((p.track - 1.5) * 0.28) + (Math.sin(p.seedY) * 0.05)
          const spreadY = (x - hubX) * Math.tan(angle)
          const wave = Math.sin(p.progress * 8 - time * 3 + p.seedY) * (15 * p.progress)
          y = hubY + spreadY + wave
          alpha = 1 - p.progress
        }

        x += Math.sin(time + p.seedX) * 0.8
        y += Math.cos(time + p.seedX) * 0.8

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha * 0.6
        ctx.fill()
      })

      // Central Orb Assembly
      const coreGrad = ctx.createRadialGradient(hubX, hubY, 2, hubX, hubY, 32)
      coreGrad.addColorStop(0, '#ffffff')
      coreGrad.addColorStop(0.2, 'rgba(0, 240, 255, 0.9)')
      coreGrad.addColorStop(0.6, 'rgba(176, 75, 240, 0.4)')
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(hubX, hubY, 32, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.shadowColor = '#00F0FF'
      ctx.shadowBlur = 20 + Math.sin(time * 4) * 5
      ctx.fill()
      ctx.shadowBlur = 0

      if (!prefersReduced) animationId = requestAnimationFrame(drawScene)
    }

    resize()
    init()
    drawScene()

    function handleResize() {
      resize()
      init()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full -z-10 block ${className}`} 
      aria-hidden="true" 
    />
  )
}