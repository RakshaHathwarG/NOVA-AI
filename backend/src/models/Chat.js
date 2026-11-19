const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['HR', 'Customer Support', 'General'], default: 'General' },
    conversationId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'assistant'], required: true },
    requestId: { type: String },
    replyToRequestId: { type: String },
    videoReference: {
      status: { type: String, enum: ['recommended', 'not_found', 'unavailable'] },
      title: { type: String, maxlength: 300 },
      channel: { type: String, maxlength: 200 },
      thumbnail: { type: String, maxlength: 1000 },
      url: { type: String, maxlength: 300 },
      reason: { type: String, maxlength: 240 },
      message: { type: String, maxlength: 240 },
    },
    attachment: {
      name: { type: String, maxlength: 150 },
      mimeType: { type: String, enum: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] },
      size: { type: Number, min: 1, max: 4 * 1024 * 1024 },
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

chatSchema.index(
  { userId: 1, requestId: 1 },
  { unique: true, partialFilterExpression: { requestId: { $type: 'string' } } },
)
chatSchema.index(
  { userId: 1, replyToRequestId: 1 },
  { unique: true, partialFilterExpression: { replyToRequestId: { $type: 'string' } } },
)

module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
