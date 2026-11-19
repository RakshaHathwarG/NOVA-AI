const Chat = require('../models/Chat')
const { generateReply } = require('../services/geminiService')
const { searchYouTubeVideo } = require('../services/youtubeSearchService')

const ROLES = ['HR', 'Customer Support', 'General']
const MAX_FILE_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

const EXPLICIT_VIDEO_REQUEST = /\b(?:tutorial|tutorials|video reference|visual demonstration|demonstration video|video tutorial)\b|\b(?:show me|watch|find|recommend|share|send|link|provide|give me|can you show|could you show)\b.{0,60}\b(?:a |some |me |the )?(?:video|videos|tutorial|demonstration|demo|clip)\b|\b(?:video|videos)\b.{0,30}\b(?:please|for me|i want|i need|looking for|to watch|to see)\b|\b(?:watch|see)\b.{0,50}\b(?:how|it works|something works)\b|वीडियो दिख|वीडियो भेज|वीडियो चाहिए|ट्यूटोरियल|देखें कैसे|दिखाओ/i

function explicitlyRequestsVideo(message) {
  return EXPLICIT_VIDEO_REQUEST.test(message || '')
}

async function generateAndSaveReply({ scope, role, language, history, message, attachment, requestId }) {
  const generated = await generateReply({
    role,
    language,
    contents: { history, currentMessage: message },
    attachment,
  })
  const videoDecision = generated.video || { decision: 'none', query: '', reason: '' }
  const explicitRequest = explicitlyRequestsVideo(message)
  let videoReference

  if (explicitRequest || videoDecision.decision === 'requested' || videoDecision.decision === 'optional') {
    const roleContext = role === 'HR' ? 'HR career workplace' : role === 'Customer Support' ? 'customer support product troubleshooting' : 'helpful how-to'
    const query = (videoDecision.query || (message + ' ' + roleContext)).slice(0, 200)
    try {
      videoReference = await searchYouTubeVideo({
        query,
        reason: videoDecision.reason || (explicitRequest ? 'You asked for a video reference.' : ''),
      })
    } catch {
      // A video provider failure must never discard or block the generated text answer.
      videoReference = { status: 'unavailable', message: 'Video search is temporarily unavailable. Your AI answer is still available.' }
    }
  }

  const fields = {
    ...scope,
    message: generated.message,
    sender: 'assistant',
    replyToRequestId: requestId,
    ...(videoReference ? { videoReference } : {}),
  }

  try {
    return await Chat.create(fields)
  } catch (error) {
    if (error.code !== 11000) throw error
    return Chat.findOne({ userId: scope.userId, replyToRequestId: requestId })
  }
}

function invalid(message) {
  const error = new Error(message)
  error.status = 400
  return error
}

function parseAttachment(value) {
  if (!value) return null
  if (typeof value !== 'object' || typeof value.name !== 'string' || typeof value.mimeType !== 'string' || typeof value.base64 !== 'string') {
    throw invalid('The attachment is not valid.')
  }

  const mimeType = value.mimeType.toLowerCase()
  if (!ALLOWED_TYPES.has(mimeType)) throw invalid('Attach a PNG, JPEG, WebP image, or PDF file.')
  const encoded = value.base64.replace(/^data:[^,]+,/, '')
  if (!encoded || encoded.length > Math.ceil(MAX_FILE_BYTES * 4 / 3) + 8 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw invalid('The attachment is empty or exceeds the 4 MB limit.')
  }

  const buffer = Buffer.from(encoded, 'base64')
  if (buffer.length === 0 || buffer.length > MAX_FILE_BYTES || buffer.toString('base64').replace(/=+$/, '') !== encoded.replace(/=+$/, '')) {
    throw invalid('The attachment is invalid or exceeds the 4 MB limit.')
  }

  const isPng = mimeType === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const isJpeg = mimeType === 'image/jpeg' && buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
  const isWebp = mimeType === 'image/webp' && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
  const isPdf = mimeType === 'application/pdf' && buffer.toString('ascii', 0, 5) === '%PDF-'
  if (!(isPng || isJpeg || isWebp || isPdf)) throw invalid('The attachment content does not match its declared file type.')

  const name = value.name.replace(/[\\/\u0000-\u001f\u007f]/g, '_').slice(0, 150) || 'attachment'
  return { name, mimeType, size: buffer.length, buffer }
}

