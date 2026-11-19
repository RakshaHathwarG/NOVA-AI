/**
 * Emotion Engine — maps conversational context to a visual expression state.
 * Expressions are purely visual and are NEVER spoken aloud (no "smiley",
 * "thinking face", etc. is ever passed to the Speech Manager).
 *
 * Recognized expressions: greeting, listening, thinking, speaking,
 * smiling, concerned, confused, goodbye, idle.
 */

const RULES = [
  { emotion: 'goodbye', keywords: ['bye', 'goodbye', 'see you', 'thanks, bye', 'that is all', "that's all"] },
  { emotion: 'smiling', keywords: ['thank', 'thanks', 'great', 'awesome', 'perfect', 'congrat', 'appreciate'] },
  { emotion: 'concerned', keywords: ['complaint', 'angry', 'frustrat', 'broken', 'issue', 'problem', 'terrible', 'worst'] },
  { emotion: 'confused', keywords: ["don't understand", 'confus', 'what do you mean', 'unclear', 'huh'] },
]

/**
 * Determine the emotion the avatar should express while/after responding,
 * based on the user's message content.
 */
export function detectEmotion(text = '') {
  const lower = text.toLowerCase()
  const match = RULES.find((rule) => rule.keywords.some((kw) => lower.includes(kw)))
  return match ? match.emotion : 'speaking'
}

/**
 * Strip any accidental expression markers (emoji, bracketed stage directions
 * like "[smiles]") from text before it is sent to the Speech Manager, so the
 * avatar never speaks its own expressions aloud.
 */
export function sanitizeForSpeech(text = '') {
  if (typeof text !== 'string' || !text.trim()) return ''

  const protectedParts = []
  const protect = (value) => {
    const marker = 'NOVASPEECHTOKEN' + protectedParts.length + 'END'
    protectedParts.push(value)
    return marker
  }

  let speech = text
    .replace(/\x60{3}([^\n\x60]*)\n?([\s\S]*?)\x60{3}/g, (_match, _language, code) => protect('Code example. ' + code.trim()))
    .replace(/~~~([^\n~]*)\n?([\s\S]*?)~~~/g, (_match, _language, code) => protect('Code example. ' + code.trim()))
    .replace(/\x60([^\x60\n]+)\x60/g, (_match, code) => protect(code))
    .replace(/!\[([^\]]*)\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g, (_match, alt, angledUrl, url) => alt.trim() || angledUrl || url || '')
    .replace(/\[([^\]]+)\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g, (_match, label, angledUrl, url) => label.trim() || angledUrl || url || '')
    .replace(/<((?:https?:\/\/|mailto:)[^>]+)>/gi, '$1')
    .replace(/^\s{0,3}(?:-{3,}|(?:\*\s*){3,}|(?:_\s*){3,})\s*$/gm, '')
    .replace(/^\s{0,3}#{1,6}(?:\s+|$)/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-+*]\s+/gm, '\n')
    .replace(/^\s*\d+[.)]\s+/gm, '\n')
    .replace(/(\*\*|__|~~)(?=\S)([\s\S]*?\S)\1/g, '$2')
    .replace(/(?<![\w])([*_])(?=\S)([^\n]*?\S)\1(?![\w])/g, '$2')
    .replace(/\\([\\\x60*_{}\[\]()#+\-.!])/g, '$1')
    .replace(/\[(?:smiles?|waves?|laughs?|nods?|thinking|sighs?|looks? up)\]/gi, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')

  speech = speech.replace(/NOVASPEECHTOKEN(\d+)END/g, (_match, index) => ' ' + protectedParts[Number(index)] + ' ')

  return speech
    .split('\n')
    .map((line) => line.replace(/[\t ]{2,}/g, ' ').trim())
    .filter(Boolean)
    .join('. ')
    .replace(/([.!?])(?:\s*\.\s*)+/g, '$1 ')
    .replace(/([,;:])\s*\.\s*/g, '$1 ')
    .replace(/\s+([,.;!?])/g, '$1')
    .replace(/([,;])(?=\S)/g, '$1 ')
    .replace(/:(?!\/\/)(?=\S)/g, ': ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
