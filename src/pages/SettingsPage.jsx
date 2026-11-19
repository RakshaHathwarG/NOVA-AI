import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bell, ChevronDown, Globe, LogOut, Mic, Shield, UserRound } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import PageTransition from '../components/effects/PageTransition'
import GlassCard from '../components/ui/GlassCard'
import { useAuth } from '../context/AuthContext'
import { getPreferences, savePreferences } from '../utils/preferences'

const LANGUAGES = ['English', 'Hindi', 'Japanese', 'Korean', 'Spanish']

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [preferences, setPreferences] = useState(getPreferences)
  const [notificationMessage, setNotificationMessage] = useState('')
  const activeTab = searchParams.get('tab') === 'voice' ? 'voice' : 'account'

  function updatePreference(update) {
    setPreferences(savePreferences(update))
  }

  async function toggleNotifications() {
    setNotificationMessage('')
    if (preferences.notificationsEnabled) {
      updatePreference({ notificationsEnabled: false })
      return
    }
    if (!('Notification' in window)) {
      setNotificationMessage('This browser does not support notifications.')
      return
    }
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
    if (permission === 'granted') updatePreference({ notificationsEnabled: true })
    else setNotificationMessage('Allow notifications in your browser settings to turn this on.')
  }

  function signOut() {
    logout()
    navigate('/login')
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="mb-7">
          <h1 className="mb-2 text-2xl font-semibold text-white md:text-3xl">Settings</h1>
          <p className="text-sm text-ink-muted">Manage your account and assistant preferences.</p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-white/10 pb-3" role="tablist" aria-label="Settings sections">
          {[
            { id: 'account', label: 'Account' },
            { id: 'voice', label: 'Voice & language' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setSearchParams(tab.id === 'voice' ? { tab: 'voice' } : {})}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-violet-500/20 text-white' : 'text-ink-muted hover:bg-white/5 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'account' ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <GlassCard className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-nova-gradient-soft">
                <UserRound size={18} className="text-nova-cyan" />
              </div>
              <h2 className="mb-1 text-base font-semibold text-white">Profile</h2>
              <p className="mb-5 text-sm text-ink-muted">Your signed-in account details.</p>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-xs text-ink-faint">Name</dt><dd className="mt-1 text-white">{user?.name || '—'}</dd></div>
                <div><dt className="text-xs text-ink-faint">Email</dt><dd className="mt-1 break-all text-white">{user?.email || '—'}</dd></div>
              </dl>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-nova-gradient-soft">
                <Shield size={18} className="text-nova-cyan" />
              </div>
              <h2 className="mb-1 text-base font-semibold text-white">Session security</h2>
              <p className="mb-5 text-sm text-ink-muted">End this session when you are finished using NOVA AI.</p>
              <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/10">
                <LogOut size={15} /> Log out
              </button>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-nova-gradient-soft">
                <Bell size={18} className="text-nova-cyan" />
              </div>
              <h2 className="mb-1 text-base font-semibold text-white">Reply notifications</h2>
              <p className="mb-5 text-sm text-ink-muted">Get a browser alert when an assistant replies while this tab is in the background.</p>
              <button type="button" role="switch" aria-checked={preferences.notificationsEnabled} onClick={toggleNotifications} className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${preferences.notificationsEnabled ? 'border-violet-400/40 bg-violet-500/10 text-white' : 'border-white/10 text-ink-muted hover:bg-white/5'}`}>
                {preferences.notificationsEnabled ? 'Notifications are on' : 'Turn on notifications'}
              </button>
              {notificationMessage && <p role="status" className="mt-3 text-xs text-amber-200">{notificationMessage}</p>}
            </GlassCard>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <GlassCard className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-nova-gradient-soft">
                <Globe size={18} className="text-nova-cyan" />
              </div>
              <label htmlFor="nova-language" className="mb-1 block text-base font-semibold text-white">Default language</label>
              <p className="mb-5 text-sm text-ink-muted">Used as the starting language in new assistant chats.</p>
              <div className="relative"><select id="nova-language" value={preferences.language} onChange={(event) => updatePreference({ language: event.target.value })} className="relative z-10 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#111225] px-3 py-3 pr-10 text-sm text-white outline-none pointer-events-auto focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20">
                {LANGUAGES.map((language) => <option key={language} value={language}>{language}</option>)}
              </select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 text-ink-muted" size={16} /></div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-nova-gradient-soft">
                <Mic size={18} className="text-nova-cyan" />
              </div>
              <h2 className="mb-1 text-base font-semibold text-white">Voice responses</h2>
              <p className="mb-5 text-sm text-ink-muted">Control spoken assistant replies. Text replies remain available when voice is off.</p>
              <button type="button" role="switch" aria-checked={preferences.voiceEnabled} onClick={() => updatePreference({ voiceEnabled: !preferences.voiceEnabled })} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${preferences.voiceEnabled ? 'border-violet-400/40 bg-violet-500/10 text-white' : 'border-white/10 bg-white/[0.03] text-ink-muted'}`}>
                <span>{preferences.voiceEnabled ? 'Voice is on' : 'Voice is off'}</span>
                <span className={`relative h-6 w-11 rounded-full transition-colors ${preferences.voiceEnabled ? 'bg-violet-500' : 'bg-white/20'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${preferences.voiceEnabled ? 'translate-x-6' : 'translate-x-1'}`} /></span>
              </button>
              <label htmlFor="nova-speech-rate" className="mb-2 mt-5 flex justify-between text-xs text-ink-muted"><span>Speech speed</span><span>{preferences.speechRate.toFixed(1)}×</span></label>
              <input id="nova-speech-rate" type="range" min="0.8" max="1.2" step="0.1" value={preferences.speechRate} disabled={!preferences.voiceEnabled} onChange={(event) => updatePreference({ speechRate: Number(event.target.value) })} className="w-full accent-violet-400 disabled:opacity-40" />
            </GlassCard>
          </div>
        )}
        <p className="mt-5 text-xs text-ink-faint">Preferences are saved in this browser and applied to assistant chats.</p>
      </PageTransition>
    </AppLayout>
  )
}
