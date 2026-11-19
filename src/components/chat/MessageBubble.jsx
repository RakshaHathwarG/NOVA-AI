import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import VideoRecommendationCard from './VideoRecommendationCard'

function MessageBubble({
  role,
  text,
  file,
  accent = 'indigo',
  timestamp,
  video,
}) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-nova-gradient text-white rounded-br-md shadow-glow-indigo/50'
            : 'glass text-ink rounded-bl-md'
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>

        {file && (
          <p className="mt-2 text-xs text-[#4F7CFF] font-medium">
            📎 {file.name}
          </p>
        )}

        {!isUser && video?.status && (
          <VideoRecommendationCard recommendation={video} />
        )}

        {timestamp && (
          <p
            className={cn(
              'mt-1.5 text-[10px]',
              isUser ? 'text-white/70' : 'text-ink-faint'
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default memo(MessageBubble)
