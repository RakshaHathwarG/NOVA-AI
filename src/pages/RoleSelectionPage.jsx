import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Headset, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'

import ariaImg from '../assets/avatars/hr_avatar_nova.png'
import snowImg from '../assets/avatars/snow_avatar.png'

const ROLES = [
  {
    id: 'hr',
    name: 'HR Assistant',
    persona: 'ARIA',
    tagline: 'Senior HR Assistant',
    description: 'Professional AI-powered HR assistant for recruitment, interviews, employee policies, payroll, leave management, attendance, benefits, and workplace guidance.',
    accent: 'purple',
    path: '/assistant/hr',
    image: ariaImg,
    icon: Briefcase,
    capabilities: ['HR Policies & Procedures', 'Recruitment & Onboarding', 'Leave Management', 'Employee Guidelines', 'Payroll Queries', 'Training Modules'],
    languages: ['English', 'Hindi', 'Japanese', 'Korean'],
  },
  {
    id: 'support',
    name: 'Customer Support',
    persona: 'SNOW',
    tagline: 'Customer Support Assistant',
    description: 'Friendly AI-powered support assistant for products, services, FAQs, complaints, order tracking, and general customer assistance.',
    accent: 'cyan',
    path: '/assistant/support',
    image: snowImg,
    icon: Headset,
    capabilities: ['Customer Queries', 'Order Assistance', 'Complaint Resolution', 'Product Information', 'Returns & Refunds', 'General Support'],
    languages: ['English', 'Hindi', 'Japanese', 'Spanish'],
  },
]

function accentClasses(accent) {
  if (accent === 'purple') return {
    border: 'border-nova-purple/30',
    bg: 'bg-nova-purple/[0.06]',
    hoverBorder: 'hover:border-nova-purple/50',
    imgBorder: 'border-nova-purple/30',
    iconBg: 'bg-nova-purple/10 border-nova-purple/30',
    iconColor: 'text-nova-purple',
    nameColor: 'text-nova-purple',
    check: 'text-nova-purple',
    tag: 'bg-nova-purple/15 border-nova-purple/25 text-nova-purple',
    btn: 'bg-nova-purple hover:bg-nova-purple/80 text-white',
    glow: 'hover:shadow-[0_0_40px_-8px_rgba(176,75,240,0.4)]',
    dot: 'shadow-[0_0_8px_rgba(176,75,240,0.6)] bg-nova-purple',
  }
  return {
    border: 'border-nova-cyan/30',
    bg: 'bg-nova-cyan/[0.06]',
    hoverBorder: 'hover:border-nova-cyan/50',
    imgBorder: 'border-nova-cyan/30',
    iconBg: 'bg-nova-cyan/10 border-nova-cyan/30',
    iconColor: 'text-nova-cyan',
    nameColor: 'text-nova-cyan',
    check: 'text-nova-cyan',
    tag: 'bg-nova-cyan/15 border-nova-cyan/25 text-nova-cyan',
    btn: 'bg-nova-cyan hover:bg-nova-cyan/80 text-[#0a0a1a]',
    glow: 'hover:shadow-[0_0_40px_-8px_rgba(63,224,208,0.4)]',
    dot: 'shadow-[0_0_8px_rgba(63,224,208,0.6)] bg-nova-cyan',
  }
}

export default function RoleSelectionPage() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex flex-col gap-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-ink-faint backdrop-blur-sm mb-4">
              <Sparkles size={11} className="text-nova-cyan" />
              Choose your persona
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Who do you need today?</h1>
            <p className="mt-2 text-ink-muted max-w-lg">
              Each NOVA persona is trained on a distinct knowledge domain. Pick an assistant to begin your session.
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {ROLES.map((role, i) => {
              const c = accentClasses(role.accent)
              const Icon = role.icon

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`rounded-2xl border ${c.border} ${c.bg} ${c.hoverBorder} ${c.glow} p-6 flex flex-col gap-5 transition-all duration-300 cursor-pointer group`}
                  onClick={() => navigate(role.path)}
                >
                  {/* Top: image + info */}
                  <div className="flex gap-5">
                    {/* Avatar image */}
                    <div className={`relative shrink-0 w-36 h-44 rounded-xl overflow-hidden border ${c.imgBorder}`}>
                      <img
                        src={role.image}
                        alt={role.persona}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Online dot */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2 py-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                        <span className="text-[9px] text-white font-medium">Online</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 mb-1`}>
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${c.iconBg}`}>
                          <Icon size={13} className={c.iconColor} />
                        </div>
                        <span className={`text-[11px] font-medium ${c.iconColor}`}>{role.name}</span>
                      </div>
                      <h2 className={`text-2xl font-bold ${c.nameColor}`}>{role.persona}</h2>
                      <p className="text-sm text-ink-muted mb-3">{role.tagline}</p>
                      <p className="text-xs text-ink-faint leading-relaxed">{role.description}</p>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-faint mb-2">Capabilities</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {role.capabilities.map((cap) => (
                        <div key={cap} className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <CheckCircle2 size={11} className={c.check} />
                          {cap}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-faint mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.languages.map((l) => (
                        <span key={l} className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${c.tag}`}>{l}</span>
                      ))}
                    </div>
                  </div>

                  {/* Status + Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </span>
                      <span className="text-xs font-medium text-emerald-400">Ready</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(role.path) }}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${c.btn} group-hover:gap-3`}
                    >
                      Launch Assistant <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>
      </PageTransition>
    </AppLayout>
  )
}
