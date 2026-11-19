const express = require('express')
const { createChat, generateChatReply, getChatHistory } = require('../controllers/chatController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.post('/chat', authMiddleware, createChat)
router.post('/chat/generate', authMiddleware, generateChatReply)
router.get(['/chat-history', '/chat-history/:userId'], authMiddleware, getChatHistory)

module.exports = router
