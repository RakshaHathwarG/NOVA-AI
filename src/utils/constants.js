export const FEATURES = [
  {
    title: 'Persona-Aware Reasoning',
    description:
      'Each avatar carries its own memory, tone, and domain expertise — HR and Support never blur together.',
    icon: 'BrainCircuit',
  },
  {
    title: 'Real-Time Voice & Text',
    description:
      'Switch between typing and speaking mid-conversation with sub-second response latency.',
    icon: 'AudioWaveform',
  },
  {
    title: 'Adaptive Avatar Rendering',
    description:
      'Lip-synced, expression-aware avatar stages that react to sentiment and conversation pace.',
    icon: 'Sparkles',
  },
  {
    title: 'Enterprise-Grade Security',
    description:
      'Encrypted sessions, role-scoped access, and audit trails built for regulated workplaces.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Multilingual Core',
    description:
      'Native support across English, Hindi, Kannada, Telugu, Tamil and more — same personality, any language.',
    icon: 'Languages',
  },
  {
    title: 'Insight Dashboard',
    description:
      'Track conversation volume, resolution rate, and sentiment trends in one live console.',
    icon: 'LineChart',
  },
]

export const TECH_STACK = [
  { name: 'React', detail: 'Component architecture' },
  { name: 'Vite', detail: 'Instant HMR & builds' },
  { name: 'Tailwind CSS', detail: 'Design system utility layer' },
  { name: 'Framer Motion', detail: 'Physics-based motion' },
  { name: 'Node.js', detail: 'Runtime services' },
  { name: 'WebSocket', detail: 'Live avatar streaming' },
]

export const HOW_IT_WORKS = [
  {
    label: 'Choose',
    title: 'Select a persona',
    description: 'Pick the HR Assistant or Customer Support Assistant based on what you need.',
  },
  {
    label: 'Converse',
    title: 'Talk naturally',
    description: 'Type or speak — NOVA responds in real time with context-aware, role-specific answers.',
  },
  {
    label: 'Resolve',
    title: 'Get it handled',
    description: 'Leave with an answer, a resolved ticket, or a clear next step — no dead ends.',
  },
]

export const ROLES = [
  {
    id: 'hr',
    name: 'HR Assistant',
    persona: 'Aria',
    tagline: 'Recruitment. Policy. People.',
    description:
      'Professional AI-powered HR assistant for recruitment, interviews, employee policies, payroll, leave management, attendance, benefits, HR FAQs, and workplace guidance.',
    accent: 'indigo',
    path: '/assistant/hr',
    icon: 'Briefcase',
    tags: ['Recruitment', 'Payroll', 'Leave & Attendance', 'Policies'],
  },
  {
    id: 'support',
    name: 'Customer Support Assistant',
    persona: 'Snow',
    tagline: 'Orders. Answers. Care.',
    description:
      'Friendly AI-powered customer support assistant for products, services, FAQs, complaints, order information, customer assistance, and general support.',
    accent: 'cyan',
    path: '/assistant/support',
    icon: 'Headset',
    tags: ['Order Tracking', 'Complaints', 'Product FAQs', 'General Help'],
  },
]

export const LANGUAGES = ['English', 'Hindi', 'Japanese', 'Korean', 'Spanish']