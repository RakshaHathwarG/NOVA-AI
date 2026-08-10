import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import SectionHeading from '../ui/SectionHeading'
import { FEATURES } from '../../utils/constants'

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Capabilities"
        title="Built for real conversations, not scripted bots"
        description="Every layer of NOVA is designed so each persona feels distinct, informed, and genuinely useful."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = Icons[feature.icon] || Icons.Sparkles
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard interactive glow={i % 3 === 0 ? 'indigo' : i % 3 === 1 ? 'purple' : 'cyan'} className="h-full p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-nova-gradient-soft border border-white/10 mb-5">
                  <Icon size={20} className="text-nova-cyan" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
