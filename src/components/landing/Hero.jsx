import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react'
import BackgroundEffects from './hero/BackgroundEffects'
import Particles from './hero/Particles'
import EnergyStreams from './hero/EnergyStreams'
import AINodes from './hero/AINodes'
import NovaCore from './hero/NovaCore'
import FeaturesBar from './hero/FeaturesBar'

/**
 * Award-Winning Senior Product Design Hero Experience for NOVA AI.
 * Implements a balanced 3-column architecture matching ElevenLabs / OpenAI standards:
 * - Left: 4 AI Service Nodes (HR Assistant, Customer Support, Voice AI, Multilingual AI)
 * - Center-Left: High-impact typography, subtext, and gradient action buttons
 * - Center-Right: Massive glowing NOVA AI Core & organic right-side neural network stream engine
 * - Below Hero: Floating glass Features Bar
 */
export default function Hero() {
  const navigate = useNavigate()
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [activeNode, setActiveNode] = useState(null)
  const rafId = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMove = (event) => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 18
        const y = (event.clientY / window.innerHeight - 0.5) * 18
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
    <div className="relative w-full overflow-hidden bg-[#020511]">
      <section className="relative min-h-[90vh] w-full flex items-center">
        {/* 1. Deep Space & Volumetric Nebula Background */}
        <BackgroundEffects parallax={parallax} />

        {/* 2. Floating Starfield & Cosmic Dust Particles */}
        <Particles parallax={parallax} />

        {/* 3. 60FPS Flowing Energy Streams & Right Neural Branching Network */}
        <EnergyStreams parallax={parallax} activeNode={activeNode} />

        {/* 4. Left Column: 4 AI Service Nodes */}
        <AINodes parallax={parallax} activeNode={activeNode} setActiveNode={setActiveNode} />

        {/* 5. Center-Right Column: Glowing NOVA AI Core Orb & Radar Circles */}
        <NovaCore parallax={parallax} />

        {/* 6. Center-Left Hero Content Column */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-6 py-24 pointer-events-none">
          <div className="max-w-2xl pl-2 md:pl-28 pointer-events-auto">
            
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-[#00D9FF] animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] uppercase font-display">
                NEXT-GENERATION VIRTUAL INTELLIGENCE
              </span>
            </motion.div>

            {/* Main Title Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-6 text-4xl font-extralight leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl font-display"
            >
              Intelligent
              <br />
              Virtual Personas
              <br />
              <span className="font-semibold bg-gradient-to-r from-[#8A2EFF] via-[#B16CFF] to-[#00D9FF] bg-clip-text text-transparent">
                Powered by NOVA Core.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-6 max-w-lg text-base font-light leading-relaxed text-slate-300/90 md:text-lg"
            >
              Experience seamless role-aware AI virtual assistants engineered for enterprise HR policy guidance and 24/7 customer support.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              {/* Primary Button */}
              <button
                onClick={() => navigate('/roles')}
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#8A2EFF] to-[#00D9FF] px-8 py-3.5 text-sm font-medium text-white shadow-[0_0_35px_rgba(0,217,255,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(138,46,255,0.6)]"
              >
                <span>Launch NOVA AI</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <PlayCircle size={16} />
                <span>Explore Platform</span>
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. Floating Enterprise Features Bar Below Hero */}
      <FeaturesBar />
    </div>
  )
}
