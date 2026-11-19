const Feedback = require('../models/Feedback')

async function submitFeedback(req, res) {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  const category = req.body?.category

  if (message.length < 5 || message.length > 2000) {
    return res.status(400).json({ message: 'Feedback must be between 5 and 2000 characters' })
  }
  if (!['bug', 'suggestion', 'other'].includes(category)) {
    return res.status(400).json({ message: 'Choose a valid feedback category' })
  }

  try {
    await Feedback.create({ userId: req.user._id, category, message })
    return res.status(201).json({ message: 'Feedback saved successfully' })
  } catch (error) {
    console.error('Feedback could not be saved:', error.name || 'DatabaseError')
    return res.status(500).json({ message: 'Feedback could not be saved. Please try again.' })
  }
}

module.exports = { submitFeedback }
