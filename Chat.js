const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['HR', 'Customer Support', 'General'],
      default: 'General',
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Chat', chatSchema)
