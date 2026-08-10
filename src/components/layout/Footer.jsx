import { Sparkles, Github, Linkedin } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Raksha Hathwar G",
    github: "https://github.com/RakshaHathwarG",
    linkedin: "https://www.linkedin.com/in/raksha-hathwar-g-75467a391",
  },
  {
    name: "Amruta Hadapad",
    github: "https://github.com/Amruta8050",
    linkedin: "https://www.linkedin.com/in/amruta-hadapad-0547183aa",
  },
  {
    name: "Anusha N",
    github: "https://github.com/anushan2005",
    linkedin: "https://www.linkedin.com/in/anusha-n-25a4183aa",
  },
];

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "How It Works", "Technology", "Pricing"],
  },
  {
    title: "Personas",
    links: ["HR Assistant", "Customer Support", "Custom Roles"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-nova-gradient shadow-glow-indigo">
                <Sparkles
                  size={18}
                  className="text-white"
                  strokeWidth={2.2}
                />
              </span>

              <span className="font-display text-xl font-semibold text-white">
                NOVA <span className="text-nova-cyan">AI</span>
              </span>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed max-w-md">
              Role-based interactive virtual avatar platform for the modern
              workplace.
            </p>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Meet the Team
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="glass rounded-xl border border-white/10 p-4"
                >
                  <h4 className="text-white font-medium mb-4 text-sm">
                    {member.name}
                  </h4>

                  <div className="flex gap-4">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-ink-muted hover:text-purple-400 transition-colors"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Github
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </a>

                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-ink-muted hover:text-cyan-400 transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/[0.06] pt-10">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {col.title}
              </h4>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ink-muted hover:text-nova-cyan transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} NOVA AI. All rights reserved.
          </p>

          <p className="text-xs text-ink-faint">
            Built with React, Tailwind CSS & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}