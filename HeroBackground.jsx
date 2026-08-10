import { useEffect, useRef, useState } from 'react'
import { cn } from '../../../utils/cn'
import { User, Headphones, Mic, Globe, Sparkles } from 'lucide-react'
import NeuralStreamCanvas from './NeuralStreamCanvas'
import { CORE_POSITION, ASSISTANT_NODES } from './constants'

const ICONS = {
  hr: User,
  support: Headphones,
  voice: Mic,
  multilingual: Globe,
}

/**
 * Interactive NOVA AI Hero Background
 * Integrates 60FPS HTML5 Canvas neural stream rendering with HTML interactive nodes,
 * glassmorphic badges, pulse animations, and mouse parallax.
 */
export default function HeroBackground({ className = '' }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [activeNode, setActiveNode] = useState(null)
  const rafId = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMove = (event) => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 20
        const y = (event.clientY / window.innerHeight - 0.5) * 20
        setParallax({ x, y })
      })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030511]', className)} aria-hidden="true">
      <style>{`
        @keyframes core-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.95; }
          50% { transform: translate(-50%, -50%) scale(1.06); opacity: 1; }
        }
        @keyframes ring-expand {
          0% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        @keyframes node-float {
          0%, 100% { transform: translateY(-50%) translateX(0px); }
          50% { transform: translateY(-50%) translateX(4px); }
        }
        .core-pulse-effect { animation: core-pulse 4.5s ease-in-out infinite; }
        .ring-pulse { animation: ring-expand 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
      `}</style>

      {/* 60FPS Canvas Neural Stream Engine */}
      <NeuralStreamCanvas parallax={parallax} activeNode={activeNode} />

      {/* Left Side Persona Interactive Node Badges */}
      <div className="absolute inset-0 pointer-events-auto">
        {ASSISTANT_NODES.map((node) => {
          const Icon = ICONS[node.id] || Sparkles
          const isHovered = activeNode === node.id

          return (
            <div
              key={node.id}
              className="absolute flex items-center gap-3 transition-transform duration-300 ease-out cursor-pointer group"
              style={{
                left: '4.5%',
                top: `${node.top}%`,
                transform: `translateY(-50%) translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0)`,
              }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {/* Outer pulsing ring icon container */}
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-125"
                  style={{
                    backgroundColor: `${node.color}20`,
                    boxShadow: isHovered ? `0 0 24px ${node.color}` : `0 0 12px ${node.color}50`,
                  }}
                />
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#070d1e]/80 backdrop-blur-md transition-all duration-300 group-hover:border-white/50 group-hover:scale-110"
                  style={{
                    borderColor: isHovered ? node.color : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: isHovered ? `0 0 20px ${node.color}` : `0 0 10px ${node.color}30`,
                  }}
                >
                  <Icon size={16} color={node.color} strokeWidth={2} />
                </div>
              </div>

              {/* Node Title Label */}
              <div className="flex flex-col">
                <span
                  className="text-[11px] font-semibold tracking-wider transition-colors duration-300 group-hover:text-white"
                  style={{
                    color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                    textShadow: isHovered ? `0 0 10px ${node.color}` : 'none',
                  }}
                >
                  {node.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Central NOVA AI Orb Core Overlay */}
      <div
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          left: `${CORE_POSITION.left}%`,
          top: `${CORE_POSITION.top}%`,
        }}
      >
        {/* Animated Expanding Pulse Ring */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border border-cyan-400/40 ring-pulse pointer-events-none"
        />

        {/* NOVA AI Sphere Emblem */}
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/40 bg-[#030a1c]/70 backdrop-blur-md shadow-[0_0_50px_rgba(56,189,248,0.5)] transition-transform duration-500 group-hover:scale-110 core-pulse-effect"
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-transparent" />
          <span className="relative z-10 text-xs font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]">
            NOVA AI
          </span>
        </div>
      </div>
    </div>
  )
}