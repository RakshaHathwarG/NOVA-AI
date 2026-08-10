const Chat = require('../models/Chat')
const fallbackStore = require('../config/fallbackStore')

async function createChat(req, res) {
  try {
    const { role, message, sender } = req.body

    if (!message || !sender) {
      return res.status(400).json({ message: 'Message and sender are required' })
    }

    let chat

    try {
      chat = await Chat.create({
        userId: req.user._id,
        role: role || 'General',
        message,
        sender,
      })
    } catch (error) {
      chat = fallbackStore.addChat({
        userId: req.user._id,
        role: role || 'General',
        message,
        sender,
      })
    }

    res.status(201).json({ message: 'Chat saved successfully', chat })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save chat', error: error.message })
  }
}

async function getChatHistory(req, res) {
  try {
    const { userId } = req.params

    let chats

    try {
      chats = await Chat.find({ userId }).sort({ timestamp: 1 })
    } catch (error) {
      chats = fallbackStore.getChatsByUserId(userId)
    }

    res.json({ chats })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message })
  }
}

module.exports = { createChat, getChatHistory }
