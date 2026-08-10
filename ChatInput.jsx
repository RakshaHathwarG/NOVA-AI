import { useEffect, useRef, useState } from 'react'
import { Send, Mic, MicOff, Paperclip } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

export default function ChatInput({ onSend, disabled, accent = 'indigo', lang = 'en-US' }) {
  const [value, setValue] = useState('')
  const [micError, setMicError] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const [selectedFile,
  setSelectedFile] = useState(null)
  const { start, stop, isListening, isSupported } = useSpeechRecognition({ lang })

  const focusRing = accent === 'indigo' ? 'focus-within:border-nova-indigo/50' : 'focus-within:border-nova-cyan/50'
  const sendBg = 'bg-nova-gradient'

  // Auto-clear a transient "unsupported" notice after a few seconds.
  useEffect(() => {
    if (!micError) return
    const t = setTimeout(() => setMicError(false), 3200)
    return () => clearTimeout(t)
  }, [micError])

  function resizeTextarea(el) {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend({
      text: value.trim(),
      file: selectedFile,
    })
    setValue("")
    setSelectedFile(null)
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function handleInput(e) {
    setValue(e.target.value)
    resizeTextarea(e.target)
  }

  function handleMicClick() {
    if (disabled) return

    if (isListening) {
      stop()
      return
    }

    start({
      onResult: (transcript) => {
        setValue(transcript)
        // Keep the textarea sized correctly as speech fills it in live.
        requestAnimationFrame(() => resizeTextarea(textareaRef.current))
      },
      onError: (err) => {
        if (err === 'unsupported') setMicError(true)
      },
    })
  }

  return (
    <div className="relative">

    <input
       type="file"
       ref={fileInputRef}
       style={{ display: "none" }}
       onChange={(e) => {
       const file = e.target.files[0];
       if (file) {
       setSelectedFile(file);
       console.log(file.name);
    }
  }}
/>
      {micError && (
        <div className="absolute -top-10 right-0 rounded-lg glass px-3 py-1.5 text-[11px] text-ink-muted shadow-glass">
          Voice input isn't supported in this browser — try typing instead.
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex items-end gap-2 rounded-2xl glass border border-white/10 px-3 py-2.5 transition-colors ${focusRing}`}
      >
        <button
          type="button"
          onClick={() =>
        fileInputRef.current?.click()}
           className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-ink-faint hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={isListening ? 'Listening…' : 'Type your message…'}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-ink-faint outline-none py-2 max-h-[140px]"
        />

        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled || !isSupported}
          title={isSupported ? 'Voice input' : 'Speech recognition is not supported in this browser'}
          className={`shrink-0 relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            isListening ? 'text-red-400 bg-red-500/10' : 'text-ink-faint hover:text-white hover:bg-white/5'
          }`}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          {isSupported ? <Mic size={18} /> : <MicOff size={18} />}
          {isListening && (
            <span className="absolute inset-0 rounded-xl border border-red-400/50 animate-ping" />
          )}
        </button>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-white transition-opacity ${sendBg} disabled:opacity-30`}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
