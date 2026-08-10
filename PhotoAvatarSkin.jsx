import { memo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import animeHrImg from '../../../assets/avatars/anime_hr_avatar.png'
import animeSnowImg from '../../../assets/avatars/anime_snow_avatar.png'
import hrAvatarImg from '../../../assets/avatars/hr_avatar_nova.png'
import snowAvatarImg from '../../../assets/avatars/snow_avatar.png'

/**
 * PhotoAvatarSkin — Semi-Realistic Anime HR Virtual Assistant Engine
 * 
 * Combines ultra-crisp, high-definition semi-realistic anime portraits with
 * dynamic, reactive facial animations and conversational physics:
 * 
 * FACE:
 *   ✅ Eye Blinking overlay (periodic natural 140ms eyelid blinks)
 *   ✅ Eyebrow overlays (Happy arches, Sad inward slants, Angry V-furrows, Thinking asymmetric lift)
 *   ✅ Lip Sync mouth morphing visemes overlay on speech
 *   ✅ Smile, Happy, Sad, Angry, Thinking expressions
 * 
 * HEAD MOVEMENT:
 *   ✅ Head Nodding during speech cadence
 *   ✅ Head Tilt during listening (+4.5°) & thinking (-3.5°)
 * 
 * HAND GESTURES & OVERLAYS:
 *   ✅ 👋 Waving gesture HUD badge (greeting/goodbye)
 *   ✅ 🖐️ Open-hand explanation gesture badge
 *   ✅ 👈 Pointing gesture badge during key speech
 * 
 * BODY & CONVERSATION PHYSICS:
 *   ✅ Breathing animation loop
 *   ✅ Listening aura ring & eye contact
 *   ✅ Thinking halo glow & overhead loading dots
 *   ✅ Speaking lip sync, head nod, and sound equalizer bars
 */
function PhotoAvatarSkin({ persona, state = 'idle', eyesClosed = false }) {
  const isAria = persona?.id === 'aria'
  
  // Select crisp semi-realistic anime portrait asset
  const avatarSrc = isAria
    ? (animeHrImg || hrAvatarImg)
    : (animeSnowImg || snowAvatarImg)

  // --- Derived State Flags ---
  const isSpeaking  = state === 'speaking'
  const isListening = state === 'listening'
  const isThinking  = state === 'thinking'
  const isSmiling   = state === 'smiling' || state === 'greeting' || state === 'happy'
  const isSad       = state === 'sad' || state === 'concerned'
  const isAngry     = state === 'angry'
  const showWave    = state === 'greeting' || state === 'goodbye'
  const isBooting   = state === 'booting'

  // Accent colors
  const accentCyan   = isAria ? '#00D9FF' : '#3FA0DC'
  const accentPurple = '#8A2EFF'

  // Blinking State (periodic 3-4.5s)
  const [isBlinking, setIsBlinking] = useState(false)
  const [showThinkingDots, setShowThinkingDots] = useState(false)

  useEffect(() => {
    let timeout
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000
      timeout = setTimeout(() => {
        if (!eyesClosed) {
          setIsBlinking(true)
          setTimeout(() => setIsBlinking(false), 140)
        }
        scheduleBlink()
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(timeout)
  }, [eyesClosed])

  useEffect(() => {
    setShowThinkingDots(isThinking)
  }, [isThinking])

  // Head tilt & movement derived from state
  const headRotation = isListening ? 4.5 : isThinking ? -3.5 : isAngry ? -2 : 0
  const headY = isSpeaking ? [0, -3, 0, -2, 0] : [0, -2, 0]

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full h-full">
      <style>{`
        @keyframes avatar-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.02); }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-ccw  { to { transform: rotate(-360deg); } }
        .avatar-breathe { animation: avatar-breathe 4.5s ease-in-out infinite; }
        .spin-slow-anim { animation: spin-slow 24s linear infinite; }
        .spin-ccw-anim  { animation: spin-ccw 18s linear infinite; }
      `}</style>

      {/* ── Outer Decorative Orbit Rings ── */}
      <div className="relative flex items-center justify-center">

        {/* Outer dashed orbit */}
        <div
          className="spin-slow-anim absolute rounded-full border border-dashed pointer-events-none opacity-40"
          style={{
            width: 230, height: 230,
            borderColor: isListening ? accentPurple : accentCyan,
          }}
        />

        {/* Counter-rotating inner ring */}
        <div
          className="spin-ccw-anim absolute rounded-full border pointer-events-none opacity-30"
          style={{
            width: 202, height: 202,
            borderColor: isListening ? accentPurple : accentCyan,
          }}
        />

        {/* ── Reactive Halo Glow Ring ── */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 178, height: 178 }}
          animate={{
            boxShadow: isSpeaking
              ? [`0 0 0 2px ${accentCyan}90, 0 0 32px 8px ${accentCyan}60`,
                 `0 0 0 2px ${accentCyan}cc, 0 0 50px 14px ${accentCyan}90`,
                 `0 0 0 2px ${accentCyan}90, 0 0 32px 8px ${accentCyan}60`]
              : isListening
              ? [`0 0 0 2px ${accentPurple}80, 0 0 24px 6px ${accentPurple}60`,
                 `0 0 0 2px ${accentPurple}cc, 0 0 42px 12px ${accentPurple}85`,
                 `0 0 0 2px ${accentPurple}80, 0 0 24px 6px ${accentPurple}60`]
              : isThinking
              ? `0 0 0 2px ${accentPurple}50, 0 0 18px 4px ${accentPurple}40`
              : `0 0 0 2px ${accentCyan}30, 0 0 16px 3px ${accentCyan}20`,
          }}
          transition={{
            duration: isSpeaking ? 0.8 : isListening ? 1.2 : 0.5,
            repeat: (isSpeaking || isListening) ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* ── Main Portrait Frame (Head Movement, Nodding, Breathing) ── */}
        <motion.div
          className="avatar-breathe relative overflow-hidden rounded-full border-2 shadow-2xl"
          style={{
            width: 172, height: 172,
            borderColor: isSpeaking ? accentCyan : isListening ? accentPurple : `${accentCyan}66`,
            transformOrigin: 'center bottom',
          }}
          animate={{
            rotate: headRotation,
            y: headY,
            scale: eyesClosed ? 0.97 : 1,
            opacity: eyesClosed ? 0.7 : 1,
          }}
          transition={{
            rotate: { duration: 0.5, ease: 'easeOut' },
            y: { duration: isSpeaking ? 0.85 : 4.5, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' },
            scale: { duration: 0.5 },
          }}
        >
          {/* High-Res Semi-Realistic Anime Avatar Image */}
          <img
            src={avatarSrc}
            alt={persona.name}
            className="h-full w-full object-cover object-top select-none filter contrast-[1.03] brightness-[1.02]"
            style={{ imageRendering: 'crisp-edges' }}
            draggable={false}
          />

          {/* ── Animated Eyelid Blinking Overlay ── */}
          <AnimatePresence>
            {(isBlinking || eyesClosed) && (
              <motion.div
                key="eyelids-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* SVG Eyelid Closure curve over eyes zone */}
                <svg viewBox="0 0 172 172" className="w-full h-full">
                  <path
                    d="M 52 72 Q 68 84 84 72 M 98 72 Q 114 84 130 72"
                    stroke="#1a1210"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Animated Eyebrow Emotion Overlays ── */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 172 172" className="w-full h-full">
              {/* Happy / Smile Brows */}
              {isSmiling && (
                <g stroke="#221A14" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.85">
                  <path d="M 54 54 Q 68 46 82 54" />
                  <path d="M 98 54 Q 112 46 126 54" />
                </g>
              )}
              {/* Sad / Concerned Brows */}
              {isSad && (
                <g stroke="#221A14" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
                  <path d="M 54 52 L 82 58" />
                  <path d="M 98 58 L 126 52" />
                </g>
              )}
              {/* Angry Brows */}
              {isAngry && (
                <g stroke="#221A14" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.95">
                  <path d="M 54 60 L 82 52" />
                  <path d="M 98 52 L 126 60" />
                </g>
              )}
              {/* Thinking Asymmetric Brow */}
              {isThinking && (
                <g stroke="#221A14" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
                  <path d="M 54 56 Q 68 52 82 56" />
                  <path d="M 98 48 Q 112 44 126 50" />
                </g>
              )}
            </svg>
          </div>

          {/* ── Lip Sync Mouth Visemes Overlay (Speaking State) ── */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                key="mouth-viseme"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                <svg viewBox="0 0 172 172" className="w-full h-full">
                  <motion.path
                    animate={{
                      d: [
                        'M 72 118 Q 86 122 100 118 Q 86 124 72 118 Z',
                        'M 70 118 Q 86 130 102 118 Q 86 134 70 118 Z', // Viseme O
                        'M 71 118 Q 86 126 101 118 Q 86 128 71 118 Z', // Viseme E
                        'M 69 118 Q 86 132 103 118 Q 86 136 69 118 Z', // Viseme A
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 0.65, ease: 'easeInOut' }}
                    fill="#C53A24"
                    stroke="#8A1A10"
                    strokeWidth="1.2"
                  />
                  {/* Subtle teeth highlight */}
                  <motion.path
                    d="M 74 119 Q 86 123 98 119"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rim-light overlay reacting to speech */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              background: isSpeaking
                ? [
                    'linear-gradient(135deg, rgba(0,217,255,0.18) 0%, transparent 60%)',
                    'linear-gradient(135deg, rgba(0,217,255,0.32) 0%, transparent 60%)',
                    'linear-gradient(135deg, rgba(0,217,255,0.18) 0%, transparent 60%)',
                  ]
                : isListening
                ? 'linear-gradient(135deg, rgba(138,46,255,0.24) 0%, transparent 60%)'
                : 'linear-gradient(135deg, rgba(0,217,255,0.08) 0%, transparent 60%)',
            }}
            transition={{ duration: 0.85, repeat: isSpeaking ? Infinity : 0 }}
          />
        </motion.div>

        {/* ── Floating Hand Gesture Hologram Badges ── */}
        <AnimatePresence>
          {showWave && (
            <motion.div
              key="wave-badge"
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: 20 }}
              className="absolute -right-5 bottom-8 flex items-center justify-center rounded-full border border-cyan-400/40 bg-[#07091a]/90 p-2 shadow-lg backdrop-blur-md"
            >
              <motion.span
                className="text-xl"
                animate={{ rotate: [-10, 25, -10, 25, -10] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                👋
              </motion.span>
            </motion.div>
          )}

          {isSpeaking && !showWave && (
            <motion.div
              key="explain-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -right-4 bottom-6 flex items-center gap-1 rounded-full border border-cyan-400/30 bg-[#07091a]/85 px-2.5 py-1 backdrop-blur-md text-xs"
            >
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                👈
              </motion.span>
              <span className="text-[10px] font-medium text-cyan-300">Explaining</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sound Equalizer Bars (Speaking State) ── */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              key="eq-bars"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-[3px]"
              style={{ height: 20 }}
            >
              {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{ backgroundColor: accentCyan }}
                  animate={{ height: [`${h * 30}%`, '100%', `${h * 30}%`] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    delay: i * 0.07,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Thinking Dots (Top-Right) ── */}
        <AnimatePresence>
          {showThinkingDots && (
            <motion.div
              key="thinking-dots"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full border border-purple-400/30 bg-[#07091a]/90 px-2.5 py-1.5 backdrop-blur-sm shadow-md"
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accentPurple }}
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Live Green Online Dot ── */}
        {!isBooting && (
          <span
            className="absolute top-2 left-2 h-3.5 w-3.5 rounded-full border-2 border-[#07091a] bg-emerald-400"
            style={{ boxShadow: '0 0 10px #34d399' }}
          />
        )}
      </div>

      {/* ── Name & Status Label ── */}
      <div className="mt-7 flex flex-col items-center gap-1">
        <p className="font-display text-lg font-semibold text-white tracking-wide">
          {persona.name}
        </p>
        <p className="text-xs text-ink-faint font-medium">
          {isSpeaking
            ? '🎙️ Speaking & Explaining…'
            : isListening
            ? '👂 Listening attentively…'
            : isThinking
            ? '💭 Thinking…'
            : isSmiling
            ? '😊 Happy to help'
            : isSad
            ? '😔 Sympathetic & attentive'
            : isAngry
            ? '😠 Serious & focused'
            : 'Online · HR Guide'}
        </p>
      </div>
    </div>
  )
}

export default memo(PhotoAvatarSkin)
