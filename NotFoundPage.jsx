import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import AmbientBackground from '../components/effects/AmbientBackground'
import Button from '../components/ui/Button'
import GradientText from '../components/ui/GradientText'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <AmbientBackground />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-8xl font-semibold"
      >
        <GradientText>404</GradientText>
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-2xl font-semibold text-white"
      >
        This signal doesn't reach anywhere
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-2 text-ink-muted max-w-md"
      >
        The page you're looking for has drifted out of orbit. Let's get you back to safety.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8">
        <Button variant="primary" onClick={() => navigate('/')}>
          <Home size={16} /> Back to home
        </Button>
      </motion.div>
    </div>
  )
}
