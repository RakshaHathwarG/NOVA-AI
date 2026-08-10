import { motion } from 'framer-motion'
import Badge from './Badge'

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-4 max-w-2xl ${alignment}`}
    >
      {eyebrow && <Badge tone="cyan">{eyebrow}</Badge>}
      <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight">{title}</h2>
      {description && <p className="text-ink-muted text-base md:text-lg leading-relaxed">{description}</p>}
    </motion.div>
  )
}
