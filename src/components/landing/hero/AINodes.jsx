import { User, Headphones, Mic, Globe, Sparkles } from 'lucide-react'

const ICONS = {
  hr: User,
  support: Headphones,
  voice: Mic,
  multilingual: Globe,
}

const NODES_DATA = [
  { id: 'hr', title: 'HR ASSISTANT', subtitle: 'Smart HR Insights', top: 22, color: '#8A2EFF', glowColor: 'rgba(138, 46, 255, 0.7)' },
  { id: 'support', title: 'CUSTOMER SUPPORT', subtitle: '24/7 Intelligent Helpdesk', top: 40, color: '#00D9FF', glowColor: 'rgba(0, 217, 255, 0.7)' },
  { id: 'voice', title: 'VOICE AI', subtitle: 'Natural Voice Interactions', top: 58, color: '#B16CFF', glowColor: 'rgba(177, 108, 255, 0.7)' },
  { id: 'multilingual', title: 'MULTILINGUAL AI', subtitle: 'Break Language Barriers', top: 76, color: '#38BDF8', glowColor: 'rgba(56, 189, 248, 0.7)' },
]

/**
 * AINodes Component
 * Renders the 4 left AI service nodes with title, subtitle, glowing circular icon badges,
 * hover pulse states, and connecting energy stream triggers matching the mockup image.
 */
export default function AINodes({ parallax = { x: 0, y: 0 }, activeNode, setActiveNode }) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-20 hidden lg:block">
      <style>{`
        @keyframes node-pulse-slow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px var(--node-glow); }
          50% { transform: scale(1.08); box-shadow: 0 0 28px var(--node-glow); }
        }
        .node-circle-pulse { animation: node-pulse-slow 4.2s ease-in-out infinite; }
      `}</style>

      {NODES_DATA.map((node) => {
        const Icon = ICONS[node.id] || Sparkles
        const isHovered = activeNode === node.id

        return (
          <div
            key={node.id}
            className="group absolute flex items-center gap-4 cursor-pointer transition-transform duration-300 ease-out"
            style={{
              left: '4.5%',
              top: `${node.top}%`,
              transform: `translateY(-50%) translate3d(${parallax.x * 0.35}px, ${parallax.y * 0.35}px, 0)`,
              '--node-glow': node.glowColor,
            }}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Glowing Circular Icon Wrapper */}
            <div className="relative flex items-center justify-center">
              {/* Outer Glow Halo */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-150"
                style={{
                  backgroundColor: `${node.color}25`,
                  boxShadow: isHovered ? `0 0 40px ${node.color}` : `0 0 18px ${node.color}40`,
                }}
              />

              {/* Glassmorphic Icon Badge */}
              <div
                className="node-circle-pulse relative flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#060814]/90 backdrop-blur-md transition-all duration-300 group-hover:border-white/70 group-hover:scale-110"
                style={{
                  borderColor: isHovered ? node.color : 'rgba(255, 255, 255, 0.25)',
                  boxShadow: isHovered ? `0 0 30px ${node.color}` : `0 0 16px ${node.color}50`,
                }}
              >
                <Icon size={19} color={node.color} strokeWidth={2} />
              </div>
            </div>

            {/* Service Title & Subtitle */}
            <div className="flex flex-col">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-white"
                style={{
                  color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                  textShadow: isHovered ? `0 0 16px ${node.color}` : 'none',
                }}
              >
                {node.title}
              </span>
              <span className="text-[11px] font-light text-slate-400/90 group-hover:text-slate-200 transition-colors">
                {node.subtitle}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
