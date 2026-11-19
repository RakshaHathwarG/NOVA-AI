const express = require('express')
const authMiddleware = require('../middleware/auth')
const { getSessionBrief, saveSessionBrief, deleteSessionBrief } = require('../controllers/sessionBriefController')

const router = express.Router()
router.get('/session-brief', authMiddleware, getSessionBrief)
router.put('/session-brief', authMiddleware, saveSessionBrief)
router.delete('/session-brief', authMiddleware, deleteSessionBrief)

module.exports = router
