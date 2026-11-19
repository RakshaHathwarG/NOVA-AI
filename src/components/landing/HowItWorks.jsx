import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { HOW_IT_WORKS } from '../../utils/constants'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Process"
        title="A clear path through the demo"
        description="Choose a role, try a local reply template, then revisit the conversation in your history."
      />

      <div className="relative mt-20 grid gap-10 md:grid-cols-3">
        <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-nova-indigo via-nova-purple to-nova-cyan opacity-40" />
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="relative flex flex-col items-start"
          >
            <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-void border border-white/15 text-sm font-mono text-nova-cyan">
              {step.label.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
