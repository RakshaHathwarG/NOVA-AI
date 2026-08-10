import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Speech Manager — a reusable hook around the browser's SpeechSynthesis API.
 *
 * - Prefers female voices for the requested language.
 * - Falls back gracefully to English (or any available voice) if the
 *   requested language/voice isn't installed on the user's OS — never throws.
 * - Emits onStart / onEnd / onBoundary callbacks so callers (e.g. the Avatar
 *   Engine's lip-sync) can drive mouth animation without needing real
 *   phoneme data.
 */

const FEMALE_HINTS = ['female', 'woman', 'zira', 'samantha', 'victoria', 'susan', 'karen', 'moira', 'tessa', 'kyoko', 'yuna', 'sora', 'paulina', 'monica']

function scoreVoice(voice, langCode) {
  let score = 0
  const name = voice.name.toLowerCase()
  if (voice.lang?.toLowerCase().startsWith(langCode.toLowerCase().slice(0, 2))) score += 5
  if (voice.lang?.toLowerCase() === langCode.toLowerCase()) score += 3
  if (FEMALE_HINTS.some((hint) => name.includes(hint))) score += 4
  if (voice.localService) score += 1
  return score
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (!isSupported) return

   function loadVoices() {
  const list = window.speechSynthesis.getVoices()

  console.log("===== AVAILABLE VOICES =====")
  list.forEach(v => {
    console.log(v.name, v.lang)
  })

  if (list.length) setVoices(list)
}
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [isSupported])

  const pickVoice = useCallback(
    (langCode) => {
      if (!voices.length) return null
      const ranked = [...voices].sort((a, b) => scoreVoice(b, langCode) - scoreVoice(a, langCode))
      // Only accept a match if it's at least plausible for the requested language;
      // otherwise gracefully fall back to the best English voice.
      const best = ranked[0]
      if (best && best.lang?.toLowerCase().startsWith(langCode.toLowerCase().slice(0, 2))) {
        return best
      }
      const englishFallback = [...voices]
        .filter((v) => v.lang?.toLowerCase().startsWith('en'))
        .sort((a, b) => scoreVoice(b, 'en-US') - scoreVoice(a, 'en-US'))[0]
      return englishFallback || best || null
    },
    [voices]
  )

  const cancel = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  const speak = useCallback(
    (text, { lang = 'en-US', onStart, onEnd, onBoundary, rate = 1, pitch = 1.02 } = {}) => {
      if (!isSupported || !text) {
        // Gracefully no-op — the Avatar Engine will simulate timing instead.
        onStart?.()
        const estimatedMs = Math.min(Math.max(text.length * 45, 900), 9000)
        const timer = setTimeout(() => onEnd?.(), estimatedMs)
        return () => clearTimeout(timer)
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const voice = pickVoice(lang)
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        utterance.lang = lang
      }
      utterance.rate = rate
      utterance.pitch = pitch

      utterance.onstart = () => {
        setIsSpeaking(true)
        onStart?.()
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        onEnd?.()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        onEnd?.()
      }
      utterance.onboundary = (event) => {
        onBoundary?.(event)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)

      return () => window.speechSynthesis.cancel()
    },
    [isSupported, pickVoice]
  )

  useEffect(() => () => cancel(), [cancel])

  return { speak, cancel, isSpeaking, isSupported, voices }
}
