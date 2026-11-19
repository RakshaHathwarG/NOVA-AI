import { motion } from 'framer-motion'
import { Youtube, ExternalLink } from 'lucide-react'

export default function VideoRecommendationCard({ recommendation }) {
  if (!recommendation) return null
  const { status, title, channel, thumbnail, url, reason, message } = recommendation

  if (status !== 'recommended') {
    return (
      <div role="status" className="mt-3 max-w-sm rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-ink-faint">
        {message || (status === 'not_found' ? 'No suitable video reference was found for this question.' : 'Video search is currently unavailable. Your answer is still available.')}
      </div>
    )
  }

  let safeUrl = ''
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'https:' && parsed.hostname === 'www.youtube.com' && parsed.pathname === '/watch' && /^[A-Za-z0-9_-]{11}$/.test(parsed.searchParams.get('v') || '')) {
      safeUrl = parsed.toString()
    }
  } catch { /* Invalid provider metadata is not rendered as a link. */ }
  if (!safeUrl || !title || !channel) return null

  return (
    <motion.a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={'Watch ' + title + ' by ' + channel + ' on YouTube (opens in a new tab)'}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="mt-3 block w-full max-w-sm rounded-xl glass border border-white/10 p-3.5 transition-colors hover:border-white/25"
    >
      {thumbnail && <img src={thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="mb-3 aspect-video w-full rounded-lg object-cover" />}
      <div className="flex items-center gap-2 text-xs font-semibold text-red-400"><Youtube size={16} /> Video reference</div>
      <p className="mt-1.5 text-sm font-medium text-white">{title}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{channel}</p>
      {reason && <p className="mt-1.5 text-xs text-ink-faint">{reason}</p>}
      <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-red-300">Watch on YouTube <ExternalLink size={12} aria-hidden="true" /></span>
    </motion.a>
  )
}
