const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fallbackStore = require('../config/fallbackStore')

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    let user = await User.findById(decoded.id).select('-password').catch(() => null)
    if (!user) {
      user = fallbackStore.findUserById(decoded.id)
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware
