import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import ParticleField from '../effects/ParticleField'
import AvatarEngine from '../avatar/AvatarEngine'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import LanguageSelector from './LanguageSelector'
import { getReply, QUICK_PROMPTS, LANGUAGE_PROMPT } from "../../utils/mockAssistant";
import { detectLanguage } from '../../utils/languageDetect'
import { detectEmotion } from '../../utils/emotionEngine'
import { VOICE_LANGUAGE_CODES } from '../../data/avatarPersonas'

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
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputEnabled, setInputEnabled] = useState(false)
  const [language, setLanguage] = useState('English')
  const scrollRef = useRef(null)
  const avatarRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  function handleGreetingStart() {
    setMessages([{ role: 'assistant', text: persona.greeting, timestamp: timestamp() }])
  }

  function handleGreetingEnd() {
    setInputEnabled(true)
  }

   function handleSend(data) {
    const userMsg = { role: 'user', text: data.text, file: data.file, timestamp: timestamp() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    avatarRef.current?.setListening()

    // Detect the language of this specific message and switch immediately —
    // every message is evaluated independently so mid-conversation language
    // switches are picked up right away. A message with no text (e.g. a
    // file-only send) keeps whatever language is already active.
    const detected = data.text ? detectLanguage(data.text) : null
    const activeLanguage = detected || language

    if (data.text && !detected) {
      // Language couldn't be confidently determined — ask, rather than guess.
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', text: LANGUAGE_PROMPT, timestamp: timestamp() }])
      avatarRef.current?.speak(LANGUAGE_PROMPT, 'confused', { lang: 'en-US' })
      return
    }

    if (detected && detected !== language) {
      setLanguage(detected)
    }

    const emotion = detectEmotion(data.text)

    setTimeout(() => {
      const reply = getReply(role.id, data.text, activeLanguage)
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', text: reply, timestamp: timestamp() }])
      avatarRef.current?.speak(reply, emotion, { lang: VOICE_LANGUAGE_CODES[activeLanguage] || 'en-US' })
    }, 900 + Math.random() * 400)
  }

  function handleReset() {
    setMessages([{ role: 'assistant', text: persona.greeting, timestamp: timestamp() }])
    avatarRef.current?.setEmotion('smiling')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] min-h-[calc(100vh-140px)]">
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
      <GlassCard className="flex flex-col h-[calc(100vh-140px)] max-h-[720px] p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">{role.name}</h2>
            <p className="text-xs text-ink-faint">
              {inputEnabled ? 'Responses are simulated for this demo experience' : 'Avatar is initializing…'}
            </p>
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

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} text={m.text} file={m.file} timestamp={m.timestamp} accent={role.accent} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {(QUICK_PROMPTS[role.id]?.[language]||QUICK_PROMPTS[role.id]?.English||[]).map((prompt) => (
              <motion.button
                key={prompt}
                whileHover={{ y: -2 }}
                onClick={() => handleSend({ text:prompt, file: null})}
                disabled={!inputEnabled}
                className="rounded-full glass px-3 py-1.5 text-xs text-ink-muted hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
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
