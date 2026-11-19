import { Sparkles, Github, Linkedin } from 'lucide-react'

const TEAM_MEMBERS = [
  { name: 'Raksha Hathwar G', github: 'https://github.com/RakshaHathwarG', linkedin: 'https://www.linkedin.com/in/raksha-hathwar-g-75467a391' },
  { name: 'Amruta Hadapad', github: 'https://github.com/Amruta8050', linkedin: 'https://www.linkedin.com/in/amruta-hadapad-0547183aa' },
  { name: 'Anusha N', github: 'https://github.com/anushan2005', linkedin: 'https://www.linkedin.com/in/anusha-n-25a4183aa' },
]

const COLUMNS = [
  { title: 'Product', links: [['Features', '/#features'], ['How it works', '/#how-it-works'], ['Technology', '/#technology']] },
  { title: 'Assistants', links: [['ARIA · HR', '/assistant/hr'], ['SNOW · Customer support', '/assistant/support']] },
  { title: 'Workspace', links: [['Sign in', '/login'], ['Settings', '/settings'], ['Help & feedback', '/help']] },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 border-b border-white/[0.06] pb-12 lg:grid-cols-2">
          <div>
            <a href="/" className="mb-4 inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-nova-gradient shadow-glow-indigo"><Sparkles size={18} className="text-white" strokeWidth={2.2} /></span>
              <span className="font-display text-xl font-semibold text-white">NOVA <span className="text-nova-cyan">AI</span></span>
            </a>
            <p className="max-w-md text-sm leading-relaxed text-ink-muted">A role-based assistant platform with ARIA for HR conversations and SNOW for customer support.</p>
          </div>
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Project team</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.name} className="glass rounded-xl border border-white/10 p-4">
                  <h4 className="mb-4 text-sm font-medium text-white">{member.name}</h4>
                  <div className="flex gap-4">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors hover:text-purple-400" aria-label={`${member.name} GitHub`}><Github size={18} /></a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors hover:text-cyan-400" aria-label={`${member.name} LinkedIn`}><Linkedin size={18} /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-8 border-b border-white/[0.06] py-9 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-ink-muted transition-colors hover:text-nova-cyan">{label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-xs text-ink-faint md:flex-row">
          <p>© {new Date().getFullYear()} NOVA AI</p>
        </div>
      </div>
    </footer>
  )
}
