import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Headset } from 'lucide-react'

const LINKS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/roles', label: 'Roles', icon: Users },
  { to: '/assistant/hr', label: 'HR', icon: Briefcase },
  { to: '/assistant/support', label: 'Support', icon: Headset },
]

export default function MobileTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/[0.08] px-4 py-2 flex items-center justify-between">
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors ${
              isActive ? 'text-nova-cyan' : 'text-ink-faint'
            }`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
