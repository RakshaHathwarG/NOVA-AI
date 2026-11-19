const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.JWT_SECRET) {
  console.error('Server startup failed: JWT_SECRET is not configured.')
  process.exit(1)
}

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ message: 'NOVA AI backend is running' })
})

app.use('/api', authRoutes)
app.use('/api', chatRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
