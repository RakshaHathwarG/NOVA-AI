import { useEffect, useState } from 'react'

/**
 * Tracks normalized mouse position (-0.5 to 0.5 on each axis) relative to viewport.
 * Used for subtle parallax effects on hero/background layers.
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function handleMove(e) {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      setPosition({ x, y })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return position
}
