import { motion } from 'framer-motion'
import { Briefcase, CheckCircle2, Headset } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const ACTIVITY = [
  { icon: Briefcase, title: 'HR policy lookup completed', detail: 'Aria summarized leave guidance for a new teammate.', time: '2m ago', tone: 'purple', status: 'Resolved' },
  { icon: Headset, title: 'Support follow-up drafted', detail: 'Snow prepared a polished response for an order issue.', time: '14m ago', tone: 'cyan', status: 'Drafted' },
  { icon: CheckCircle2, title: 'Daily brief generated', detail: 'A concise summary was ready for human review.', time: '1h ago', tone: 'purple', status: 'Ready' },
  { icon: Headset, title: 'Escalation review queued', detail: 'A billing concern was routed for careful follow-up.', time: '3h ago', tone: 'cyan', status: 'Queued' },
]

const DOT = { purple: 'bg-nova-purple shadow-[0_0_10px_rgba(176,75,240,0.8)]', cyan: 'bg-nova-cyan shadow-[0_0_10px_rgba(63,224,208,0.8)]' }

export default function ActivityFeed() {
  return (
    <GlassCard glow="cyan" className="h-full p-6 md:p-7">
      <div className="relative mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Activity</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Recent Timeline</h3>
          <p className="mt-1 text-sm text-ink-muted">Latest assistant actions across your workspace.</p>
        </div>
        <span className="rounded-full border border-nova-cyan/20 bg-nova-cyan/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-nova-cyan">
          Live
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-nova-purple/40 via-nova-cyan/30 to-transparent" />

        <ul className="flex flex-col gap-1">
          {ACTIVITY.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-8"
            >
              <span
                className={`absolute left-0 top-5 h-[15px] w-[15px] rounded-full border-2 border-navy ${DOT[item.tone]}`}
              />

              <div className="group rounded-dashboard border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/12 hover:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                      <item.icon size={14} className="text-ink-muted" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.detail}</p>
                      <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-ink-muted">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] text-ink-faint">{item.time}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </GlassCard>
  )
}
