import { useEffect, useRef, useState } from 'react'
import { FileText, Image, Mic, MicOff, Paperclip, Send, X } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

const MAX_FILE_BYTES = 4 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('This file could not be read.'))
    reader.readAsDataURL(file)
  })
}

export default function ChatInput({ onSend, disabled, accent = 'indigo', lang = 'en-US' }) {
  const [value, setValue] = useState('')
  const [micError, setMicError] = useState(false)
  const [fileError, setFileError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const { start, stop, isListening, isSupported } = useSpeechRecognition({ lang })
  const focusRing = accent === 'indigo' ? 'focus-within:border-nova-indigo/50' : 'focus-within:border-nova-cyan/50'

  useEffect(() => {
    if (!micError) return
    const timer = setTimeout(() => setMicError(false), 3200)
    return () => clearTimeout(timer)
  }, [micError])

  function resizeTextarea(element) {
    if (!element) return
    element.style.height = 'auto'
    element.style.height = Math.min(element.scrollHeight, 140) + 'px'
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    setFileError('')
    if (!file) return
    if (!ACCEPTED_TYPES.has(file.type)) {
      setFileError('Choose a PNG, JPEG, WebP image, or PDF.')
      return
    }
    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      setFileError('Files must be 4 MB or smaller.')
      return
    }
    setSelectedFile(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (disabled || (!value.trim() && !selectedFile)) return
    setFileError('')
    let attachment = null
    try {
      if (selectedFile) {
        attachment = {
          name: selectedFile.name,
          mimeType: selectedFile.type,
          size: selectedFile.size,
          dataUrl: await readFileAsDataUrl(selectedFile),
        }
      }
    } catch (error) {
      setFileError(error.message || 'This file could not be read.')
      return
    }

    const text = value.trim() || (selectedFile ? 'Please analyze the attached file.' : '')
    onSend({
      text,
      file: selectedFile ? { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size } : null,
      attachment,
    })
    setValue('')
    setSelectedFile(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSubmit(event)
    }
  }

  function handleInput(event) {
    setValue(event.target.value)
    resizeTextarea(event.target)
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
        requestAnimationFrame(() => resizeTextarea(textareaRef.current))
      },
      onError: (error) => {
        if (error === 'unsupported') setMicError(true)
      },
    })
  }

  return (
    <div className="relative">
      {micError && <div className="absolute -top-10 right-0 rounded-lg glass px-3 py-1.5 text-[11px] text-ink-muted shadow-glass">Voice input isn't supported in this browser — try typing instead.</div>}
      {(fileError || selectedFile) && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          {fileError ? <p role="alert" className="text-xs text-red-300">{fileError}</p> : (
            <div className="flex min-w-0 items-center gap-2 text-xs text-ink-muted">
              {selectedFile?.type === 'application/pdf' ? <FileText size={15} /> : <Image size={15} />}
              <span className="truncate">{selectedFile?.name}</span>
              <span className="shrink-0 text-ink-faint">{((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB · sent for AI analysis, not stored</span>
            </div>
          )}
          {selectedFile && <button type="button" onClick={() => setSelectedFile(null)} disabled={disabled} aria-label="Remove attachment" className="rounded p-1 text-ink-faint hover:text-white disabled:opacity-40"><X size={14} /></button>}
        </div>
      )}
      <form onSubmit={handleSubmit} className={'flex items-end gap-2 rounded-2xl glass border border-white/10 px-3 py-2.5 transition-colors ' + focusRing}>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={handleFileChange} className="sr-only" aria-label="Choose an image or PDF" />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={disabled} title="Attach an image or PDF (maximum 4 MB)" aria-label="Attach an image or PDF" className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-ink-faint transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30">
          <Paperclip size={17} />
        </button>
        <textarea ref={textareaRef} value={value} onChange={handleInput} onKeyDown={handleKeyDown} rows={1} placeholder={isListening ? 'Listening…' : 'Type your message…'} className="flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-ink-faint outline-none max-h-[140px]" />
        <button type="button" onClick={handleMicClick} disabled={disabled || !isSupported} title={isSupported ? 'Voice input' : 'Speech recognition is not supported in this browser'} className={'shrink-0 relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed ' + (isListening ? 'text-red-400 bg-red-500/10' : 'text-ink-faint hover:text-white hover:bg-white/5')} aria-label={isListening ? 'Stop voice input' : 'Start voice input'}>
          {isSupported ? <Mic size={18} /> : <MicOff size={18} />}
          {isListening && <span className="absolute inset-0 rounded-xl border border-red-400/50 animate-ping" />}
        </button>
        <button type="submit" disabled={disabled || (!value.trim() && !selectedFile)} className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-nova-gradient text-white transition-opacity disabled:opacity-30" aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
      <p className="mt-1.5 px-1 text-[10px] text-ink-faint">Messages and files are sent to Google Gemini. NOVA keeps file metadata, not file bytes. Avoid sensitive or confidential information.</p>
    </div>
  )
}


