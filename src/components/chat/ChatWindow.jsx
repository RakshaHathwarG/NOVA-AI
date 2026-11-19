import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import ParticleField from '../effects/ParticleField'
import AvatarEngine from '../avatar/AvatarEngine'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import LanguageSelector from './LanguageSelector'
import SessionBriefPanel from './SessionBriefPanel'
import SessionBriefRenderBoundary from './SessionBriefRenderBoundary'
import { QUICK_PROMPTS } from '../../utils/mockAssistant'
import { detectLanguage } from '../../utils/languageDetect'
import { detectEmotion } from '../../utils/emotionEngine'
import { VOICE_LANGUAGE_CODES } from '../../data/avatarPersonas'
import { getPreferences } from '../../utils/preferences'
import { chatApi } from '../../services/api'

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * ChatWindow — shared chat surface for both assistant pages.
 * `role` carries the existing tag/label metadata used elsewhere; `persona`
 * carries the Avatar Engine identity (Aria / Snow) and drives the avatar,
 * greeting line, and voice.
 */
export default function ChatWindow({ role, persona }) {
  const [searchParams] = useSearchParams()
  const initialConversationId = useRef(searchParams.get('conversationId'))
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputEnabled, setInputEnabled] = useState(false)
  const [hasConversation, setHasConversation] = useState(false)
  const [language, setLanguage] = useState(() => getPreferences().language)
  const [persistenceError, setPersistenceError] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [failedTurn, setFailedTurn] = useState(null)
  const scrollRef = useRef(null)
  const avatarRef = useRef(null)
  const [conversationId, setConversationId] = useState(() => initialConversationId.current || crypto.randomUUID())
  const hasSavedMessages = useRef(false)
  const sendLockRef = useRef(false)

  const backendRole = role.id === 'hr' ? 'HR' : role.id === 'support' ? 'Customer Support' : 'General'

  useEffect(() => {
    let active = true
    chatApi.getHistory(backendRole)
      .then(({ chats = [] }) => {
        if (!active) return
        const requestedId = initialConversationId.current
        const requestedExists = requestedId && chats.some((chat) => chat.conversationId === requestedId)
        if (requestedId && !requestedExists) {
          setHasConversation(false)
          setMessages([])
          setPersistenceError('That saved conversation is not available in this account.')
          return
        }
        const latestId = requestedId || chats.at(-1)?.conversationId
        if (latestId) {
          const saved = chats.filter((chat) => chat.conversationId === latestId)
          hasSavedMessages.current = saved.length > 0
          setHasConversation(saved.length > 0)
          setConversationId(latestId)
          setMessages(saved.map((chat) => ({
            role: chat.sender,
            text: chat.message,
            video: chat.videoReference,
            file: chat.attachment ? { name: chat.attachment.name } : null,
            timestamp: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })))
        }
      })
      .catch(() => { if (active) setPersistenceError('Chat history could not be loaded. Check your connection and sign in again.') })
    return () => { active = false }
  }, [backendRole])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  function handleGreetingStart() {
    if (!hasSavedMessages.current) {
      setMessages([{ role: 'assistant', text: persona.greeting, timestamp: timestamp() }])
    }
  }

  function handleGreetingEnd() {
    setInputEnabled(true)
  }

  async function handleSend(data, retryRequestId = null) {
    if (sendLockRef.current) return
    sendLockRef.current = true

    const requestId = retryRequestId || crypto.randomUUID()
    const detected = data.text ? detectLanguage(data.text) : null
    const activeLanguage = detected || language
    if (detected && detected !== language) setLanguage(detected)

    const userMsg = {
      role: 'user',
      text: data.text,
      file: data.file,
      timestamp: timestamp(),
    }
    if (!retryRequestId) setMessages((previous) => [...previous, userMsg])
    setFailedTurn(null)
    setGenerationError('')
    setIsTyping(true)
    avatarRef.current?.setListening()

    const emotion = detectEmotion(data.text || '')
    try {
      const result = await chatApi.generate({
        role: backendRole,
        message: data.text,
        conversationId,
        requestId,
        language: detected || (language !== 'English' ? language : ''),
        attachment: data.attachment ? {
          name: data.attachment.name,
          mimeType: data.attachment.mimeType,
          base64: data.attachment.dataUrl,
        } : undefined,
      })
      const reply = result.reply?.message
      if (!reply) throw new Error('The AI service returned an empty reply.')
      setHasConversation(true)
      hasSavedMessages.current = true
      setPersistenceError('')
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: reply,
          video: result.reply?.videoReference,
          timestamp: timestamp(),
        },
      ])

      const preferences = getPreferences()
      if (preferences.notificationsEnabled && document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        try { new Notification('NOVA AI · ' + role.name, { body: reply.slice(0, 140) }) } catch { /* Browser may block notifications outside its active page. */ }
      }
      avatarRef.current?.speak(
        reply,
        emotion,
        { lang: VOICE_LANGUAGE_CODES[activeLanguage] || 'en-US' },
      )
    } catch (error) {
      setGenerationError(error.message || 'The AI could not answer. Please try again.')
      setFailedTurn({ data, requestId })
    } finally {
      setIsTyping(false)
      sendLockRef.current = false
    }
  }
  function handleReset() {
    if (initialConversationId.current) navigate(location.pathname, { replace: true })
    initialConversationId.current = null
    setConversationId(crypto.randomUUID())
    setHasConversation(false)
    hasSavedMessages.current = false
    setMessages([{ role: 'assistant', text: persona.greeting, timestamp: timestamp() }])
    avatarRef.current?.setEmotion('smiling')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:min-h-[calc(100dvh-160px)]">
      {/* Avatar stage panel */}
      <GlassCard glow={role.accent} className="relative overflow-hidden p-6 h-fit lg:sticky lg:top-8">
        <div className="absolute inset-0 -z-0 opacity-70">
          <ParticleField density={26} className="absolute inset-0 h-full w-full" />
        </div>
        <div className="relative z-10">
          <AvatarEngine
            ref={avatarRef}
            persona={persona}
            // The boot greeting always plays in English since it happens
            // before the user has sent any message to detect a language
            // from. Every reply after that is spoken in the detected
            // language via the `lang` override passed to avatarRef.speak().
            language="en-US"
            onGreetingStart={handleGreetingStart}
            onGreetingEnd={handleGreetingEnd}
          />
          <div className="border-t border-white/10 pt-5 mt-4">
            <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">Domain expertise</p>
            <div className="flex flex-wrap gap-2">
              {role.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-ink-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Chat panel */}
      <GlassCard className="flex flex-col h-[68dvh] min-h-[520px] lg:h-[calc(100dvh-160px)] lg:min-h-[560px] p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">{role.name}</h2>
            <p className="text-xs text-ink-faint">
              {inputEnabled ? 'Send a message to generate an AI response' : 'Avatar is initializing…'}
            </p>
            {persistenceError && <p role="alert" className="mt-1 text-xs text-amber-300">{persistenceError}</p>}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector value={language} onChange={setLanguage} />
            <button
              onClick={handleReset}
              disabled={!inputEnabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
              aria-label="Reset conversation"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        <div className="border-b border-white/10 px-5 py-3"><SessionBriefRenderBoundary key={conversationId}><SessionBriefPanel role={backendRole} conversationId={conversationId} enabled={hasConversation} /></SessionBriefRenderBoundary></div>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} text={m.text} file={m.file} video={m.video} timestamp={m.timestamp} accent={role.accent} />
          ))}
          {isTyping && <TypingIndicator />}
          {generationError && <div role='alert' className='rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200'>{generationError}</div>}
        </div>

        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {(QUICK_PROMPTS[role.id]?.[language]||QUICK_PROMPTS[role.id]?.English||[]).map((prompt) => (
              <motion.button
                key={prompt}
                whileHover={{ y: -2 }}
                onClick={() => handleSend({ text: prompt, file: null, attachment: null })}
                disabled={!inputEnabled}
                className="rounded-full glass px-3 py-1.5 text-xs text-ink-muted hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          {failedTurn && <button type='button' onClick={() => handleSend(failedTurn.data, failedTurn.requestId)} disabled={isTyping} className='mb-2 rounded-lg border border-red-300/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-300/10 disabled:opacity-40'>Retry the same message</button>}
          <ChatInput
            onSend={handleSend}
            disabled={isTyping || !inputEnabled}
            accent={role.accent}
            lang={VOICE_LANGUAGE_CODES[language] || 'en-US'}
          />
        </div>
      </GlassCard>
    </div>
  )
}