async function createChat(req, res) {
  try {
    const { role, message, sender, conversationId } = req.body
    if (!message || !sender || !conversationId) {
      return res.status(400).json({ message: 'Message, sender and conversation ID are required' })
    }
    const chat = await Chat.create({
      userId: req.user._id,
      role: role || 'General',
      conversationId,
      message,
      sender,
    })
    res.status(201).json({ message: 'Chat saved successfully', chat })
  } catch (error) {
    console.error('Chat save failed:', error.name || 'DatabaseError')
    res.status(500).json({ message: 'Failed to save chat' })
  }
}

async function generateChatReply(req, res) {
  try {
    const { role, message, conversationId, requestId, language } = req.body || {}
    if (!ROLES.includes(role)) return res.status(400).json({ message: 'Choose a valid assistant role' })
    if (typeof conversationId !== 'string' || !conversationId.trim() || conversationId.length > 100) {
      return res.status(400).json({ message: 'A valid conversation ID is required' })
    }
    if (typeof requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(requestId)) {
      return res.status(400).json({ message: 'A valid request ID is required' })
    }

    const attachment = parseAttachment(req.body?.attachment)
    const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 4000) : ''
    if (!cleanMessage && !attachment) return res.status(400).json({ message: 'Write a message or attach a file' })
    if (typeof language !== 'undefined' && (typeof language !== 'string' || language.length > 40)) {
      return res.status(400).json({ message: 'The requested language is invalid' })
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: 'Live AI is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend.' })
    }

    const userId = req.user._id
    const scope = { userId, role, conversationId: conversationId.trim() }
    let userTurn = await Chat.findOne({ userId, requestId })
    const savedReply = await Chat.findOne({ userId, replyToRequestId: requestId })
    if (savedReply) return res.json({ userMessage: userTurn, reply: savedReply })

    if (!userTurn) {
      const history = await Chat.find(scope).sort({ timestamp: -1 }).limit(12).lean()
      history.reverse()
      const messageText = cleanMessage || 'Please analyze the attached file.'
      const userDocument = { ...scope, message: messageText, sender: 'user', requestId }
      if (attachment) userDocument.attachment = { name: attachment.name, mimeType: attachment.mimeType, size: attachment.size }
      try {
        userTurn = await Chat.create(userDocument)
      } catch (error) {
        if (error.code !== 11000) throw error
        userTurn = await Chat.findOne({ userId, requestId })
      }

      const reply = await generateAndSaveReply({
        scope, role, language: language?.trim(), history, message: messageText, attachment, requestId,
      })
      return res.status(201).json({ userMessage: userTurn, reply })
    }

    const history = await Chat.find({ ...scope, requestId: { $ne: requestId } }).sort({ timestamp: -1 }).limit(12).lean()
    history.reverse()
    const reply = await generateAndSaveReply({
      scope, role, language: language?.trim(), history,
      message: cleanMessage || userTurn.message, attachment, requestId,
    })
    return res.status(201).json({ userMessage: userTurn, reply })
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message })
    console.error('Chat generation failed:', error.name || 'DatabaseError')
    return res.status(500).json({ message: 'The chat could not be completed. Please try again.' })
  }
}

async function getChatHistory(req, res) {
  try {
    const filter = { userId: req.user._id }
    if (req.query.role) filter.role = req.query.role
    const chats = await Chat.find(filter).sort({ timestamp: 1 }).lean()
    res.json({ chats })
  } catch (error) {
    console.error('Chat history lookup failed:', error.name || 'DatabaseError')
    res.status(500).json({ message: 'Failed to fetch chat history' })
  }
}

module.exports = { createChat, generateChatReply, getChatHistory }
