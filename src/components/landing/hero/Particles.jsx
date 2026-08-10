import { useEffect, useRef } from 'react'

/**
 * Particles Component
 * Renders ambient cosmic starfield and floating light dust particles
 * with slow, calm motion and subtle parallax depth.
 */
export default function Particles({ parallax = { x: 0, y: 0 } }) {
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

    const displayW = window.innerWidth
    const displayH = window.innerHeight

    // Floating Dust Particles
    const count = 160
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * displayW,
      y: Math.random() * displayH,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      speedY: Math.random() * 0.12 + 0.03,
      speedX: (Math.random() - 0.5) * 0.08,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      color: Math.random() > 0.4 ? '255, 255, 255' : Math.random() > 0.5 ? '56, 189, 248' : '168, 85, 247',
      depth: Math.random() * 2 + 0.5,
    }))

    let time = 0
    let currentPX = 0
    let currentPY = 0

    const render = () => {
      time += 0.016
      const w = window.innerWidth
      const h = window.innerHeight

      currentPX += (parallax.x - currentPX) * 0.05
      currentPY += (parallax.y - currentPY) * 0.05

      ctx.clearRect(0, 0, w, h)

      particles.forEach((p) => {
        p.y -= p.speedY
        p.x += p.speedX

        if (p.y < 0) {
          p.y = h
          p.x = Math.random() * w
        }
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0

        p.twinklePhase += p.twinkleSpeed
        const currentAlpha = Math.max(0.1, Math.min(0.9, p.alpha + Math.sin(p.twinklePhase) * 0.25))

        const drawX = p.x + currentPX * (p.depth * 0.25)
        const drawY = p.y + currentPY * (p.depth * 0.25)

        ctx.beginPath()
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`

        if (p.radius > 1.2) {
          ctx.shadowColor = `rgba(${p.color}, 0.8)`
          ctx.shadowBlur = 8
        }
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [parallax])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  )
}
