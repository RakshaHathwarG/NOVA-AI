const mongoose = require('mongoose')

const sessionBriefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['HR', 'Customer Support'], required: true },
  conversationId: { type: String, required: true, trim: true, maxlength: 100 },
  goal: { type: String, default: '', maxlength: 500 },
  importantPoints: { type: String, default: '', maxlength: 2000 },
  followUps: { type: String, default: '', maxlength: 2000 },
  notes: { type: String, default: '', maxlength: 5000 },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
}, { timestamps: true })

sessionBriefSchema.index({ userId: 1, role: 1, conversationId: 1 }, { unique: true })

module.exports = mongoose.models.SessionBrief || mongoose.model('SessionBrief', sessionBriefSchema)
