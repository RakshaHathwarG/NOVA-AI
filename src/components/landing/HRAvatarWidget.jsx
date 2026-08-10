import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Mic, ChevronDown } from 'lucide-react'
import hrAvatarImg from '../../assets/avatars/hr_avatar_nova.png'

/* ─── Quick-reply chips shown on open ─── */
const QUICK_REPLIES = [
  'What are the leave policies?',
  'How do I submit a request?',
  'Tell me about benefits',
  'Performance review process',
]

/* ─── Canned responses for demo ─── */
const RESPONSES = {
  default:
    "Hi! I'm Nova, your AI HR guide. I can help with company policies, benefits, leave management, and more. How can I assist you today?",
  leave:
    "Our leave policy includes 20 days of paid annual leave, 10 sick days, and flexible personal days. Would you like to know more about the application process?",
  submit:
    "To submit a request, navigate to the HR portal → My Requests → New Request. I can also guide you step-by-step. Which type of request are you submitting?",
  benefits:
    "We offer a comprehensive benefits package including health insurance, dental, vision, 401k with company matching, remote-work stipend, and wellness credits. Want details on any specific benefit?",
  performance:
    "Performance reviews happen bi-annually (June & December). Your manager will schedule a 1:1 review session. Self-assessments are due two weeks prior. Want a checklist to prepare?",
}

function getResponse(text) {
  const t = text.toLowerCase()
  if (t.includes('leave') || t.includes('vacation') || t.includes('time off')) return RESPONSES.leave
  if (t.includes('submit') || t.includes('request')) return RESPONSES.submit
  if (t.includes('benefit')) return RESPONSES.benefits
  if (t.includes('performance') || t.includes('review')) return RESPONSES.performance
  return "That's a great question! Let me pull the relevant HR policy for you. For the most accurate guidance, I recommend reaching out to your HR representative directly. Can I help with anything else?"
}

