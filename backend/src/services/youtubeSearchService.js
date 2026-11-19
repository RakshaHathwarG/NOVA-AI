const TOKEN_STOP_WORDS = new Set([
  'about', 'after', 'again', 'also', 'and', 'are', 'can', 'could', 'for', 'from',
  'get', 'how', 'into', 'its', 'just', 'more', 'please', 'should', 'that', 'the',
  'their', 'them', 'then', 'this', 'through', 'tips', 'tutorial', 'video', 'videos',
  'what', 'when', 'where', 'which', 'with', 'would', 'you', 'your',
])

function tokens(text) {
  return new Set((String(text || '').toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])
    .filter((token) => !TOKEN_STOP_WORDS.has(token)))
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&(?:quot|ldquo|rdquo);/gi, '"')
    .replace(/&(?:apos|lsquo|rsquo|#39);/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (match, digits) => {
      const codePoint = Number(digits)
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
    })
    .replace(/&#x([\da-f]+);/gi, (match, digits) => {
      const codePoint = Number.parseInt(digits, 16)
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
    })
}

function thumbnailUrl(snippet) {
  const thumbnails = snippet?.thumbnails || {}
  const url = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url
  if (typeof url !== 'string') return undefined
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && (parsed.hostname === 'i.ytimg.com' || parsed.hostname.endsWith('.ytimg.com'))
      ? parsed.toString()
      : undefined
  } catch {
    return undefined
  }
}

function relevanceScore(query, snippet) {
  const queryTokens = tokens(query)
  const titleTokens = tokens(snippet?.title)
  const descriptionTokens = tokens(snippet?.description)
  const channelTokens = tokens(snippet?.channelTitle)
  if (queryTokens.size < 2) return 0
  let titleMatches = 0
  let otherMatches = 0
  for (const token of queryTokens) {
    if (titleTokens.has(token)) titleMatches += 1
    else if (descriptionTokens.has(token) || channelTokens.has(token)) otherMatches += 1
  }
  // Requiring several independent topic terms across metadata prevents a single
  // matching title word from being enough to recommend a result.
  if (titleMatches + otherMatches < 2) return 0
  return (titleMatches * 2 + otherMatches) / (queryTokens.size * 2)
}

function unavailable(message = 'Video search is temporarily unavailable. Your AI answer is still available.') {
  return { status: 'unavailable', message }
}

async function searchYouTubeVideo({ query, reason }) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return unavailable('Video search is not configured. Add YOUTUBE_API_KEY to backend/.env and restart the backend.')
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: '5',
    safeSearch: 'strict',
    videoEmbeddable: 'true',
    q: query,
    key: apiKey,
  })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 7000)

  try {
    const response = await fetch('https://www.googleapis.com/youtube/v3/search?' + params.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      if (response.status === 403 && data.error?.errors?.some((error) => error.reason === 'quotaExceeded')) {
        return unavailable('YouTube video search has reached its daily quota. Your AI answer is still available.')
      }
      return unavailable()
    }

    const candidates = (Array.isArray(data.items) ? data.items : [])
      .filter((item) => item?.id?.kind === 'youtube#video' && /^[A-Za-z0-9_-]{11}$/.test(item.id.videoId || ''))
      .map((item) => ({ item, score: relevanceScore(query, item.snippet) }))
      .filter(({ score }) => score >= 0.22)
      .sort((a, b) => b.score - a.score)
    const best = candidates[0]?.item
    if (!best?.snippet?.title || !best.snippet.channelTitle) {
      return {
        status: 'not_found',
        message: 'No suitable video reference was found for this question.',
      }
    }

    return {
      status: 'recommended',
      title: decodeHtmlEntities(best.snippet.title).slice(0, 300),
      channel: decodeHtmlEntities(best.snippet.channelTitle).slice(0, 200),
      thumbnail: thumbnailUrl(best.snippet),
      url: 'https://www.youtube.com/watch?v=' + best.id.videoId,
      reason: String(reason || 'This visual demonstration may help with the steps.').slice(0, 240),
    }
  } catch (error) {
    return unavailable(error.name === 'AbortError'
      ? 'Video search timed out. Your AI answer is still available.'
      : undefined)
  } finally {
    clearTimeout(timeout)
  }
}

module.exports = { searchYouTubeVideo }
