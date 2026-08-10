import { useState, useRef, useEffect } from 'react'
import { Languages, Check, ChevronDown, Info } from 'lucide-react'
import { LANGUAGES } from '../../utils/constants'

export default function LanguageSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isEnglish = value === 'English'

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Language is detected automatically from what you type or say — tap to switch manually"
        className="flex items-center gap-2 rounded-xl glass px-3 py-2 text-xs font-medium text-ink-muted hover:text-white transition-colors"
      >
        <Languages size={14} />
        {value}
        {!isEnglish && <span className="h-1.5 w-1.5 rounded-full bg-nova-cyan" aria-hidden="true" />}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel p-1.5 z-20">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onChange(lang)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-ink-muted hover:bg-white/5 hover:text-white transition-colors"
            >
              {lang}
              {value === lang && <Check size={13} className="text-nova-cyan" />}
            </button>
          ))}
          <div className="mt-1 flex items-start gap-1.5 rounded-lg bg-white/[0.03] px-3 py-2">
            <Info size={12} className="mt-0.5 shrink-0 text-ink-faint" />
            <p className="text-[10px] leading-relaxed text-ink-faint">
              NOVA detects the language of each message automatically and replies — in text and
              voice — in that same language. Pick one here to set it manually.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
