import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'
import ChatWindow from '../components/chat/ChatWindow'
import Badge from '../components/ui/Badge'
import { ROLES } from '../utils/constants'
import { AVATAR_PERSONAS } from '../data/avatarPersonas'

const role = ROLES.find((r) => r.id === 'hr')
const persona = AVATAR_PERSONAS.aria

export default function HRAssistantPage() {
  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-center gap-3 mb-6">
          <Badge tone="indigo">HR Assistant</Badge>
          <span className="text-xs text-ink-faint">Persona: {persona.name}</span>
        </div>
        <ChatWindow role={role} persona={persona} />
      </PageTransition>
    </AppLayout>
  )
}
