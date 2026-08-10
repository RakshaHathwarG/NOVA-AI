import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Bot, Mic, Globe, User, CheckCircle2, ArrowUpRight,
  Mic2, Globe2, Bell, ChevronRight, Cpu, Activity
} from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'
import { useAuth } from '../context/AuthContext'

import ariaImg from '../assets/avatars/anime_hr_avatar.png'
import snowImg from '../assets/avatars/anime_snow_avatar.png'

// ── System Status ───────────────────────────────────────────────────────────
const STATUS_ITEMS = [
  { label: 'AI Engine', status: 'Ready' },
  { label: 'Voice Engine', status: 'Ready' },
  { label: 'Avatar Engine', status: 'Ready' },
  { label: 'Language Model', status: 'Active', accent: true },
]

// ── Top Feature Cards ───────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    icon: Bot,
    title: 'AI Assistants',
    value: '2',
    sub: 'Virtual Assistants',
    badge: 'Ready ✓',
    badgeColor: 'emerald',
    items: null,
    accent: 'purple',
  },
  {
    icon: Mic,
    title: 'Voice Interaction',
    value: null,
    sub: null,
    badge: '+ Enabled',
    badgeColor: 'cyan',
    items: ['Speech Recognition', 'Text To Speech', 'Real-time Voice'],
    accent: 'cyan',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    value: null,
    sub: null,
    badge: 'Available',
    badgeColor: 'emerald',
    items: ['English', 'Hindi', 'Japanese', 'Korean', 'Spanish'],
    accent: 'indigo',
  },
  {
    icon: User,
    title: 'Digital Avatar',
    value: null,
    sub: null,
    badge: 'Operational',
    badgeColor: 'emerald',
    items: ['Animated Avatar', 'Lip Sync', 'Expressions'],
    accent: 'purple',
  },
]

// ── Quick Actions ───────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Launch HR Assistant', hint: 'Talk to Aria', path: '/assistant/hr', icon: Bot, accent: 'purple' },
  { label: 'Launch Customer Support', hint: 'Talk to Snow', path: '/assistant/support', icon: Mic2, accent: 'cyan' },
  { label: 'Voice Settings', hint: 'Configure voice', path: '/settings', icon: Mic, accent: 'cyan' },
  { label: 'Language Settings', hint: 'Manage languages', path: '/settings', icon: Globe2, accent: 'purple' },
]

// ── Language Flags ──────────────────────────────────────────────────────────
const LANGS = [
  { flag: '🇺🇸', name: 'English' },
  { flag: '🇮🇳', name: 'Hindi' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇰🇷', name: 'Korean' },
  { flag: '🇪🇸', name: 'Spanish' },
]

const VOICE_CAPS = [
  ['Speech Recognition', 'Real-Time Conversation'],
  ['Text To Speech', 'Multilingual Voice'],
  ['Natural Voice Output', ''],
]

const TECH = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Vite', color: '#BD34FE' },
  { name: 'Three.js', color: '#ffffff' },
  { name: 'Tailwind CSS', color: '#38BDF8' },
  { name: 'Node.js', color: '#68A063' },
  { name: 'MongoDB', color: '#4DB33D' },
  { name: 'Express', color: '#888' },
]

