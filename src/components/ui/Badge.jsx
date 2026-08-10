import { cn } from '../../utils/cn'

const TONES = {
  indigo: 'bg-nova-indigo/10 text-nova-indigo border-nova-indigo/30',
  purple: 'bg-nova-purple/10 text-nova-purple border-nova-purple/30',
  cyan: 'bg-nova-cyan/10 text-nova-cyan border-nova-cyan/30',
  neutral: 'bg-white/5 text-ink-muted border-white/10',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
