export const FEATURES = [
  {
    title: 'Role-specific response templates',
    description:
      'ARIA and SNOW use separate local response rules for their HR and customer-support roles.',
    icon: 'BrainCircuit',
  },
  {
    title: 'Text chat and browser voice',
    description:
      'Type messages, use browser speech recognition where supported, and hear replies with device text-to-speech.',
    icon: 'AudioWaveform',
  },
  {
    title: 'Animated assistant avatars',
    description:
      'Assistant avatars animate during conversations; expression changes are presentation effects.',
    icon: 'Sparkles',
  },
  {
    title: 'Account-scoped chat history',
    description:
      'Saved conversation history is scoped to the signed-in account.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Five built-in reply languages',
    description:
      'Local response templates include English, Hindi, Japanese, Korean, and Spanish.',
    icon: 'Languages',
  },
  {
    title: 'Conversation workspace',
    description:
      'Use the dashboard to open ARIA, SNOW, settings, and saved conversation history.',
    icon: 'LineChart',
  },
]

export const TECH_STACK = [
  { name: 'React', detail: 'Component architecture' },
  { name: 'Vite', detail: 'Instant HMR & builds' },
  { name: 'Tailwind CSS', detail: 'Design system utility layer' },
  { name: 'Framer Motion', detail: 'Physics-based motion' },
  { name: 'Node.js', detail: 'Runtime services' },
  { name: 'MongoDB', detail: 'User and conversation storage' },
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
    description: 'Type a message or use device speech controls where supported; replies come from local role-specific templates.',
  },
  {
    label: 'Resolve',
    title: 'Get it handled',
    description: 'Review the reply, continue the conversation, or open Help & Feedback.',
  },
]

export const ROLES = [
  {
    id: 'hr',
    name: 'HR Assistant',
    persona: 'Aria',
    tagline: 'Recruitment. Policy. People.',
    description:
      'Rule-based HR conversation demo for career guidance, interview practice, and general workplace questions. It is not connected to your company’s policies or employee records.',
    accent: 'indigo',
    path: '/assistant/hr',
    icon: 'Briefcase',
    tags: ['Career guidance', 'Interview practice', 'Workplace questions'],
  },
  {
    id: 'support',
    name: 'Customer Support Assistant',
    persona: 'Snow',
    tagline: 'Orders. Answers. Care.',
    description:
      'Rule-based customer-support demo for general questions and issue-triage practice. It is not connected to a store, account, ticketing system, or order records.',
    accent: 'cyan',
    path: '/assistant/support',
    icon: 'Headset',
    tags: ['Support questions', 'Issue triage', 'General guidance'],
  },
]

export const LANGUAGES = ['English', 'Hindi', 'Japanese', 'Korean', 'Spanish']