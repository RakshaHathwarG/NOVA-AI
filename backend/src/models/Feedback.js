const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, enum: ['bug', 'suggestion', 'other'], default: 'other' },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
