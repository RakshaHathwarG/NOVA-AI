import { useNavigate } from 'react-router-dom'
import { User, Headphones, Mic, Globe, Sparkles } from 'lucide-react'

const ICONS = { hr: User, support: Headphones, voice: Mic, multilingual: Globe }
const NODES_DATA = [
  { id: 'hr', title: 'ARIA · HR ASSISTANT', subtitle: 'Open HR conversation', top: 22, to: '/assistant/hr', color: '#8A2EFF', glowColor: 'rgba(138, 46, 255, 0.7)' },
  { id: 'support', title: 'SNOW · CUSTOMER SUPPORT', subtitle: 'Open support conversation', top: 40, to: '/assistant/support', color: '#00D9FF', glowColor: 'rgba(0, 217, 255, 0.7)' },
  { id: 'voice', title: 'BROWSER VOICE', subtitle: 'Configure device voice controls', top: 58, to: '/settings?tab=voice', color: '#B16CFF', glowColor: 'rgba(177, 108, 255, 0.7)' },
  { id: 'multilingual', title: 'LANGUAGE TEMPLATES', subtitle: 'Configure a chat language', top: 76, to: '/settings?tab=voice', color: '#38BDF8', glowColor: 'rgba(56, 189, 248, 0.7)' },
]

export default function AINodes({ parallax = { x: 0, y: 0 }, activeNode, setActiveNode }) {
  const navigate = useNavigate()
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
      <style>{`@keyframes node-pulse-slow { 0%, 100% { transform: scale(1); box-shadow: 0 0 16px var(--node-glow); } 50% { transform: scale(1.04); box-shadow: 0 0 26px var(--node-glow); } } .node-circle-pulse { animation: node-pulse-slow 4.2s ease-in-out infinite; }`}</style>
      {NODES_DATA.map((node) => {
        const Icon = ICONS[node.id] || Sparkles
        const isHovered = activeNode === node.id
        return (
          <button
            key={node.id}
            type="button"
            aria-label={`${node.title}: ${node.subtitle}`}
            onClick={() => navigate(node.to)}
            onFocus={() => setActiveNode(node.id)}
            onBlur={() => setActiveNode(null)}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
            className="group pointer-events-auto absolute flex cursor-pointer items-center gap-4 border-0 bg-transparent p-0 text-left transition-transform duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            style={{ left: '4.5%', top: `${node.top}%`, transform: `translateY(-50%) translate3d(${parallax.x * 0.35}px, ${parallax.y * 0.35}px, 0)`, '--node-glow': node.glowColor }}
          >
            <span className="relative flex items-center justify-center">
              <span className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-150" style={{ backgroundColor: `${node.color}25`, boxShadow: isHovered ? `0 0 40px ${node.color}` : `0 0 18px ${node.color}40` }} />
              <span className="node-circle-pulse relative flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#060814]/90 backdrop-blur-md transition-all duration-300 group-hover:scale-110" style={{ borderColor: isHovered ? node.color : 'rgba(255, 255, 255, 0.25)', boxShadow: isHovered ? `0 0 30px ${node.color}` : `0 0 16px ${node.color}50` }}>
                <Icon size={19} color={node.color} strokeWidth={2} />
              </span>
            </span>
            <span className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] transition-colors group-hover:text-white" style={{ color: isHovered ? '#fff' : 'rgba(255,255,255,.85)', textShadow: isHovered ? `0 0 16px ${node.color}` : 'none' }}>{node.title}</span>
              <span className="text-[11px] text-slate-400/90 transition-colors group-hover:text-slate-200">{node.subtitle}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
