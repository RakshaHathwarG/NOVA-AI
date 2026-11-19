import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, MessageSquare, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'
import { chatApi } from '../services/api'

const ROLE_LABELS = { HR: 'ARIA · HR Assistant', 'Customer Support': 'SNOW · Customer Support' }

export default function ChatHistoryPage() {
  const [role, setRole] = useState('')
  const [chats, setChats] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadHistory() {
    setLoading(true)
    setError('')
    try {
      const result = await chatApi.getHistory(role)
      setChats(result.chats || [])
      setSelectedId((current) => current && (result.chats || []).some((chat) => chat.conversationId === current)
        ? current
        : (result.chats || []).at(-1)?.conversationId || null)
    } catch (err) {
      setError(err.message || 'Unable to load your chat history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadHistory() }, [role])

  const conversations = useMemo(() => {
    const grouped = new Map()
    for (const chat of chats) {
      const id = chat.conversationId || `${chat.role}-${new Date(chat.timestamp).toDateString()}`
      if (!grouped.has(id)) grouped.set(id, { id, role: chat.role, messages: [], updatedAt: chat.timestamp })
      const conversation = grouped.get(id)
      conversation.messages.push(chat)
      conversation.updatedAt = chat.timestamp
    }
    return [...grouped.values()].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [chats])

  const selected = conversations.find((conversation) => conversation.id === selectedId)

  return (
    <AppLayout>
      <PageTransition>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-nova-cyan">Your conversations</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Chat History</h1>
            <p className="mt-1 text-sm text-ink-muted">Saved conversations for your account.</p>
          </div>
          <button onClick={loadHistory} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-muted hover:text-white" aria-label="Refresh history">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {[['', 'All'], ['HR', 'ARIA'], ['Customer Support', 'SNOW']].map(([value, label]) => (
            <button key={value} onClick={() => setRole(value)} className={`rounded-full border px-4 py-2 text-sm ${role === value ? 'border-nova-purple/50 bg-nova-purple/20 text-white' : 'border-white/10 text-ink-muted hover:text-white'}`}>{label}</button>
          ))}
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
        {loading ? <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-ink-muted">Loading chat history…</div> : (
          <div className="grid min-h-[420px] gap-4 lg:grid-cols-[320px_1fr]">
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {conversations.length === 0 ? <div className="p-8 text-center text-sm text-ink-muted"><MessageSquare className="mx-auto mb-3 text-ink-faint" /><p>No saved conversations yet.</p><Link className="mt-3 inline-block text-nova-cyan hover:underline" to="/roles">Start a chat</Link></div> : (
                <div className="divide-y divide-white/[0.07]">
                  {conversations.map((conversation) => {
                    const firstUserMessage = conversation.messages.find((message) => message.sender === 'user')
                    return <button key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`w-full p-4 text-left transition-colors ${conversation.id === selectedId ? 'bg-nova-purple/15' : 'hover:bg-white/[0.04]'}`}>
                      <span className="block text-xs font-semibold text-nova-cyan">{ROLE_LABELS[conversation.role] || conversation.role}</span>
                      <span className="mt-1 block truncate text-sm text-white">{firstUserMessage?.message || 'Conversation'}</span>
                      <span className="mt-1 block text-xs text-ink-faint">{new Date(conversation.updatedAt).toLocaleString()} · {conversation.messages.length} messages</span>
                    </button>
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              {!selected ? <div className="flex h-full min-h-72 items-center justify-center text-sm text-ink-faint">Choose a conversation to read its messages.</div> : <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <h2 className="text-sm font-semibold text-white">{ROLE_LABELS[selected.role] || selected.role}</h2>
                  <Link to={`${selected.role === 'HR' ? '/assistant/hr' : '/assistant/support'}?conversationId=${encodeURIComponent(selected.id)}`} className="inline-flex items-center gap-2 rounded-lg border border-nova-cyan/25 px-3 py-2 text-xs font-semibold text-nova-cyan transition-colors hover:bg-nova-cyan/10">Open conversation <ArrowUpRight size={14} /></Link>
                </div>
                <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
                  {selected.messages.map((message) => <div key={message._id} className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${message.sender === 'user' ? 'ml-auto bg-nova-purple/20 text-white' : 'bg-white/[0.06] text-ink-muted'}`}>
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-ink-faint">{message.sender === 'user' ? 'You' : 'Assistant'} · {new Date(message.timestamp).toLocaleString()}</p>
                    <p className="whitespace-pre-wrap">{message.message}</p>
                  </div>)}
                </div>
              </>}
            </section>
          </div>
        )}
        <Link to="/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm text-ink-faint hover:text-white"><ArrowLeft size={15} /> Back to dashboard</Link>
      </PageTransition>
    </AppLayout>
  )
}
