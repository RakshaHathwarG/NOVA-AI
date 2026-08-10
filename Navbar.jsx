import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleAnchor(href) {
    setMobileOpen(false)
    if (isLanding) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + href)
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      <div className="w-full bg-[#020511]/75 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo: Sparkles Icon + NOVA AI */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8A2EFF] to-[#00D9FF] p-0.5 shadow-[0_0_20px_rgba(0,217,255,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#060814]">
                <Sparkles size={18} className="text-[#00D9FF] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              NOVA <span className="text-[#00D9FF]">AI</span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                className="text-sm font-light text-slate-300 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Button: Dashboard */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8A2EFF] to-[#00D9FF] px-6 py-2 text-sm font-medium text-white shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(138,46,255,0.6)]"
            >
              Dashboard
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#060814]/95 border-b border-white/10 px-6 py-4 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleAnchor(link.href)}
                  className="rounded-xl px-4 py-2.5 text-left text-sm font-light text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-[#8A2EFF] to-[#00D9FF] py-2.5 text-center text-sm font-medium text-white shadow-[0_0_20px_rgba(0,217,255,0.4)]"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
