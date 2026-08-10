import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'
import ChatWindow from '../components/chat/ChatWindow'
import Badge from '../components/ui/Badge'
import { ROLES } from '../utils/constants'
import { AVATAR_PERSONAS } from '../data/avatarPersonas'

const role = ROLES.find((r) => r.id === 'support')
const persona = AVATAR_PERSONAS.snow

export default function CustomerSupportPage() {
  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-center gap-3 mb-6">
          <Badge tone="cyan">Customer Support</Badge>
          <span className="text-xs text-ink-faint">Persona: {persona.name}</span>
        </div>
        <ChatWindow role={role} persona={persona} />
      </PageTransition>
    </AppLayout>
  )
}
