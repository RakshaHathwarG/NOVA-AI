import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'

export default function CTA() {
  const navigate = useNavigate()
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-panel border-glow relative overflow-hidden px-8 py-16 md:px-16 text-center"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-nova-gradient opacity-20 blur-[100px]" />
        <h2 className="relative text-3xl md:text-5xl font-semibold text-white leading-tight max-w-2xl mx-auto">
          Your next hire is an avatar. Ready to meet them?
        </h2>
        <p className="relative mt-5 text-ink-muted max-w-xl mx-auto text-base md:text-lg">
          Spin up your first NOVA persona in under two minutes — no credit card required.
        </p>
        <div className="relative mt-9 flex items-center justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
            Start Experience <ArrowRight size={18} />
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
