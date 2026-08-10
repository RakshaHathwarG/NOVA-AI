const mongoose = require('mongoose')

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nova-ai', {
      serverSelectionTimeoutMS: 5000,
    })

    console.log(`MongoDB connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    return false
  }
}

module.exports = connectDB
