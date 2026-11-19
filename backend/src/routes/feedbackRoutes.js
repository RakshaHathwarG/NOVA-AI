const express = require('express')
const authMiddleware = require('../middleware/auth')
const { submitFeedback } = require('../controllers/feedbackController')

const router = express.Router()
router.post('/feedback', authMiddleware, submitFeedback)

module.exports = router
