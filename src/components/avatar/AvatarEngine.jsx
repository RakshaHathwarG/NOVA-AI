import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarBootSequence from './AvatarBootSequence'
import AvatarRenderer from './AvatarRenderer'
import { useAvatarStateMachine } from '../../hooks/useAvatarStateMachine'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { sanitizeForSpeech } from '../../utils/emotionEngine'
import { getPreferences } from '../../utils/preferences'

/**
 * AvatarEngine — the reusable orchestrator that wires together:
 *   - the boot/initialization sequence
 *   - the Avatar Animation State Machine (useAvatarStateMachine)
 *   - the Speech Manager (useSpeechSynthesis)
 *   - the pluggable AvatarRenderer / skin
 *
 * Exposes an imperative API via ref so a chat surface can drive the avatar
 * without needing to know about speech synthesis or animation timing:
 *
 *   avatarRef.current.speak(text, emotion, { onEnd })
 *   avatarRef.current.setListening()
 *   avatarRef.current.setEmotion(emotion)
 *
 * Callbacks:
 *   onBootComplete()   — boot sequence finished, safe to reveal chat surface
 *   onGreetingStart()  — avatar has begun speaking its greeting line
 *   onGreetingEnd()    — greeting finished, safe to enable chat input
 */
const AvatarEngine = forwardRef(function AvatarEngine(
  { persona, language = 'en-US', onBootComplete, onGreetingStart, onGreetingEnd },
  ref
) {
  const [booted, setBooted] = useState(false)
  const [introEyesClosed, setIntroEyesClosed] = useState(true)
  const { state, transition, reset } = useAvatarStateMachine('booting')
  const { speak, cancel, isSupported } = useSpeechSynthesis()
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cancel()
    }
  }, [cancel])

  function handleBootComplete() {
    setBooted(true)
    onBootComplete?.()
    reset('greeting')
    setIntroEyesClosed(true)

    // Eyes remain closed briefly, then open and the avatar looks toward
    // the user before greeting — never an instant cut.
    setTimeout(() => {
      if (!mountedRef.current) return
      setIntroEyesClosed(false)

      setTimeout(() => {
        if (!mountedRef.current) return
        onGreetingStart?.()
        const preferences = getPreferences()
        if (!preferences.voiceEnabled) {
          transition('smiling')
          onGreetingEnd?.()
          setTimeout(() => mountedRef.current && transition('idle'), 1000)
          return
        }
        transition('speaking')
        speak(sanitizeForSpeech(persona.greeting), {
          lang: language,
          rate: preferences.speechRate,
          onStart: () => mountedRef.current && transition('speaking'),
          onEnd: () => {
            if (!mountedRef.current) return
            transition('smiling')
            onGreetingEnd?.()
            setTimeout(() => mountedRef.current && transition('idle'), 1000)
          },
        })
      }, 700)
    }, 900)
  }

  useImperativeHandle(ref, () => ({
    speak(text, emotion = 'speaking', { onEnd, lang } = {}) {
      transition('thinking')
      setTimeout(() => {
        if (!mountedRef.current) return
        transition('speaking')
        const preferences = getPreferences()
        const settleState = ['smiling', 'concerned', 'confused', 'goodbye'].includes(emotion) ? emotion : 'idle'
        if (!preferences.voiceEnabled) {
          transition(settleState)
          onEnd?.()
          if (settleState !== 'idle') setTimeout(() => mountedRef.current && transition('idle'), 1300)
          return
        }
        speak(sanitizeForSpeech(text), {
          lang: lang || language,
          rate: preferences.speechRate,
          onEnd: () => {
            if (!mountedRef.current) return
            const settleState = ['smiling', 'concerned', 'confused', 'goodbye'].includes(emotion)
              ? emotion
              : 'idle'
            transition(settleState)
            onEnd?.()
            if (settleState !== 'idle') {
              setTimeout(() => mountedRef.current && transition('idle'), 1300)
            }
          },
        })
      }, 550)
    },
    setListening() {
      transition('listening')
    },
    setEmotion(emotion) {
      transition(emotion)
    },
  }))

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div key="boot" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <AvatarBootSequence persona={persona} onComplete={handleBootComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-square w-full"
          >
            <AvatarRenderer persona={persona} state={state} eyesClosed={introEyesClosed} />
          </motion.div>
        )}
      </AnimatePresence>

      {booted && !isSupported && (
        <p className="text-center text-[10px] text-ink-faint mt-2">
          Voice playback isn't supported in this browser — captions only.
        </p>
      )}
    </div>
  )
})

export default AvatarEngine