/* ─── Individual Chat Message ─── */
function ChatMessage({ msg }) {
  const isAgent = msg.role === 'agent'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      {isAgent && (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#00D9FF]/40 shadow-[0_0_12px_rgba(0,217,255,0.4)]">
          <img
            src={hrAvatarImg}
            alt="Nova HR Agent"
            className="h-full w-full object-cover object-top"
          />
          {/* Live status dot */}
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-[#0a0f1e] shadow-[0_0_6px_#34d399]" />
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
          isAgent
            ? 'rounded-bl-sm bg-white/[0.07] border border-white/10 text-slate-200 backdrop-blur-md'
            : 'rounded-br-sm bg-gradient-to-r from-[#8A2EFF] to-[#00D9FF] text-white shadow-[0_0_20px_rgba(0,217,255,0.3)]'
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  )
}

/* ─── Typing Indicator ─── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2.5"
    >
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#00D9FF]/40">
        <img src={hrAvatarImg} alt="Nova" className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/[0.07] border border-white/10 px-4 py-3 backdrop-blur-md">
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#00D9FF]"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.8, delay }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main Widget ─── */
export default function HRAvatarWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 0, role: 'agent', text: RESPONSES.default },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pulse, setPulse] = useState(true)
  const bottomRef = useRef(null)

  // Stop the launch pulse after first open
  useEffect(() => {
    if (open) setPulse(false)
  }, [open])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function sendMessage(text) {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'agent', text: getResponse(text) },
      ])
    }, 1400)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-[360px] rounded-3xl border border-white/10 bg-[#07091a]/95 shadow-[0_0_80px_rgba(0,217,255,0.18),0_30px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden"
            style={{ maxHeight: '560px' }}
          >
            {/* Ambient gradient blobs */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#8A2EFF]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#00D9FF]/15 blur-3xl" />

            {/* ── Panel Header ── */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5 bg-gradient-to-r from-[#0d0f2a]/80 to-[#07091a]/80">
              {/* Avatar + glow ring */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#00D9FF]/50 shadow-[0_0_20px_rgba(0,217,255,0.5)]">
                <img
                  src={hrAvatarImg}
                  alt="Nova HR Agent"
                  className="h-full w-full object-cover object-top"
                />
                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-[#07091a] shadow-[0_0_8px_#34d399]" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-white font-display tracking-wide">Nova — HR Guide</span>
                <span className="text-[11px] text-emerald-400 font-light flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Powered by NOVA Core
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 rounded-full border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2 py-0.5">
                  <Sparkles size={10} className="text-[#00D9FF]" />
                  <span className="text-[9px] font-semibold text-[#00D9FF] tracking-widest uppercase">AI</span>
                </div>
                <button
                  id="hr-widget-close"
                  onClick={() => setOpen(false)}
                  className="ml-1.5 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close HR widget"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Message Area ── */}
            <div className="flex flex-col gap-3 overflow-y-auto px-4 py-4" style={{ height: '320px' }}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* ── Quick Reply Chips ── */}
            {messages.length <= 1 && !typing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 px-4 pb-3"
              >
                {QUICK_REPLIES.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border border-[#8A2EFF]/40 bg-[#8A2EFF]/10 px-3 py-1 text-[11px] font-medium text-slate-300 transition-all duration-200 hover:border-[#8A2EFF]/80 hover:bg-[#8A2EFF]/20 hover:text-white"
                  >
                    {chip}
                  </button>
                ))}
              </motion.div>
            )}

            {/* ── Input Row ── */}
            <div className="relative border-t border-white/10 px-3 py-3 bg-[#0a0d20]/60">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] pl-4 pr-2 py-2 backdrop-blur-md focus-within:border-[#00D9FF]/40 transition-colors">
                <input
                  id="hr-widget-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Nova anything about HR…"
                  className="flex-1 bg-transparent text-[13px] text-slate-200 placeholder-slate-500 outline-none"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label="Voice input"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-[#00D9FF] transition-colors"
                  >
                    <Mic size={14} />
                  </button>
                  <button
                    id="hr-widget-send"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-[#8A2EFF] to-[#00D9FF] text-white shadow-[0_0_14px_rgba(0,217,255,0.4)] transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Send message"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-slate-600">Powered by NOVA AI · Responses may not cover all cases</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Trigger Button ── */}
      <div className="relative">
        {/* Pulse ring when chat is closed */}
        {pulse && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-[#00D9FF]/30" />
            <span className="absolute inset-0 rounded-full animate-ping bg-[#8A2EFF]/20 [animation-delay:0.4s]" />
          </>
        )}

        <motion.button
          id="hr-widget-fab"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close HR Assistant' : 'Open HR Assistant'}
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#00D9FF]/40 shadow-[0_0_40px_rgba(0,217,255,0.5),0_0_80px_rgba(138,46,255,0.3)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(0,217,255,0.7)]"
        >
          {/* Avatar image fills the FAB */}
          <img
            src={hrAvatarImg}
            alt="Open HR Assistant"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />

          {/* Gradient overlay rim */}
          <div className="absolute inset-0 rounded-full ring-2 ring-[#00D9FF]/50 bg-gradient-to-t from-[#8A2EFF]/40 via-transparent to-transparent pointer-events-none" />

          {/* Collapse indicator when open */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="collapse"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-[#07091a]/75 backdrop-blur-sm"
              >
                <ChevronDown size={22} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Online status badge on FAB */}
        {!open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#020511] shadow-[0_0_8px_#34d399]"
          />
        )}

        {/* Tooltip label */}
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="pointer-events-none absolute right-[72px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#07091a]/90 px-3 py-1.5 backdrop-blur-md shadow-lg"
          >
            <span className="text-[11px] font-medium text-slate-200">Ask Nova · HR Guide</span>
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rotate-45 border-r border-t border-white/10 bg-[#07091a]/90" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
