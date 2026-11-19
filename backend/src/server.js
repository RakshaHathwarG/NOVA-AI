const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.JWT_SECRET) {
  console.error('Server startup failed: JWT_SECRET is not configured in backend/.env')
  process.exit(1)
}

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const sessionBriefRoutes = require('./routes/sessionBriefRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '6mb' }))

app.get('/health', (req, res) => {
  res.json({ message: 'NOVA AI backend is running' })
})

app.use('/api', authRoutes)
app.use('/api', chatRoutes)
app.use('/api', feedbackRoutes)
app.use('/api', sessionBriefRoutes)

connectDB().then((connected) => {
  if (!connected) {
    console.error('Server not started because MongoDB is unavailable.')
    process.exitCode = 1
    return
  }
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
  })
})
