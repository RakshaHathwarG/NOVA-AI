import { useEffect, useRef } from 'react'

/**
 * High-definition 60FPS HTML5 Canvas engine for NOVA AI hero background.
 * Renders cosmic nebula, organic wave tendrils, particle flow streams,
 * concentric radar rings, and right radiating threads matching the reference design.
 */
export default function NeuralStreamCanvas({ parallax = { x: 0, y: 0 }, activeNode = null }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let dpr = window.devicePixelRatio || 1
    let width = canvas.width = window.innerWidth * dpr
    let height = canvas.height = window.innerHeight * dpr

    ctx.scale(dpr, dpr)

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1
      width = canvas.width = window.innerWidth * dpr
      height = canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', handleResize)

    const displayW = window.innerWidth
    const displayH = window.innerHeight

    // 4 Node definitions corresponding to design reference
    const nodesConfig = [
      { id: 'hr', yRatio: 0.22, color: '#c084fc', secondaryColor: '#e879f9', label: 'HR ASSISTANT' },
      { id: 'support', yRatio: 0.40, color: '#38bdf8', secondaryColor: '#60a5fa', label: 'CUSTOMER SUPPORT' },
      { id: 'voice', yRatio: 0.58, color: '#e879f9', secondaryColor: '#c084fc', label: 'VOICE AI' },
      { id: 'multilingual', yRatio: 0.76, color: '#2dd4bf', secondaryColor: '#38bdf8', label: 'MULTILINGUAL AI' },
    ]

    // Cosmic dust background stars
    const starCount = 140
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * displayW,
      y: Math.random() * displayH,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.2 + 0.05,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
      layer: Math.random() * 2 + 1,
    }))

    // Flowing particles along Bezier streams
    const streamParticleCount = 100
    const streamParticles = Array.from({ length: streamParticleCount }, (_, i) => ({
      nodeIndex: i % nodesConfig.length,
      progress: Math.random(),
      speed: Math.random() * 0.0035 + 0.002,
      size: Math.random() * 2.8 + 1.2,
      strandOffset: (Math.random() - 0.5) * 28,
      brightness: Math.random() * 0.4 + 0.6,
    }))

    // Core expanding pulse wave rings
    let pulseRings = [
      { radius: 45, opacity: 0.8 },
      { radius: 110, opacity: 0.5 },
      { radius: 170, opacity: 0.25 },
    ]

    let time = 0
    let currentPX = 0
    let currentPY = 0

    // Cubic Bezier interpolation helper
    const getCubicBezier = (p0, p1, p2, p3, t) => {
      const u = 1 - t
      const tt = t * t
      const uu = u * u
      const uuu = uu * u
      const ttt = tt * t

      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
      }
    }

    const render = () => {
      time += 0.016
      const w = window.innerWidth
      const h = window.innerHeight

      // Smooth lerp parallax
      currentPX += (parallax.x - currentPX) * 0.08
      currentPY += (parallax.y - currentPY) * 0.08

      ctx.clearRect(0, 0, w, h)

      // 1. Deep Cosmic Backdrop
      ctx.fillStyle = '#030511'
      ctx.fillRect(0, 0, w, h)

      // 2. Rich Ambient Cosmic Nebula Radial Gradients
      const coreX = w * 0.76 + currentPX * 1.5
      const coreY = h * 0.5 + currentPY * 1.5

      // Core Vibrant Cyan / Violet Atmosphere Glow
      const coreGlow = ctx.createRadialGradient(coreX, coreY, 20, coreX, coreY, w * 0.5)
      coreGlow.addColorStop(0, 'rgba(14, 165, 233, 0.42)')
      coreGlow.addColorStop(0.25, 'rgba(147, 51, 234, 0.22)')
      coreGlow.addColorStop(0.6, 'rgba(79, 70, 229, 0.08)')
      coreGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGlow
      ctx.fillRect(0, 0, w, h)

      // Left Streams Deep Purple Glow
      const leftGlow = ctx.createRadialGradient(w * 0.22 + currentPX, h * 0.5 + currentPY, 30, w * 0.22, h * 0.5, w * 0.45)
      leftGlow.addColorStop(0, 'rgba(168, 85, 247, 0.28)')
      leftGlow.addColorStop(0.55, 'rgba(99, 102, 241, 0.12)')
      leftGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = leftGlow
      ctx.fillRect(0, 0, w, h)

      // 3. Twinkling Star Dust
      stars.forEach((star) => {
        star.y -= star.speed
        if (star.y < 0) {
          star.y = h
          star.x = Math.random() * w
        }
        const currentAlpha = Math.max(0.15, Math.min(0.95, star.alpha + Math.sin(time * 2.5 + star.x) * star.twinkleSpeed))

        ctx.beginPath()
        ctx.arc(
          star.x + currentPX * (star.layer * 0.25),
          star.y + currentPY * (star.layer * 0.25),
          star.radius,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
        ctx.fill()
      })

      // 4. Compute Stream Bezier Control Paths (Left Persona Nodes to Core)
      const startX = w * 0.06 + currentPX * 0.5
      const neckX = w * 0.45 + currentPX * 0.8
      const neckY = h * 0.5 + currentPY * 0.8

      const paths = nodesConfig.map((node, idx) => {
        const startY = h * node.yRatio + currentPY * 0.5
        const wave1 = Math.sin(time * 1.6 + idx * 1.2) * 40
        const wave2 = Math.cos(time * 1.3 + idx * 1.8) * 30

        const p0 = { x: startX, y: startY }
        const p1 = { x: w * 0.22, y: startY + wave1 }
        const p2 = { x: neckX - 70, y: neckY + wave2 }
        const p3 = { x: coreX - 45, y: coreY + (idx - 1.5) * 10 }

        return { node, p0, p1, p2, p3 }
      })

      // 5. Draw Glowing Neural Bezier Wave Tendril Strands
      paths.forEach(({ node, p0, p1, p2, p3 }, idx) => {
        const isHovered = activeNode === node.id
        const strandCount = isHovered ? 7 : 5

        for (let s = 0; s < strandCount; s++) {
          const sOffset = (s - (strandCount - 1) / 2) * 7.5
          const sWave = Math.sin(time * 2.2 + s + idx) * 10

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y + sOffset)
          ctx.bezierCurveTo(
            p1.x,
            p1.y + sOffset + sWave,
            p2.x,
            p2.y + sOffset * 0.35 - sWave,
            p3.x,
            p3.y
          )

          const grad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y)
          grad.addColorStop(0, node.color)
          grad.addColorStop(0.6, node.secondaryColor)
          grad.addColorStop(1, '#38bdf8')

          const strokeAlpha = isHovered ? 0.85 : Math.max(0.2, 0.55 - Math.abs(sOffset) * 0.04)
          ctx.strokeStyle = grad
          ctx.lineWidth = isHovered ? 3.5 : Math.max(1.2, 2.6 - Math.abs(sOffset) * 0.2)
          ctx.globalAlpha = strokeAlpha
          ctx.shadowColor = node.color
          ctx.shadowBlur = isHovered ? 24 : 12
          ctx.stroke()
          ctx.shadowBlur = 0
          ctx.globalAlpha = 1.0
        }
      })

      // 6. Draw Stream Particle Packets
      streamParticles.forEach((particle) => {
        particle.progress += particle.speed
        if (particle.progress >= 1) {
          particle.progress = 0
          particle.strandOffset = (Math.random() - 0.5) * 28
        }

        const pathData = paths[particle.nodeIndex]
        if (!pathData) return

        const point = getCubicBezier(pathData.p0, pathData.p1, pathData.p2, pathData.p3, particle.progress)
        const nextPoint = getCubicBezier(pathData.p0, pathData.p1, pathData.p2, pathData.p3, Math.min(1, particle.progress + 0.015))
        const dx = nextPoint.x - point.x
        const dy = nextPoint.y - point.y
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy / len
        const ny = dx / len

        const finalX = point.x + nx * particle.strandOffset
        const finalY = point.y + ny * particle.strandOffset

        // Particle glowing tail
        const trailPoint = getCubicBezier(pathData.p0, pathData.p1, pathData.p2, pathData.p3, Math.max(0, particle.progress - 0.04))
        
        ctx.beginPath()
        ctx.moveTo(finalX, finalY)
        ctx.lineTo(trailPoint.x + nx * particle.strandOffset, trailPoint.y + ny * particle.strandOffset)
        ctx.strokeStyle = pathData.node.color
        ctx.lineWidth = particle.size * 1.2
        ctx.globalAlpha = (1 - Math.pow(particle.progress - 0.5, 2) * 2.8) * particle.brightness
        ctx.shadowColor = pathData.node.color
        ctx.shadowBlur = 14
        ctx.stroke()

        // Particle glowing head
        ctx.beginPath()
        ctx.arc(finalX, finalY, particle.size * 1.1, 0, Math.PI * 2)
        ctx.fillStyle = particle.progress > 0.65 ? '#e0f2fe' : pathData.node.color
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1.0
      })

      // 7. Radiating Output Threads to the Right of Core
      const rightThreadCount = 18
      for (let i = 0; i < rightThreadCount; i++) {
        const angle = (i / (rightThreadCount - 1) - 0.5) * Math.PI * 0.8
        const endX = w * 1.08
        const endY = coreY + Math.tan(angle) * (endX - coreX)
        const midX = coreX + (endX - coreX) * 0.42
        const wave = Math.sin(time * 2.4 + i) * 22

        ctx.beginPath()
        ctx.moveTo(coreX, coreY)
        ctx.quadraticCurveTo(midX, coreY + wave + Math.tan(angle) * 140, endX, endY)
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.55)' : 'rgba(168, 85, 247, 0.45)'
        ctx.lineWidth = 1.6
        ctx.shadowColor = '#38bdf8'
        ctx.shadowBlur = 8
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // 8. Concentric Target Radar Rings Around Core
      // Rotating Dashed Outer Circle
      ctx.save()
      ctx.translate(coreX, coreY)
      ctx.rotate(time * 0.25)
      ctx.beginPath()
      ctx.arc(0, 0, 155, 0, Math.PI * 2)
      ctx.setLineDash([10, 18])
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)'
      ctx.lineWidth = 1.8
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Inner Ticked Radar Circle
      ctx.save()
      ctx.translate(coreX, coreY)
      ctx.rotate(-time * 0.18)
      ctx.beginPath()
      ctx.arc(0, 0, 105, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      for (let a = 0; a < 360; a += 15) {
        const rad = (a * Math.PI) / 180
        const innerR = 98
        const outerR = a % 45 === 0 ? 112 : 104
        ctx.beginPath()
        ctx.moveTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR)
        ctx.lineTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR)
        ctx.strokeStyle = a % 45 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = a % 45 === 0 ? 1.8 : 0.9
        ctx.stroke()
      }
      ctx.restore()

      // Expanding Pulse Wave Rings
      pulseRings.forEach((ring) => {
        ring.radius += 0.7
        ring.opacity -= 0.003
        if (ring.radius > 240 || ring.opacity <= 0) {
          ring.radius = 45
          ring.opacity = 0.8
        }

        ctx.beginPath()
        ctx.arc(coreX, coreY, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(56, 189, 248, ${ring.opacity * 0.5})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      })

      // 9. Core Glowing Sphere Atmosphere
      const coreOrbGlow = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, 75)
      coreOrbGlow.addColorStop(0, '#ffffff')
      coreOrbGlow.addColorStop(0.25, '#38bdf8')
      coreOrbGlow.addColorStop(0.65, '#818cf8')
      coreOrbGlow.addColorStop(1, 'rgba(147, 51, 234, 0.15)')

      ctx.beginPath()
      ctx.arc(coreX, coreY, 52, 0, Math.PI * 2)
      ctx.fillStyle = coreOrbGlow
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 40
      ctx.fill()
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [parallax, activeNode])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full pointer-events-none"
    />
  )
}
