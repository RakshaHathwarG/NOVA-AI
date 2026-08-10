import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, MessageSquare, Mic, Settings, HelpCircle,
  LogOut, Sparkles, ChevronDown, Briefcase, Headset, Shield
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/assistant/hr', label: 'Assistants', icon: Users },
  { to: '/assistant/hr', label: 'Chat History', icon: MessageSquare },
  { to: '/settings', label: 'Voice & Language', icon: Mic },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/', label: 'Help & Support', icon: HelpCircle },
]

const ROLE_LINKS = [
  { to: '/assistant/hr', label: 'HR Assistant', icon: Briefcase, accent: 'purple' },
  { to: '/assistant/support', label: 'Customer Support', icon: Headset, accent: 'cyan' },
]

export default function AppSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [rolesOpen, setRolesOpen] = useState(false)

  const isRolesActive = location.pathname.startsWith('/roles') || location.pathname.startsWith('/assistant')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col z-40"
      style={{ background: 'linear-gradient(180deg, #0d0d1f 0%, #0a0a1a 100%)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-nova-gradient shadow-glow-indigo">
            <Sparkles size={17} className="text-white" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-bold text-white">
            NOVA <span className="text-nova-cyan">AI</span>
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-nova-purple/20 text-white border border-nova-purple/30'
                    : 'text-[#8b92a5] hover:bg-white/[0.05] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-nova-purple' : 'text-[#8b92a5] group-hover:text-white'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          {/* Roles collapsible */}
          <div>
            <button
              onClick={() => setRolesOpen(!rolesOpen)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isRolesActive
                  ? 'bg-nova-purple/20 text-white border border-nova-purple/30'
                  : 'text-[#8b92a5] hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Shield size={17} className={isRolesActive ? 'text-nova-purple' : 'text-[#8b92a5] group-hover:text-white'} />
              <span className="flex-1 text-left">Roles</span>
              <motion.span animate={{ rotate: rolesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-[#8b92a5]" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {rolesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="ml-3 mt-0.5 space-y-0.5 pl-5 border-l border-white/[0.07]">
                    {ROLE_LINKS.map(({ to, label, icon: Icon, accent }) => (
                      <NavLink
                        key={label}
                        to={to}
                        className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#8b92a5] hover:bg-white/[0.05] hover:text-white transition-all duration-200"
                      >
                        <Icon
                          size={13}
                          className={accent === 'purple' ? 'text-nova-purple/70 group-hover:text-nova-purple' : 'text-nova-cyan/70 group-hover:text-nova-cyan'}
                        />
                        {label}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-3 pb-5 pt-3 border-t border-white/[0.07] space-y-1">
        {/* User card */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-nova-gradient text-sm font-bold text-white">
            {(user?.name || 'N')[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name || 'Guest'}</p>
            <p className="truncate text-[11px] text-[#8b92a5]">{user?.email || 'guest@nova.ai'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8b92a5] transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Log Out
        </button>

        {/* Branding */}
        <div className="mt-3 flex items-center gap-2.5 px-3 pt-3 border-t border-white/[0.07]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-nova-gradient shadow-glow-indigo">
            <Sparkles size={13} className="text-white" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-xs font-bold text-white">NOVA <span className="text-nova-cyan">AI</span></p>
            <p className="text-[9px] text-[#8b92a5] leading-tight">AI-Powered Virtual<br />Assistant Platform</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
