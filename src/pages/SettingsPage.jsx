import { motion } from 'framer-motion'
import { User, Bell, Shield, Globe } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'
import GlassCard from '../components/ui/GlassCard'
import { useAuth } from '../context/AuthContext'

const SECTIONS = [
  { icon: User, title: 'Profile', description: 'Update your name, email, and avatar preferences.' },
  { icon: Bell, title: 'Notifications', description: 'Choose when NOVA should alert you about activity.' },
  { icon: Shield, title: 'Security', description: 'Manage password, sessions, and two-factor authentication.' },
  { icon: Globe, title: 'Language & Region', description: 'Set your default assistant language and timezone.' },
]

export default function SettingsPage() {
  const { user } = useAuth()
  return (
    <AppLayout>
      <PageTransition>
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">Settings</h1>
        <p className="text-sm text-ink-muted mb-8">Signed in as {user?.email || 'guest@nova.ai'}</p>

        <div className="grid gap-5 sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard interactive className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nova-gradient-soft border border-white/10 mb-4">
                  <s.icon size={18} className="text-nova-cyan" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-ink-muted">{s.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </PageTransition>
    </AppLayout>
  )
}
