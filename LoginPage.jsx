import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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

// ── AI Hologram visual (left side) ──────────────────────────────────────────
function AIHologram() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full border border-purple-500/20"
        style={{ width: 420, height: 420 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-indigo-400/15"
        style={{ width: 360, height: 360 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main glowing circle */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 280, height: 280,
          background: 'radial-gradient(circle at 40% 35%, rgba(139,92,246,0.25) 0%, rgba(79,70,229,0.15) 40%, rgba(15,10,40,0.8) 100%)',
          border: '1.5px solid rgba(139,92,246,0.4)',
          boxShadow: '0 0 60px rgba(139,92,246,0.3), inset 0 0 40px rgba(79,70,229,0.15)',
        }}
        animate={{ boxShadow: ['0 0 60px rgba(139,92,246,0.3), inset 0 0 40px rgba(79,70,229,0.15)', '0 0 90px rgba(139,92,246,0.5), inset 0 0 60px rgba(79,70,229,0.25)', '0 0 60px rgba(139,92,246,0.3), inset 0 0 40px rgba(79,70,229,0.15)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* AI Head SVG */}
        <svg width="160" height="180" viewBox="0 0 160 180" fill="none">
          {/* Head silhouette */}
          <path
            d="M80 20 C45 20 30 45 30 75 C30 95 35 110 45 120 L45 140 L115 140 L115 120 C125 110 130 95 130 75 C130 45 115 20 80 20Z"
            fill="url(#headGrad)"
            stroke="rgba(139,92,246,0.6)"
            strokeWidth="1"
          />
          {/* Brain circuit lines */}
          <path d="M55 65 L75 55 L90 65 L105 55" stroke="rgba(139,92,246,0.7)" strokeWidth="1" strokeLinecap="round" />
          <path d="M50 80 L65 72 L80 80 L95 72 L110 80" stroke="rgba(99,102,241,0.6)" strokeWidth="1" strokeLinecap="round" />
          <path d="M55 95 L70 88 L85 95 L100 88" stroke="rgba(139,92,246,0.5)" strokeWidth="1" strokeLinecap="round" />
          {/* Circuit dots */}
          <circle cx="75" cy="55" r="2.5" fill="rgba(167,139,250,0.9)" />
          <circle cx="90" cy="65" r="2" fill="rgba(139,92,246,0.8)" />
          <circle cx="65" cy="72" r="2.5" fill="rgba(167,139,250,0.9)" />
          <circle cx="95" cy="72" r="2" fill="rgba(99,102,241,0.7)" />
          <circle cx="80" cy="80" r="3" fill="rgba(167,139,250,1)" />
          <circle cx="85" cy="95" r="2" fill="rgba(139,92,246,0.8)" />
          {/* Eyes */}
          <ellipse cx="65" cy="85" rx="6" ry="5" fill="rgba(99,102,241,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1" />
          <ellipse cx="95" cy="85" rx="6" ry="5" fill="rgba(99,102,241,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1" />
          <circle cx="65" cy="85" r="2.5" fill="rgba(167,139,250,0.9)" />
          <circle cx="95" cy="85" r="2.5" fill="rgba(167,139,250,0.9)" />
          {/* Star particles inside */}
          <circle cx="60" cy="55" r="1.5" fill="white" opacity="0.8" />
          <circle cx="100" cy="60" r="1" fill="white" opacity="0.6" />
          <circle cx="45" cy="75" r="1" fill="rgba(167,139,250,0.9)" />
          <circle cx="115" cy="80" r="1.5" fill="rgba(167,139,250,0.7)" />
          <circle cx="70" cy="110" r="1" fill="white" opacity="0.5" />
          <defs>
            <linearGradient id="headGrad" x1="30" y1="20" x2="130" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(79,70,229,0.6)" />
              <stop offset="50%" stopColor="rgba(15,10,40,0.9)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.3)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating particles inside ring */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-400"
            style={{
              width: Math.random() * 3 + 1.5,
              height: Math.random() * 3 + 1.5,
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              opacity: 0.7,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.7, 0.2, 0.7],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Platform / base rings */}
      <div className="absolute" style={{ bottom: '12%' }}>
        {[1, 0.75, 0.55, 0.38, 0.24].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: 300 * scale,
              height: 60 * scale,
              left: `${-150 * scale}px`,
              top: `${i * 10}px`,
              borderColor: `rgba(139,92,246,${0.35 - i * 0.05})`,
              background: i === 0
                ? 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)'
                : 'transparent',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Central glow dot on platform */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 16, height: 16,
            left: '-8px',
            top: '-4px',
            background: 'radial-gradient(circle, rgba(255,200,255,1) 0%, rgba(167,139,250,0.8) 40%, transparent 70%)',
            boxShadow: '0 0 20px rgba(167,139,250,0.9), 0 0 40px rgba(139,92,246,0.6)',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Beam from head to platform */}
      <div
        className="absolute"
        style={{
          width: 2,
          height: '35%',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to bottom, rgba(139,92,246,0.6), rgba(167,139,250,0.1))',
          filter: 'blur(1px)',
        }}
      />
    </div>
  )
}

// ── Google G logo ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
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
  const [googleLoading, setGoogleLoading] = useState(false)
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

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    try {
      // Mock Google OAuth — creates a realistic Google user session
      await login('nova.user@gmail.com', 'google-oauth-mock')
      navigate('/dashboard')
    } catch {
      setError('Google sign-in unavailable in demo mode.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden flex"
      style={{ background: 'linear-gradient(135deg, #06040f 0%, #0d0720 40%, #0a0520 70%, #060312 100%)' }}
    >
      <StarField />

      {/* ── Left: AI Hologram ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full max-w-xl"
          style={{ minHeight: '100vh' }}
        >
          <AIHologram />
        </motion.div>
      </div>

      {/* ── Right: Login Card ─────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
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
            className="rounded-3xl p-8 md:p-10 pt-12 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(30,20,60,0.95) 0%, rgba(20,14,45,0.98) 100%)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
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
                    className="text-sm font-medium text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
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

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
              <span className="text-xs text-[#555e7a]">or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
            </div>

            {/* Google button */}
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              whileHover={{ scale: 1.01, borderColor: 'rgba(139,92,246,0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all disabled:opacity-70"
              style={{
                background: 'rgba(15,10,35,0.9)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {googleLoading ? (
                <><Loader2 size={17} className="animate-spin" /> Connecting…</>
              ) : (
                <><GoogleIcon /> Sign in with Google</>
              )}
            </motion.button>

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
