import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { TECH_STACK } from '../../utils/constants'

export default function TechStack() {
  return (
    <section id="technology" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Technology"
        title="Engineered on a modern, battle-tested stack"
        description="No fragile plugins or bloated frameworks — just fast, composable tools that scale."
      />

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {TECH_STACK.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="glass-panel border-glow flex flex-col items-center justify-center gap-2 px-4 py-8 text-center"
          >
            <span className="font-display text-base font-semibold text-white">{tech.name}</span>
            <span className="text-xs text-ink-faint">{tech.detail}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
