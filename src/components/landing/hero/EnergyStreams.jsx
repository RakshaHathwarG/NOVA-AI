import { useEffect, useRef } from 'react'

/**
 * EnergyStreams Component
 * Renders 60FPS organic flowing energy streams from left service nodes
 * converging into the central core, and branching outward into an intricate
 * neural network tree on the right side fading into deep space space nebula.
 */
export default function EnergyStreams({ parallax = { x: 0, y: 0 }, activeNode = null }) {
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

    // Left Node Configurations
    const nodesConfig = [
      { id: 'hr', yRatio: 0.22, color: '#8A2EFF', glow: 'rgba(138, 46, 255, 0.9)' },
      { id: 'support', yRatio: 0.40, color: '#00D9FF', glow: 'rgba(0, 217, 255, 0.9)' },
      { id: 'voice', yRatio: 0.58, color: '#B16CFF', glow: 'rgba(177, 108, 255, 0.9)' },
      { id: 'multilingual', yRatio: 0.76, color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.9)' },
    ]

    // Flowing Particles
    const particleCount = 120
    const streamParticles = Array.from({ length: particleCount }, (_, i) => ({
      nodeIndex: i % nodesConfig.length,
      progress: Math.random(),
      speed: Math.random() * 0.0026 + 0.0016,
      size: Math.random() * 2.8 + 1.2,
      strandOffset: (Math.random() - 0.5) * 34,
      brightness: Math.random() * 0.5 + 0.5,
    }))

    // Precompute Right Neural Network Branch Tree Nodes
    const branchCount = 38
    const rightNeuralBranches = Array.from({ length: branchCount }, (_, i) => {
      const angle = (i / (branchCount - 1) - 0.5) * Math.PI * 0.85
      const length = 280 + Math.random() * 320
      const curve = (Math.random() - 0.5) * 160
      const subBranches = Array.from({ length: 3 }, () => ({
        subAngle: angle + (Math.random() - 0.5) * 0.4,
        subLen: Math.random() * 120 + 60,
      }))
      return { angle, length, curve, subBranches, color: i % 2 === 0 ? '#00D9FF' : '#8A2EFF' }
    })

    let time = 0
    let currentPX = 0
    let currentPY = 0

    // Cubic Bezier Helper
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
      time += 0.014
      const w = window.innerWidth
      const h = window.innerHeight

      currentPX += (parallax.x - currentPX) * 0.06
      currentPY += (parallax.y - currentPY) * 0.06

      ctx.clearRect(0, 0, w, h)

      const startX = w * 0.06 + currentPX * 0.4
      const neckX = w * 0.46 + currentPX * 0.7
      const neckY = h * 0.5 + currentPY * 0.7
      const coreX = w * 0.76 + currentPX * 1.2
      const coreY = h * 0.5 + currentPY * 1.2

      // 1. Calculate Primary Left Stream Bezier Control Paths
      const paths = nodesConfig.map((node, idx) => {
        const startY = h * node.yRatio + currentPY * 0.4
        const wave1 = Math.sin(time * 1.3 + idx * 1.4) * 45
        const wave2 = Math.cos(time * 1.0 + idx * 1.9) * 35

        const p0 = { x: startX, y: startY }
        const p1 = { x: w * 0.22, y: startY + wave1 }
        const p2 = { x: neckX - 80, y: neckY + wave2 }
        const p3 = { x: coreX - 50, y: coreY + (idx - 1.5) * 12 }

        return { node, p0, p1, p2, p3 }
      })

      // 2. Draw Organic Flowing Energy Stream Strands (Left to Core)
      paths.forEach(({ node, p0, p1, p2, p3 }, idx) => {
        const isHovered = activeNode === node.id
        const strandCount = isHovered ? 9 : 6

        for (let s = 0; s < strandCount; s++) {
          const sOffset = (s - (strandCount - 1) / 2) * 8.5
          const sWave = Math.sin(time * 1.8 + s + idx) * 12

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
          grad.addColorStop(0.5, idx % 2 === 0 ? '#8A2EFF' : '#00D9FF')
          grad.addColorStop(1, '#00D9FF')

          const strokeAlpha = isHovered ? 0.95 : Math.max(0.2, 0.6 - Math.abs(sOffset) * 0.04)
          ctx.strokeStyle = grad
          ctx.lineWidth = isHovered ? 4.0 : Math.max(1.2, 2.8 - Math.abs(sOffset) * 0.22)
          ctx.globalAlpha = strokeAlpha
          ctx.shadowColor = node.color
          ctx.shadowBlur = isHovered ? 28 : 14
          ctx.stroke()
          ctx.shadowBlur = 0
          ctx.globalAlpha = 1.0
        }
      })

      // 3. Draw Stream Flow Particles & Trails
      streamParticles.forEach((particle) => {
        particle.progress += particle.speed
        if (particle.progress >= 1) {
          particle.progress = 0
          particle.strandOffset = (Math.random() - 0.5) * 34
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

        const trailPoint = getCubicBezier(pathData.p0, pathData.p1, pathData.p2, pathData.p3, Math.max(0, particle.progress - 0.045))
        
        ctx.beginPath()
        ctx.moveTo(finalX, finalY)
        ctx.lineTo(trailPoint.x + nx * particle.strandOffset, trailPoint.y + ny * particle.strandOffset)
        ctx.strokeStyle = pathData.node.color
        ctx.lineWidth = particle.size * 1.2
        ctx.globalAlpha = (1 - Math.pow(particle.progress - 0.5, 2) * 2.5) * particle.brightness
        ctx.shadowColor = pathData.node.color
        ctx.shadowBlur = 16
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(finalX, finalY, particle.size * 1.1, 0, Math.PI * 2)
        ctx.fillStyle = particle.progress > 0.7 ? '#ffffff' : pathData.node.color
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1.0
      })

      // 4. Draw Right Neural Network Branching Tree (From Core Orb to Right Side)
      rightNeuralBranches.forEach((branch, bIdx) => {
        const endX = coreX + Math.cos(branch.angle) * branch.length
        const endY = coreY + Math.sin(branch.angle) * branch.length
        const wave = Math.sin(time * 1.6 + bIdx) * branch.curve

        ctx.beginPath()
        ctx.moveTo(coreX, coreY)
        ctx.quadraticCurveTo(coreX + (endX - coreX) * 0.5, coreY + wave, endX, endY)

        const branchGrad = ctx.createLinearGradient(coreX, coreY, endX, endY)
        branchGrad.addColorStop(0, 'rgba(0, 217, 255, 0.85)')
        branchGrad.addColorStop(0.5, branch.color)
        branchGrad.addColorStop(1, 'transparent')

        ctx.strokeStyle = branchGrad
        ctx.lineWidth = Math.max(0.8, 2.2 - bIdx * 0.03)
        ctx.shadowColor = branch.color
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0

        // Sub-branches
        branch.subBranches.forEach((sub, sIdx) => {
          const subX = endX + Math.cos(sub.subAngle) * sub.subLen
          const subY = endY + Math.sin(sub.subAngle) * sub.subLen

          ctx.beginPath()
          ctx.moveTo(endX, endY)
          ctx.lineTo(subX, subY)
          ctx.strokeStyle = `rgba(0, 217, 255, ${Math.max(0.05, 0.4 - sIdx * 0.1)})`
          ctx.lineWidth = 0.9
          ctx.stroke()

          // Neural Node Spark Dots at Endpoints
          ctx.beginPath()
          ctx.arc(subX, subY, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = '#00D9FF'
          ctx.shadowColor = '#00D9FF'
          ctx.shadowBlur = 8
          ctx.fill()
          ctx.shadowBlur = 0
        })
      })

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
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  )
}
