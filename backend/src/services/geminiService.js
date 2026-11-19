const DEFAULT_MODEL = 'gemini-3.1-flash-lite'

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    answer: { type: 'STRING', description: 'The complete helpful answer, including Markdown formatting where useful.' },
    videoDecision: {
      type: 'STRING',
      enum: ['none', 'optional', 'requested'],
      description: 'Whether a real external video reference is appropriate.',
    },
    videoQuery: { type: 'STRING', description: 'A concise search query grounded in the user question and relevant conversation context; empty when no video is appropriate.' },
    videoReason: { type: 'STRING', description: 'A short reason the visual demonstration helps; empty when no video is appropriate.' },
  },
  required: ['answer', 'videoDecision', 'videoQuery', 'videoReason'],
}

const SYSTEM_INSTRUCTIONS = {
  HR: [
    'You are ARIA, NOVA AI’s HR and career assistance virtual assistant.',
    'Help with workplace communication, career planning, interview preparation, resume feedback, learning plans, and general HR process questions.',
    'Be supportive, clear, inclusive, and practical. Ask a focused follow-up when essential context is missing.',
    'Do not claim access to the user’s employer records, policies, benefits, payroll, or private HR systems. Encourage the user to confirm organization-specific policy with their HR team.',
    'For legal, medical, safety, or high-stakes employment decisions, provide general information and encourage an appropriate qualified professional.',
    'Answer in the requested language when provided; otherwise reply in the language used by the user. Support multilingual replies.',
  ].join(' '),
  'Customer Support': [
    'You are SNOW, NOVA AI’s customer support virtual assistant.',
    'Help users troubleshoot products and services, explain steps clearly, and resolve issues with patience and empathy.',
    'Ask concise diagnostic questions when needed and provide ordered steps the user can follow.',
    'Do not claim access to orders, billing, accounts, warranties, or internal support systems. Never invent a case number, policy, action, or account status.',
    'If account-specific action is needed, explain what information or official support channel is required.',
    'Answer in the requested language when provided; otherwise reply in the language used by the user. Support multilingual replies.',
  ].join(' '),
  General: 'You are NOVA AI, a helpful virtual assistant. Be accurate, clear, and respectful. Answer in the requested language when provided; otherwise reply in the language used by the user.',
}

function providerError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

async function generateReply({ role, language, contents, attachment }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw providerError(503, 'Live AI is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend.')

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL
  if (!/^[a-zA-Z0-9._-]+$/.test(model)) throw providerError(503, 'The configured AI model name is invalid.')

  const systemInstruction = SYSTEM_INSTRUCTIONS[role] || SYSTEM_INSTRUCTIONS.General
  const languageInstruction = language
    ? 'The requested reply language is ' + language + '. Use that language.'
    : 'Detect the language of the latest user message and reply in that same language.'

  const latestParts = [{ text: contents.currentMessage }]
  if (attachment) {
    latestParts.push({
      inline_data: {
        mime_type: attachment.mimeType,
        data: attachment.buffer.toString('base64'),
      },
    })
  }

  const requestContents = contents.history.map((item) => ({
    role: item.sender === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.message }],
  }))
  requestContents.push({ role: 'user', parts: latestParts })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: systemInstruction + ' ' + languageInstruction + ' ' + [
                'Return a direct answer first, then make a separate video decision.',
                'The NOVA application can attach a real video recommendation after your text answer. Do not claim that you cannot provide or recommend videos, do not tell the user to search for one, and do not invent a title or link.',
                'For explicit video requests, answer the underlying question normally and leave the real video details to the application.',
                'Set videoDecision to requested whenever the user explicitly asks for a video, tutorial, demonstration, or to watch/see how something works.',
                'Set it to none for simple factual questions answered clearly in text.',
                'For practical or complex processes, use optional only when a visual demonstration genuinely adds value; otherwise use none.',
                'For a video request, provide a concise factual search query using the actual question and relevant prior context, and a short relevance reason.',
                'For ARIA prioritize HR, recruitment, interviews, employee relations, workplace skills, and career development; for SNOW prioritize product guidance, customer-support workflows, and troubleshooting.',
                'Prefer official or reputable educational sources in the search query when a suitable source exists. Do not invent video details or URLs.',
              ].join(' '),
            }],
          },
          contents: requestContents,
          generationConfig: {
            maxOutputTokens: 1500,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
        signal: controller.signal,
      },
    )

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const status = response.status === 429 ? 429 : response.status >= 500 ? 503 : 502
      if (response.status === 429) {
        throw providerError(status, 'The AI provider quota or rate limit was reached. Check your Gemini API usage and try again later.')
      }
      if ([400, 401, 403].includes(response.status)) {
        throw providerError(status, 'The AI provider rejected the configured key or request. Check GEMINI_API_KEY and the model configuration.')
      }
      throw providerError(status, 'The AI provider is temporarily unavailable. Please try again shortly.')
    }

    const text = (result.candidates?.[0]?.content?.parts || [])
      .map((part) => typeof part.text === 'string' ? part.text : '')
      .join('')
      .trim()
    if (!text) throw providerError(502, 'The AI provider returned no answer. Please rephrase your message and try again.')
    try {
      const structured = JSON.parse(text)
      if (typeof structured.answer === 'string' && structured.answer.trim()) {
        return {
          message: structured.answer.trim(),
          video: {
            decision: ['none', 'optional', 'requested'].includes(structured.videoDecision) ? structured.videoDecision : 'none',
            query: typeof structured.videoQuery === 'string' ? structured.videoQuery.trim().slice(0, 200) : '',
            reason: typeof structured.videoReason === 'string' ? structured.videoReason.trim().slice(0, 240) : '',
          },
        }
      }
    } catch {
      // A non-structured response remains a valid direct answer; omit video metadata safely.
    }
    return { message: text, video: { decision: 'none', query: '', reason: '' } }
  } catch (error) {
    if (error.status) throw error
    if (error.name === 'AbortError') throw providerError(504, 'The AI provider took too long to respond. Please try again.')
    throw providerError(503, 'Could not reach the AI provider. Check the backend network connection and try again.')
  } finally {
    clearTimeout(timeout)
  }
}

module.exports = { generateReply }
