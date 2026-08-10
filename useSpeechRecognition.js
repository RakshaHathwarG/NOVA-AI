import { useCallback, useRef, useState } from 'react'

/**
 * Reusable Speech-to-Text hook around the browser's Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition).
 *
 * Gracefully degrades: if the browser doesn't support speech recognition
 * at all (e.g. Firefox), `isSupported` is false and `start()` is a no-op —
 * callers should disable/hide the mic affordance rather than crash.
 */
export function useSpeechRecognition({ lang = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  const SpeechRecognitionImpl =
    typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null
  const isSupported = Boolean(SpeechRecognitionImpl)

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const start = useCallback(
    ({ onResult, onError, onEnd } = {}) => {
      if (!isSupported) {
        onError?.('unsupported')
        return false
      }

      const recognition = new SpeechRecognitionImpl()
      recognition.lang = lang
      recognition.interimResults = true
      recognition.continuous = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        const isFinal = event.results[event.results.length - 1].isFinal
        onResult?.(transcript, isFinal)
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        onError?.(event.error)
      }

      recognition.onend = () => {
        setIsListening(false)
        onEnd?.()
      }

      recognitionRef.current = recognition
      try {
        recognition.start()
        setIsListening(true)
        return true
      } catch {
        onError?.('start-failed')
        return false
      }
    },
    [SpeechRecognitionImpl, isSupported, lang]
  )

  return { start, stop, isListening, isSupported }
}
