import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import nebulaBackground from '../assets/nova-deep-space-nebula.svg'

// ── Particle star background ────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.1,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Purple nebula streaks */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }} />
    </div>
  )
}

// ── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your full name.'); return }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await register(name.trim(), email, password)
      } else {
        await login(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden flex bg-cover bg-right bg-no-repeat lg:bg-center"
      style={{ backgroundColor: '#060313', backgroundImage: `url(${nebulaBackground})` }}
    >
      <StarField />

      {/* ── Left: NOVA workspace introduction ─────────────────────────── */}
      <section className="relative z-10 hidden min-h-screen flex-[1.1] flex-col justify-between px-10 py-12 lg:flex xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl pt-8 xl:pt-12"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-[#100b27]/65 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
            Your AI workspace
          </div>
          <h2 className="font-display text-4xl font-semibold leading-[1.12] text-white xl:text-5xl">
            A smarter way to
            <span className="mt-1 block bg-gradient-to-r from-fuchsia-200 via-violet-200 to-cyan-200 bg-clip-text text-transparent">work, support, and grow.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-slate-300/90 xl:text-base">
            Meet your role-based AI partners, ready to help your team move forward.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="flex items-center gap-3 pb-2"
        >
          <div className="rounded-xl border border-violet-200/20 bg-[#100b27]/60 px-4 py-2.5 backdrop-blur-md">
            <span className="block text-xs font-semibold tracking-wide text-white">ARIA</span>
            <span className="mt-0.5 block text-[10px] text-slate-300/80">People & HR</span>
          </div>
          <div className="rounded-xl border border-cyan-200/20 bg-[#100b27]/60 px-4 py-2.5 backdrop-blur-md">
            <span className="block text-xs font-semibold tracking-wide text-white">SNOW</span>
            <span className="mt-0.5 block text-[10px] text-slate-300/80">Customer success</span>
          </div>
          <span className="ml-2 text-xs text-slate-300/75">Two focused assistants. One workspace.</span>
        </motion.div>
      </section>

      {/* ── Right: Login Card ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:flex-[0.9] lg:px-10 lg:py-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[430px]"
        >
          {/* Floating icon above card */}
          <div className="flex justify-center mb-0 relative z-10" style={{ marginBottom: '-24px' }}>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.6)]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                border: '1px solid rgba(167,139,250,0.4)',
              }}
            >
              <Sparkles size={24} className="text-white" strokeWidth={2} />
            </motion.div>
          </div>

          {/* Card */}
          <div
            className="relative rounded-3xl p-6 pt-10 sm:p-8 sm:pt-10 md:p-10"
            style={{
              background: 'linear-gradient(145deg, rgba(30,20,60,0.95) 0%, rgba(20,14,45,0.98) 100%)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* NOVA identity */}
            <div className="mb-7 flex items-center justify-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-300/30 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]"><Sparkles size={15} className="text-white" /></span>
              <span className="text-sm font-bold tracking-[0.22em] text-white">NOVA <span className="text-violet-300">AI</span></span>
              <span className="ml-1 rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">Secure access</span>
            </div>

            {/* Header */}
            <div className="text-center mb-7">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="mt-2 text-sm text-[#8b92a5]">
                {mode === 'login'
                  ? 'Sign in to continue to your NOVA AI dashboard'
                  : 'Start building with role-based AI avatars'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name field (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="text-xs font-medium text-[#8b92a5] mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555e7a]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-xl px-4 pl-11 py-3.5 text-sm text-white placeholder:text-[#555e7a] outline-none transition-all"
                        style={{
                          background: 'rgba(15,10,35,0.8)',
                          border: '1px solid rgba(139,92,246,0.2)',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.2)'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-[#8b92a5] mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555e7a]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl px-4 pl-11 py-3.5 text-sm text-white placeholder:text-[#555e7a] outline-none transition-all"
                    style={{
                      background: 'rgba(15,10,35,0.8)',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.2)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-[#8b92a5] mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555e7a]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl px-4 pl-11 pr-12 py-3.5 text-sm text-white placeholder:text-[#555e7a] outline-none transition-all"
                    style={{
                      background: 'rgba(15,10,35,0.8)',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.2)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555e7a] hover:text-[#8b92a5] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className="relative w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer"
                      style={{
                        background: rememberMe ? '#7c3aed' : 'rgba(15,10,35,0.8)',
                        border: `1.5px solid ${rememberMe ? '#7c3aed' : 'rgba(139,92,246,0.3)'}`,
                      }}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-[#8b92a5] group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setError('Password reset is not set up yet. Please contact your NOVA administrator.')}
                    className="text-sm font-medium text-violet-300 transition-colors hover:text-violet-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Sign In button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-1"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 40%, #4f46e5 100%)',
                  boxShadow: '0 4px 24px rgba(139,92,246,0.4)',
                }}
              >
                {submitting ? (
                  <><Loader2 size={17} className="animate-spin" /> Signing in…</>
                ) : (
                  <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                )}
              </motion.button>
            </form>

            {/* Toggle mode */}
            <p className="mt-6 text-center text-sm text-[#8b92a5]">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="font-semibold text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
