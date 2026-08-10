const express = require('express')
const { createChat, getChatHistory } = require('../controllers/chatController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.post('/chat', authMiddleware, createChat)
router.get('/chat-history/:userId', authMiddleware, getChatHistory)

module.exports = router
