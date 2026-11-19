import { useEffect, useState } from 'react'
import { Check, ChevronDown, Loader2, Save, Trash2 } from 'lucide-react'
import { sessionBriefApi } from '../../services/api'

const EMPTY = { goal: '', importantPoints: '', followUps: '', notes: '', status: 'Not Started' }
const FIELDS = [
  { key: 'goal', label: 'Goal', hint: 'What do you want to accomplish?', max: 500 },
  { key: 'importantPoints', label: 'Important points', hint: 'Keep the key details for this conversation.', max: 2000 },
  { key: 'followUps', label: 'Follow-up actions', hint: 'What needs to happen next?', max: 2000 },
  { key: 'notes', label: 'Personal notes', hint: 'Private notes for this conversation.', max: 5000 },
]

export default function SessionBriefPanel({ role, conversationId, enabled }) {
  const [open, setOpen] = useState(false)
  const [brief, setBrief] = useState(EMPTY)
  const [exists, setExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setMessage('')
    setConfirmDelete(false)
    sessionBriefApi.get(role, conversationId)
      .then(({ brief: saved }) => {
        if (!active) return
        setExists(Boolean(saved))
        setBrief(saved ? { ...EMPTY, ...saved } : EMPTY)
      })
      .catch((err) => { if (active) setError(err.message || 'Session brief could not be loaded.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [role, conversationId])

  function update(field, value) {
    setBrief((current) => ({ ...current, [field]: value }))
    setError('')
    setMessage('')
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const result = await sessionBriefApi.save({ ...brief, role, conversationId })
      setBrief({ ...EMPTY, ...result.brief })
      setExists(true)
      setMessage('Brief saved to this conversation.')
    } catch (err) {
      setError(err.message || 'Brief could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    setSaving(true)
    setError('')
    try {
      await sessionBriefApi.delete(role, conversationId)
      setBrief(EMPTY)
      setExists(false)
      setConfirmDelete(false)
      setMessage('Brief deleted.')
    } catch (err) {
      setError(err.message || 'Brief could not be deleted.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="relative z-10 rounded-xl border border-white/10 bg-[#090d1c]/90">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
        <span>
          <span className="block text-sm font-semibold text-white">Session Brief</span>
          <span className="mt-0.5 block text-xs text-ink-muted">Keep this chat’s goal, notes, and next steps together.</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {exists && <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-200">{brief.status}</span>}
          <ChevronDown size={16} aria-hidden="true" className={`text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open && (
        <form onSubmit={save} className="space-y-4 border-t border-white/10 px-4 py-4">
          <p className="text-xs text-ink-faint">Saved privately with your account for this conversation. It is stored in MongoDB.</p>
          {loading ? <p role="status" className="flex items-center gap-2 text-sm text-ink-muted"><Loader2 size={14} className="animate-spin" />Loading brief…</p> : (
            <>
              {FIELDS.map(({ key, label, hint, max }) => (
                <div key={key}>
                  <label htmlFor={`brief-${key}`} className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</label>
                  <textarea id={`brief-${key}`} value={brief[key]} maxLength={max} rows={key === 'goal' ? 2 : 3} onChange={(event) => update(key, event.target.value)} placeholder={hint} disabled={!enabled || saving} className="relative z-10 w-full resize-y rounded-lg border border-white/10 bg-[#101321] px-3 py-2.5 text-sm text-white placeholder:text-ink-faint outline-none disabled:opacity-50 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" />
                  <p className="mt-1 text-right text-[10px] text-ink-faint">{brief[key].length}/{max}</p>
                </div>
              ))}
              <div>
                <label htmlFor="brief-status" className="mb-1.5 block text-xs font-medium text-ink-muted">Status</label>
                <select id="brief-status" value={brief.status} onChange={(event) => update('status', event.target.value)} disabled={!enabled || saving} className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#101321] px-3 py-2.5 text-sm text-white outline-none disabled:opacity-50 focus:border-violet-400">
                  <option>Not Started</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
              {!enabled && <p className="text-xs text-amber-200">Send a message before saving a brief for this conversation.</p>}
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              {message && <p role="status" className="flex items-center gap-2 text-sm text-emerald-300"><Check size={14} />{message}</p>}
              <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={!enabled || saving || !FIELDS.some((field) => brief[field.key].trim())} className="inline-flex items-center gap-2 rounded-lg bg-nova-gradient px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Save size={15} />{saving ? 'Saving…' : 'Save brief'}</button>
                {exists && !confirmDelete && <button type="button" disabled={saving} onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-2.5 text-sm text-red-200 hover:bg-red-400/10 disabled:opacity-50"><Trash2 size={15} />Delete</button>}
                {confirmDelete && <div className="flex items-center gap-2" role="group" aria-label="Confirm brief deletion"><span className="text-xs text-red-200">Delete this brief?</span><button type="button" disabled={saving} onClick={() => setConfirmDelete(false)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white">Cancel</button><button type="button" disabled={saving} onClick={remove} className="rounded-lg bg-red-500/80 px-3 py-2 text-xs font-semibold text-white">Delete</button></div>}
              </div>
            </>
          )}
        </form>
      )}
    </section>
  )
}

