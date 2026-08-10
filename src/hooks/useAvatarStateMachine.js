import { useCallback, useRef, useState } from 'react'

/**
 * Avatar Animation State Machine — reusable across any avatar skin.
 *
 * States: booting, idle, greeting, listening, thinking, speaking,
 * smiling, concerned, confused, goodbye.
 *
 * Guarantees expressions never jump instantly: each state has a minimum
 * dwell time, and requests that arrive before it elapses are queued and
 * applied in order. The actual crossfade/interpolation between states is
 * handled by the skin component via Framer Motion variants — this hook
 * only guarantees *when* transitions are allowed to happen.
 */

const MIN_DWELL_MS = {
  booting: 400,
  idle: 250,
  greeting: 1200,
  listening: 300,
  thinking: 500,
  speaking: 250,
  smiling: 900,
  happy: 900,
  sad: 900,
  angry: 900,
  concerned: 900,
  confused: 900,
  goodbye: 1400,
}

export function useAvatarStateMachine(initial = 'booting') {
  const [state, setStateRaw] = useState(initial)
  const lastChangeRef = useRef(Date.now())
  const queueRef = useRef([])
  const timerRef = useRef(null)

  const flush = useCallback(() => {
    if (!queueRef.current.length) {
      timerRef.current = null
      return
    }
    const next = queueRef.current.shift()
    setStateRaw(next)
    lastChangeRef.current = Date.now()

    const dwell = MIN_DWELL_MS[next] ?? 400
    timerRef.current = setTimeout(() => {
      flush()
    }, dwell)
  }, [])

  const transition = useCallback(
    (next) => {
      if (!next || next === state) return
      queueRef.current.push(next)

      const elapsed = Date.now() - lastChangeRef.current
      const currentDwell = MIN_DWELL_MS[state] ?? 300

      if (!timerRef.current && elapsed >= currentDwell) {
        flush()
      }
      // If a timer is already pending, the queued state will be picked up
      // automatically once it fires.
    },
    [state, flush]
  )

  const reset = useCallback((to = 'idle') => {
    clearTimeout(timerRef.current)
    timerRef.current = null
    queueRef.current = []
    setStateRaw(to)
    lastChangeRef.current = Date.now()
  }, [])

  return { state, transition, reset }
}