// ── Accent helpers ──────────────────────────────────────────────────────────
function accentClass(accent, type = 'text') {
  const map = {
    purple: { text: 'text-nova-purple', bg: 'bg-nova-purple/10', border: 'border-nova-purple/30', glow: 'shadow-[0_0_20px_-4px_rgba(176,75,240,0.5)]' },
    cyan: { text: 'text-nova-cyan', bg: 'bg-nova-cyan/10', border: 'border-nova-cyan/30', glow: 'shadow-[0_0_20px_-4px_rgba(63,224,208,0.5)]' },
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', glow: 'shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)]' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: '' },
  }
  return map[accent]?.[type] ?? ''
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex flex-col gap-6">

          {/* ── Top Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, <span className="text-nova-purple">{firstName}!</span> 👋
              </h1>
              <p className="mt-1 text-sm font-medium text-ink-muted">NOVA AI Control Center</p>
              <p className="mt-1 max-w-md text-sm text-ink-faint leading-relaxed">
                Your AI assistants are online and ready, {firstName}. Launch a session or monitor activity below.
              </p>
            </motion.div>

            {/* System Status panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 min-w-[240px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-white">System Status</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              </div>
              <div className="space-y-2">
                {STATUS_ITEMS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <Activity size={12} className="text-ink-faint" />
                      {s.label}
                    </div>
                    <span className={`text-xs font-semibold ${s.accent ? 'text-nova-cyan' : 'text-emerald-400'}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── 4 Feature Cards ────────────────────────────────────────── */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {FEATURE_CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={`rounded-2xl border ${accentClass(card.accent, 'border')} ${accentClass(card.accent, 'bg')} p-5 flex flex-col gap-3 backdrop-blur-sm`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accentClass(card.accent, 'border')} bg-black/20`}>
                    <Icon size={20} className={accentClass(card.accent, 'text')} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    {card.value && (
                      <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                    )}
                    {card.sub && <p className="text-xs text-ink-muted">{card.sub}</p>}
                    {card.items && (
                      <ul className="mt-2 space-y-1">
                        {card.items.map((it) => (
                          <li key={it} className="flex items-center gap-1.5 text-xs text-ink-muted">
                            <CheckCircle2 size={11} className={accentClass(card.accent, 'text')} />
                            {it}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-auto">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium
                      ${card.badgeColor === 'cyan' ? 'border-nova-cyan/30 text-nova-cyan bg-nova-cyan/10' : card.badgeColor === 'emerald' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-nova-purple/30 text-nova-purple bg-nova-purple/10'}`}>
                      {card.badge}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── AI Assistants + Quick Actions ──────────────────────────── */}
          <div className="grid gap-5 xl:grid-cols-[1fr_320px]">

            {/* Assistants Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
            >
              <p className="text-sm font-semibold text-white mb-4">AI Assistants</p>
              <div className="grid gap-4 sm:grid-cols-2">

                {/* ARIA */}
                <div className="rounded-xl border border-nova-purple/25 bg-nova-purple/[0.05] p-4 flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="relative shrink-0 w-20 h-24 rounded-xl overflow-hidden border border-nova-purple/30">
                      <img src={ariaImg} alt="Aria" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-nova-purple">ARIA</p>
                      <p className="text-xs text-ink-muted mb-2">Senior HR Assistant</p>
                      <ul className="space-y-0.5">
                        {['HR Policies', 'Leave Management', 'Employee Guidelines', 'Recruitment Queries'].map((t) => (
                          <li key={t} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                            <CheckCircle2 size={10} className="text-nova-purple shrink-0" />{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint mb-1">Languages</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {['English', 'Hindi', 'Japanese', 'Korean', 'Spanish'].map((l) => (
                        <span key={l} className="rounded-full bg-nova-purple/15 border border-nova-purple/25 px-2 py-0.5 text-[10px] text-nova-purple">{l}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span className="text-[11px] text-emerald-400 font-medium">Status • Ready</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/assistant/hr')}
                    className="w-full rounded-lg bg-nova-purple py-2.5 text-sm font-semibold text-white hover:bg-nova-purple/80 transition-colors flex items-center justify-center gap-2"
                  >
                    Launch Assistant <ArrowUpRight size={15} />
                  </button>
                </div>

                {/* SNOW */}
                <div className="rounded-xl border border-nova-cyan/25 bg-nova-cyan/[0.05] p-4 flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="relative shrink-0 w-20 h-24 rounded-xl overflow-hidden border border-nova-cyan/30">
                      <img src={snowImg} alt="Snow" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-nova-cyan">SNOW</p>
                      <p className="text-xs text-ink-muted mb-2">Customer Support Assistant</p>
                      <ul className="space-y-0.5">
                        {['Customer Queries', 'Complaint Resolution', 'Product Information', 'Order Assistance'].map((t) => (
                          <li key={t} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                            <CheckCircle2 size={10} className="text-nova-cyan shrink-0" />{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint mb-1">Languages</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {['English', 'Hindi', 'Japanese', 'Korean', 'Spanish'].map((l) => (
                        <span key={l} className="rounded-full bg-nova-cyan/15 border border-nova-cyan/25 px-2 py-0.5 text-[10px] text-nova-cyan">{l}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span className="text-[11px] text-emerald-400 font-medium">Status • Ready</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/assistant/support')}
                    className="w-full rounded-lg bg-nova-cyan py-2.5 text-sm font-semibold text-[#0a0a1a] hover:bg-nova-cyan/80 transition-colors flex items-center justify-center gap-2"
                  >
                    Launch Assistant <ArrowUpRight size={15} />
                  </button>
                </div>

              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <p className="text-sm font-semibold text-white mb-4">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((a) => {
                  const Icon = a.icon
                  return (
                    <motion.button
                      key={a.label}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(a.path)}
                      className={`relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-300
                        ${a.accent === 'purple'
                          ? 'border-nova-purple/20 bg-nova-purple/[0.06] hover:border-nova-purple/40'
                          : 'border-nova-cyan/20 bg-nova-cyan/[0.06] hover:border-nova-cyan/40'}`}
                    >
                      <div className="flex w-full items-start justify-between">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${a.accent === 'purple' ? 'border-nova-purple/30 bg-nova-purple/10' : 'border-nova-cyan/30 bg-nova-cyan/10'}`}>
                          <Icon size={15} className={a.accent === 'purple' ? 'text-nova-purple' : 'text-nova-cyan'} />
                        </div>
                        <ArrowUpRight size={13} className="text-ink-faint" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white leading-snug">{a.label}</p>
                        <p className="text-[10px] text-ink-faint mt-0.5">{a.hint}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* ── Bottom Info Row ─────────────────────────────────────────── */}
          <div className="grid gap-4 lg:grid-cols-3">

            {/* Supported Languages */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.35 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <p className="text-sm font-semibold text-white mb-4">Supported Languages</p>
              <div className="flex gap-4 flex-wrap">
                {LANGS.map((l) => (
                  <div key={l.name} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{l.flag}</span>
                    <span className="text-[10px] text-ink-muted">{l.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Voice Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.42 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <p className="text-sm font-semibold text-white mb-4">Voice Capabilities</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                {VOICE_CAPS.flat().filter(Boolean).map((cap) => (
                  <div key={cap} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                    <Mic size={11} className="text-nova-cyan shrink-0" />{cap}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Technology Stack */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.49 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <p className="text-sm font-semibold text-white mb-4">Technology Stack</p>
              <div className="flex flex-wrap gap-2">
                {TECH.map((t) => (
                  <span
                    key={t.name}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-ink-muted hover:text-white transition-colors"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </PageTransition>
    </AppLayout>
  )
}
