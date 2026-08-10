import { memo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * InteractiveAvatarSkin — Ponytail Anime HR Virtual Assistant Engine
 * 
 * Key Upgrades:
 * 1. 💇 Stylish Ponytail Hairstyle:
 *    High anime ponytail with flowing hair locks, a decorative cyan/gold hair tie ribbon,
 *    face-framing side bangs, and realistic hair shine.
 * 
 * 2. 👔 100% Unified Suit & Shoulder Anatomy (Zero Detachment):
 *    The blazer torso, shoulders, and arm sleeves form ONE continuous, solid suit jacket path.
 *    Shoulders cannot break or separate. Hand gestures pivot naturally from forearm joints.
 * 
 * 3. 👄 Ultra-Fluid Lip Sync & Face Mechanics:
 *    Natural dual-lip structure, inner teeth highlight, smooth visemes, eye gaze, and blinks.
 */
function InteractiveAvatarSkin({ persona, state = 'idle', eyesClosed = false }) {
  const isAria = persona?.id === 'aria'

  // Curated premium HSL color palette
  const palette = isAria
    ? {
        blazer: '#182442',
        blazerShadow: '#0E172C',
        blazerHighlight: '#2A3C66',
        lapel: '#223259',
        shirt: '#FFFFFF',
        hair: '#1B1416',
        hairHighlight: '#382A2E',
        hairTie: '#00D9FF',
        skin: '#F7E1D5',
        skinShadow: '#E6C0B0',
        blush: '#E89C8C',
        lipUpper: '#B83B26',
        lipLower: '#C84B31',
        lipInner: '#5E180E',
        brow: '#251B18',
        eyeliner: '#1C1310',
        irisOuter: '#4A3228',
        irisInner: '#8C5A47',
        accentCyan: '#00D9FF',
        accentPurple: '#8A2EFF',
      }
    : {
        blazer: '#246B99',
        blazerShadow: '#164869',
        blazerHighlight: '#3B8BBE',
        lapel: '#1D5A83',
        shirt: '#F4FAFF',
        hair: '#4A2E1F',
        hairHighlight: '#734A34',
        hairTie: '#3FA0DC',
        skin: '#F8E2D6',
        skinShadow: '#E8C2B2',
        blush: '#EA9E8F',
        lipUpper: '#BC3A2E',
        lipLower: '#CC463B',
        lipInner: '#601A12',
        brow: '#362116',
        eyeliner: '#24160E',
        irisOuter: '#3B5940',
        irisInner: '#65916B',
        accentCyan: '#3FA0DC',
        accentPurple: '#8A2EFF',
      }

  // State derivations
  const isSpeaking  = state === 'speaking'
  const isListening = state === 'listening'
  const isThinking  = state === 'thinking'
  const isSmiling   = state === 'smiling' || state === 'greeting' || state === 'happy'
  const isSad       = state === 'sad' || state === 'concerned'
  const isAngry     = state === 'angry'
  const showWave    = state === 'greeting' || state === 'goodbye'
  const isBooting   = state === 'booting'

  // Blinking state (periodic 3–4.5s)
  const [isBlinking, setIsBlinking] = useState(false)
  const [gaze, setGaze] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let timeout
    const scheduleBlink = () => {
      const delay = 2800 + Math.random() * 2200
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

  // Gaze logic based on state
  useEffect(() => {
    if (isThinking) {
      setGaze({ x: 2, y: -3.5 })
      return
    }
    if (isListening || isSpeaking) {
      setGaze({ x: 0, y: 0 })
      return
    }
    let timeout
    const scheduleShift = () => {
      const delay = 2400 + Math.random() * 2600
      timeout = setTimeout(() => {
        setGaze({
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 1.8,
        })
        scheduleShift()
      }, delay)
    }
    scheduleShift()
    return () => clearTimeout(timeout)
  }, [isThinking, isListening, isSpeaking])

  // Head tilt & movement
  const headTilt = isListening ? 4.5 : isThinking ? -3.5 : isAngry ? -2 : 0
  const headX = gaze.x * 0.4

  // --- Dynamic Eyebrow Curves ---
  const getLeftBrowD = () => {
    if (isAngry)    return 'M 108 116 L 140 124' // Furrowed angled down
    if (isSad)      return 'M 108 124 L 140 116' // Inward slanted up
    if (isSmiling)  return 'M 108 114 Q 124 104 140 113' // High graceful arch
    if (isThinking) return 'M 108 117 Q 124 111 140 116' // Pensive
    return 'M 108 116 Q 124 108 140 115' // Default elegant arch
  }

  const getRightBrowD = () => {
    if (isAngry)    return 'M 180 124 L 212 116' // Furrowed angled down
    if (isSad)      return 'M 180 116 L 212 124' // Inward slanted up
    if (isSmiling)  return 'M 180 113 Q 196 104 212 114' // High graceful arch
    if (isThinking) return 'M 180 106 Q 196 100 212 107' // Asymmetric lift!
    return 'M 180 115 Q 196 108 212 116' // Default elegant arch
  }

  // --- Realistic Dual-Lip Mouth Path ---
  const getMouthInnerD = () => {
    if (isSmiling || state === 'greeting') {
      return 'M 134 186 Q 160 206 186 186 Q 160 194 134 186 Z'
    }
    if (isSad) {
      return 'M 138 193 Q 160 185 182 193 Q 160 188 138 193 Z'
    }
    if (isAngry) {
      return 'M 140 190 Q 160 186 180 190 Q 160 188 140 190 Z'
    }
    if (isThinking) {
      return 'M 142 189 Q 160 185 178 189 Q 160 192 142 189 Z'
    }
    return 'M 138 187 Q 160 193 182 187 Q 160 194 138 187 Z'
  }

  const eyeScaleY = eyesClosed || isBlinking ? 0.06 : 1

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* ── Stage Ring & Reactive Glow Halo ── */}
      <div className="relative flex items-center justify-center w-full max-w-[320px] aspect-square">
        
        {/* Glow Halo around Avatar */}
        <motion.div
          className="absolute inset-2 rounded-full pointer-events-none transition-all duration-500"
          animate={{
            boxShadow: isSpeaking
              ? `0 0 36px 8px ${palette.accentCyan}60`
              : isListening
              ? `0 0 36px 8px ${palette.accentPurple}66`
              : isThinking
              ? `0 0 24px 4px ${palette.accentPurple}35`
              : `0 0 16px 2px ${palette.accentCyan}20`,
          }}
        />

        {/* Outer Orbit Dashed Ring */}
        <div
          className="absolute inset-0 rounded-full border border-dashed pointer-events-none opacity-30 animate-[spin_24s_linear_infinite]"
          style={{ borderColor: isListening ? palette.accentPurple : palette.accentCyan }}
        />

        {/* ── Master Vector Canvas (Canvas bounds 0 0 320 460) ── */}
        <svg
          viewBox="0 0 320 460"
          className="w-full h-full object-contain filter drop-shadow-xl"
          aria-hidden="true"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Soft Skin Blush Gradient */}
            <radialGradient id="blush-grad-pt" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={palette.blush} stopOpacity="0.4" />
              <stop offset="100%" stopColor={palette.blush} stopOpacity="0" />
            </radialGradient>

            {/* Anime Eye Iris Gradient */}
            <radialGradient id="iris-grad-pt" cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor={palette.irisInner} />
              <stop offset="100%" stopColor={palette.irisOuter} />
            </radialGradient>
          </defs>

          {/* ── PONYTAIL BACK LAYER (Flows behind right shoulder) ── */}
          <motion.g
            animate={{
              rotate: [0, 1.5, 0, -1.5, 0],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '202px 95px' }}
          >
            {/* Ponytail Hair Flow */}
            <path
              d="M 202 92 C 248 95 272 135 260 195 C 248 240 220 270 205 285 C 210 240 230 185 202 105 Z"
              fill={palette.hair}
            />
            {/* Ponytail Shine Highlight */}
            <path
              d="M 215 115 C 240 135 250 170 242 210"
              stroke={palette.hairHighlight}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            {/* Decorative Ponytail Hair Ribbon / Tie */}
            <rect x="194" y="86" width="16" height="12" rx="4" fill={palette.hairTie} />
            <path d="M 198 98 L 192 115 L 202 110 L 206 98 Z" fill={palette.hairTie} opacity="0.85" />
          </motion.g>

          {/* ── Main Avatar Group (Head + Body + Arms) ── */}
          <motion.g
            animate={{
              rotate: [headTilt - 0.25, headTilt + 0.25, headTilt - 0.25],
              y: isSpeaking ? [0, -3, 0, -2, 0] : [0, -2.5, 0],
              x: headX,
            }}
            transition={{
              rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: isSpeaking ? 0.85 : 4.5, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 0.6, ease: 'easeOut' },
            }}
            style={{ transformOrigin: '160px 310px' }}
          >
            {/* ── UNIFIED SOLID BLAZER TORSO & SHOULDERS (Zero Detachment!) ── */}
            <motion.g
              animate={{ scaleY: [1, 1.018, 1] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '160px 460px' }}
            >
              {/* Single Solid Suit Jacket Body (Torso + Shoulders + Sleeves in ONE seamless path) */}
              <path
                d="M 52 460 L 55 310 C 58 244 90 224 160 220 C 230 224 262 244 265 310 L 268 460 Z"
                fill={palette.blazer}
              />

              {/* Shirt Base & Collar */}
              <path
                d="M 122 226 L 160 250 L 198 226 L 198 238 L 160 266 L 122 238 Z"
                fill={palette.shirt}
              />

              {/* Lapels */}
              <path
                d="M 90 310 L 134 228 L 160 242 L 112 322 Z"
                fill={palette.blazerHighlight}
                opacity="0.9"
              />
              <path
                d="M 230 310 L 186 228 L 160 242 L 208 322 Z"
                fill={palette.blazerShadow}
                opacity="0.45"
              />

              {/* Sleeve Folds & Seams (Integrated directly into suit body) */}
              <path d="M 88 232 C 76 270 78 350 82 460" stroke={palette.blazerShadow} strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M 232 232 C 244 270 242 350 238 460" stroke={palette.blazerShadow} strokeWidth="2" fill="none" opacity="0.6" />

              {/* Shirt Placket Accent */}
              <line x1="160" y1="250" x2="160" y2="340" stroke="#DDD" strokeWidth="1.8" strokeLinecap="round" />
            </motion.g>

            {/* ── LEFT FOREARM & HAND (Pivots naturally from elbow, shoulders 100% fixed) ── */}
            <motion.g
              animate={
                isSpeaking
                  ? { rotate: [-1, 5, -1], y: [0, -2, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '88px 330px' }} // Pivot inside sleeve!
            >
              {/* Forearm & Cuff */}
              <path d="M 78 340 L 92 410 L 104 408 L 94 340 Z" fill={palette.blazerShadow} />
              {/* Hand */}
              <ellipse cx="98" cy="416" rx="10" ry="14" fill={palette.skin} />
            </motion.g>

            {/* ── RIGHT FOREARM & HAND (Waving / Pointing / Explaining, 100% attached) ── */}
            <motion.g
              initial={{ rotate: 0 }}
              animate={{
                rotate: showWave
                  ? [-6, 26, -6, 26, -6]
                  : isSpeaking
                  ? [2, 12, 2, 14, 2]
                  : 0,
                y: showWave ? [0, -6, 0] : isSpeaking ? [0, -3, 0] : 0,
              }}
              transition={{
                rotate: { duration: showWave ? 1.4 : 2.2, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: showWave ? 1.4 : 2.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ transformOrigin: '232px 330px' }} // Pivot inside sleeve!
            >
              {/* Forearm & Cuff */}
              <path
                d={
                  isSpeaking && !showWave
                    ? 'M 242 340 L 250 405 L 236 405 L 226 340 Z'
                    : 'M 242 340 L 232 410 L 220 410 L 226 340 Z'
                }
                fill={palette.blazerHighlight}
              />

              {/* Right Hand */}
              <ellipse cx={isSpeaking && !showWave ? 244 : 226} cy={isSpeaking && !showWave ? 408 : 416} rx="10" ry="14" fill={palette.skin} />

              {/* Natural Waving Fingers */}
              {showWave && (
                <g stroke={palette.skin} strokeWidth="4.5" strokeLinecap="round">
                  <line x1="218" y1="406" x2="212" y2="392" />
                  <line x1="224" y1="404" x2="221" y2="388" />
                  <line x1="230" y1="404" x2="231" y2="388" />
                  <line x1="236" y1="407" x2="242" y2="392" />
                </g>
              )}

              {/* Natural Extended Index Finger for Explaining */}
              {isSpeaking && !showWave && (
                <g stroke={palette.skin} strokeWidth="4.5" strokeLinecap="round">
                  <line x1="244" y1="408" x2="260" y2="392" />
                </g>
              )}
            </motion.g>

            {/* ── Neck & Neck Shadow ── */}
            <rect x="143" y="195" width="34" height="42" rx="12" fill={palette.skin} />
            <path d="M 143 220 C 155 228 165 228 177 220 L 177 195 L 143 195 Z" fill={palette.skinShadow} opacity="0.4" />

            {/* ── Back Hair Layer ── */}
            <path
              d="M 85 160 C 75 100 110 50 160 48 C 210 50 245 100 235 160 C 235 200 225 235 210 250 L 205 175 C 205 135 185 115 160 115 C 135 115 115 135 115 175 L 110 250 C 95 235 85 200 85 160 Z"
              fill={palette.hair}
            />

            {/* ── Face Contour ── */}
            <path
              d="M 160 56 C 200 56 226 88 226 136 C 226 176 206 204 182 220 C 168 230 164 234 160 234 C 156 234 152 230 138 220 C 114 204 94 176 94 136 C 94 88 120 56 160 56 Z"
              fill={palette.skin}
            />

            {/* Soft Cheek Blush */}
            <ellipse cx="125" cy="162" rx="16" ry="10" fill="url(#blush-grad-pt)" />
            <ellipse cx="195" cy="162" rx="16" ry="10" fill="url(#blush-grad-pt)" />

            {/* Nose Contour */}
            <path
              d="M 159.5,146 C 161,156 162,164 160,170"
              stroke="#FFF"
              strokeOpacity="0.3"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="153" cy="171" rx="2" ry="1.2" fill="#000" opacity="0.08" />
            <ellipse cx="167" cy="171" rx="2" ry="1.2" fill="#000" opacity="0.08" />

            {/* ── Dynamic Eyebrows (Smooth Path Expressions) ── */}
            <motion.g transition={{ duration: 0.35, ease: 'easeInOut' }}>
              <motion.path
                d={getLeftBrowD()}
                stroke={palette.brow}
                strokeWidth="3.8"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d={getRightBrowD()}
                stroke={palette.brow}
                strokeWidth="3.8"
                strokeLinecap="round"
                fill="none"
              />
            </motion.g>

            {/* ── Native Anime Eyes & Gaze Group ── */}
            <motion.g
              animate={{ y: gaze.y, x: gaze.x }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Eyelid Crease */}
              <path d="M 114 122 Q 128 116 142 122" stroke="#000" strokeOpacity="0.15" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M 178 122 Q 192 116 206 122" stroke="#000" strokeOpacity="0.15" strokeWidth="1.6" fill="none" strokeLinecap="round" />

              {/* Sclera (Eye White) */}
              <motion.ellipse
                cx="128"
                cy="136"
                rx="12"
                ry="15"
                fill="#FEFDFB"
                animate={{ scaleY: eyeScaleY }}
                transition={{ duration: 0.12 }}
                style={{ transformOrigin: '128px 136px' }}
              />
              <motion.ellipse
                cx="192"
                cy="136"
                rx="12"
                ry="15"
                fill="#FEFDFB"
                animate={{ scaleY: eyeScaleY }}
                transition={{ duration: 0.12 }}
                style={{ transformOrigin: '192px 136px' }}
              />

              {/* Gradient Irises */}
              <ellipse cx="128" cy="138" rx="7.2" ry="8.8" fill="url(#iris-grad-pt)" opacity={isBlinking ? 0 : 1} />
              <ellipse cx="192" cy="138" rx="7.2" ry="8.8" fill="url(#iris-grad-pt)" opacity={isBlinking ? 0 : 1} />

              {/* Pupils */}
              <ellipse cx="128" cy="138" rx="4" ry="5.2" fill="#18100E" opacity={isBlinking ? 0 : 1} />
              <ellipse cx="192" cy="138" rx="4" ry="5.2" fill="#18100E" opacity={isBlinking ? 0 : 1} />

              {/* Catchlight Highlights */}
              <circle cx="131" cy="133" r="2.2" fill="#FFFFFF" opacity={isBlinking ? 0 : 0.95} />
              <circle cx="195" cy="133" r="2.2" fill="#FFFFFF" opacity={isBlinking ? 0 : 0.95} />
              <circle cx="125" cy="142" r="1.2" fill="#FFFFFF" opacity={isBlinking ? 0 : 0.75} />
              <circle cx="189" cy="142" r="1.2" fill="#FFFFFF" opacity={isBlinking ? 0 : 0.75} />

              {/* Top Lashes */}
              <path
                d="M 113 128 C 124 122 136 122 143 128 M 112 126 L 110 122 M 119 123 L 118 118"
                stroke={palette.eyeliner}
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 177 128 C 184 122 196 122 207 128 M 208 126 L 210 122 M 201 123 L 202 118"
                stroke={palette.eyeliner}
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            </motion.g>

            {/* ── Native Dual-Lip & Speech Visemes ── */}
            <motion.path
              d={getMouthInnerD()}
              animate={
                isSpeaking
                  ? {
                      d: [
                        'M 134 186 Q 160 194 186 186 Q 160 196 134 186 Z',
                        'M 132 186 Q 160 208 188 186 Q 160 212 132 186 Z', // Viseme O
                        'M 134 186 Q 160 198 186 186 Q 160 202 134 186 Z', // Viseme E
                        'M 130 186 Q 160 214 190 186 Q 160 218 130 186 Z', // Viseme A
                        'M 134 186 Q 160 194 186 186 Q 160 196 134 186 Z',
                      ],
                    }
                  : {}
              }
              transition={
                isSpeaking
                  ? { duration: 0.72, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.35 }
              }
              fill={palette.lipInner}
              stroke={palette.lipUpper}
              strokeWidth="1.4"
            />

            {/* Teeth Highlight Line */}
            <motion.path
              d="M 138 187 Q 160 191 182 187"
              stroke="#FEFDFB"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Upper Lip Accent Curve */}
            <path
              d="M 138 186 Q 148 183 160 185 Q 172 183 182 186"
              stroke={palette.lipUpper}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* ── Front Hair Layer (Bangs & Face Framing Strands) ── */}
            <path
              d="M 100 125 C 106 78 130 62 160 60 C 190 62 214 78 220 125 C 202 105 182 98 160 98 C 138 98 118 105 100 125 Z"
              fill={palette.hairHighlight}
            />

            {/* Thinking Overhead Dots */}
            {isThinking && (
              <g>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx={228 + i * 15}
                    cy={50}
                    r="5"
                    fill={palette.accentPurple}
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 0.95,
                      repeat: Infinity,
                      delay: i * 0.18,
                    }}
                  />
                ))}
              </g>
            )}
          </motion.g>
        </svg>

        {/* ── Sound Equalizer Bars (Speaking State) ── */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              key="sound-bars"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-[3px]"
              style={{ height: 22 }}
            >
              {[0.4, 0.75, 1, 0.85, 0.55, 0.95, 0.6].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{ backgroundColor: palette.accentCyan }}
                  animate={{ height: [`${h * 30}%`, '100%', `${h * 30}%`] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Green Online Badge */}
        {!isBooting && (
          <span
            className="absolute top-2 left-2 h-3.5 w-3.5 rounded-full border-2 border-[#07091a] bg-emerald-400"
            style={{ boxShadow: '0 0 10px #34d399' }}
          />
        )}
      </div>

      {/* Persona Label & Reactive Text */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="font-display text-base font-semibold text-white tracking-wide">
          {persona.name}
        </p>
        <p className="text-xs text-ink-faint font-medium">
          {isSpeaking
            ? '🎙️ Speaking & Explaining…'
            : isListening
            ? '👂 Listening attentively…'
            : isThinking
            ? '💭 Processing response…'
            : isSmiling
            ? '😊 Happy to assist'
            : isSad
            ? '😔 Sympathetic & attentive'
            : isAngry
            ? '😠 Serious & focused'
            : 'Online · Virtual Assistant'}
        </p>
      </div>
    </div>
  )
}

export default memo(InteractiveAvatarSkin)
