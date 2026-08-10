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
  return text
    .replace(/\[[^\]]*\]/g, '') // remove [smiles], [waves], etc.
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '') // strip emoji ranges
    .replace(/\s{2,}/g, ' ')
    .trim()
}
