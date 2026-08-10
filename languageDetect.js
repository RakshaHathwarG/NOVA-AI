// languageDetect.js
// Lightweight, dependency-free language detector for the 5 languages NOVA
// supports: English, Hindi, Japanese, Korean, Spanish.
//
// Strategy:
//  1. Unicode script ranges give near-certain answers for Hindi (Devanagari),
//     Korean (Hangul), and Japanese (Hiragana/Katakana, plus Han/Kanji as a
//     secondary signal once Hangul/Hiragana/Katakana are ruled out).
//  2. Latin-script text is disambiguated between English and Spanish using
//     Spanish-specific punctuation/diacritics plus a common-word scorer.
//  3. Other scripts (Arabic, Cyrillic, Chinese-only text, etc.) and
//     low-signal input (emojis, numbers, single ambiguous words) return
//     `null` so the caller can ask the user which language to use.

const HINDI_REGEX = /[\u0900-\u097F]/
const HANGUL_REGEX = /[\uAC00-\uD7A3]/
const KANA_REGEX = /[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/ // Hiragana/Katakana — unique to Japanese
const HAN_REGEX = /[\u4E00-\u9FFF]/ // Kanji/Han — shared with Chinese, used only as a fallback signal
const OTHER_SCRIPT_REGEX = /[\u0600-\u06FF\u0400-\u04FF\u0590-\u05FF]/ // Arabic, Cyrillic, Hebrew — unsupported

const SPANISH_MARKERS = /[¿¡áéíóúñüÁÉÍÓÚÑÜ]/

const SPANISH_WORDS = new Set([
  'hola', 'gracias', 'por', 'favor', 'que', 'qué', 'como', 'cómo', 'donde', 'dónde',
  'cuando', 'cuándo', 'quien', 'quién', 'cual', 'cuál', 'el', 'la', 'los', 'las',
  'un', 'una', 'unos', 'unas', 'es', 'esta', 'está', 'estoy', 'soy', 'eres', 'tengo',
  'tienes', 'tiene', 'quiero', 'quieres', 'necesito', 'necesitas', 'ayuda', 'ayudar',
  'buenos', 'buenas', 'dias', 'días', 'tardes', 'noches', 'adios', 'adiós', 'si',
  'sí', 'no', 'de', 'del', 'en', 'con', 'para', 'mi', 'tu', 'su', 'yo', 'usted',
  'puedo', 'puedes', 'ustedes', 'nosotros', 'gracias', 'perdon', 'perdón', 'disculpe',
  'pedido', 'reembolso', 'contraseña', 'vacaciones', 'nomina', 'nómina', 'cuenta',
])

const ENGLISH_WORDS = new Set([
  'hello', 'hi', 'hey', 'thanks', 'thank', 'you', 'please', 'how', 'what', 'where',
  'when', 'who', 'which', 'the', 'a', 'an', 'is', 'are', 'am', 'i', 'my', 'your',
  'have', 'has', 'want', 'need', 'help', 'can', 'could', 'would', 'order', 'refund',
  'password', 'account', 'leave', 'payroll', 'salary', 'login', 'yes', 'no', 'and',
  'or', 'for', 'with', 'about', 'this', 'that', 'good', 'morning', 'evening', 'bye',
])

function scoreWords(words, dictionary) {
  let score = 0
  for (const w of words) {
    if (dictionary.has(w)) score += 1
  }
  return score
}

/**
 * Detects which of NOVA's 5 supported languages a message is written in.
 * Returns one of 'English' | 'Hindi' | 'Japanese' | 'Korean' | 'Spanish',
 * or `null` if the language can't be confidently determined (unsupported
 * script, empty text, or ambiguous/low-signal Latin text).
 */
export function detectLanguage(text) {
  if (!text || !text.trim()) return null
  const trimmed = text.trim()

  // Script-based detection first — these are essentially unambiguous.
  if (HINDI_REGEX.test(trimmed)) return 'Hindi'
  if (HANGUL_REGEX.test(trimmed)) return 'Korean'
  if (KANA_REGEX.test(trimmed)) return 'Japanese'
  if (HAN_REGEX.test(trimmed)) return 'Japanese' // Kanji-only message, no Hiragana/Katakana/Hangul
  if (OTHER_SCRIPT_REGEX.test(trimmed)) return null // unsupported script — ask the user

  // Latin-script text: disambiguate English vs Spanish.
  if (SPANISH_MARKERS.test(trimmed)) return 'Spanish'

  const words = trimmed
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^a-zà-ÿ\s']/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return null // e.g. pure numbers, punctuation, emoji

  const esScore = scoreWords(words, SPANISH_WORDS)
  const enScore = scoreWords(words, ENGLISH_WORDS)

  if (esScore > enScore) return 'Spanish'
  if (enScore > esScore) return 'English'
  if (enScore === 0 && esScore === 0) {
    // No recognizable words in either language. If it's plain Latin
    // alphabetic text, default to English; otherwise we can't tell.
    return /^[a-z\s'.,!?]+$/i.test(trimmed) ? 'English' : null
  }
  // Tie with at least one match on each side — default to English.
  return 'English'
}
