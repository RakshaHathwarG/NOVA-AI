const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const googleTokenVerifier = new OAuth2Client()

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    const token = createToken(user)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user)

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

async function googleLogin(req, res) {
  const { credential } = req.body || {}
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return res.status(503).json({ message: 'Google sign-in is not configured on the server' })
  }
  if (!credential || typeof credential !== 'string') {
    return res.status(400).json({ message: 'Google credential is required' })
  }

  let payload
  try {
    const ticket = await googleTokenVerifier.verifyIdToken({ idToken: credential, audience: clientId })
    payload = ticket.getPayload()
  } catch {
    return res.status(401).json({ message: 'Google credential is invalid or expired' })
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    return res.status(401).json({ message: 'Google account must provide a verified email address' })
  }

  try {
    const email = payload.email.toLowerCase().trim()
    const [googleUser, emailUser] = await Promise.all([
      User.findOne({ googleId: payload.sub }),
      User.findOne({ email }),
    ])

    if (googleUser && emailUser && String(googleUser._id) !== String(emailUser._id)) {
      return res.status(409).json({ message: 'This Google account conflicts with an existing NOVA account' })
    }

    let user = googleUser || emailUser
    if (user?.googleId && user.googleId !== payload.sub) {
      return res.status(409).json({ message: 'This email is already linked to a different Google account' })
    }

    if (!user) {
      const generatedPassword = crypto.randomBytes(48).toString('hex')
      const password = await bcrypt.hash(generatedPassword, 10)
      try {
        user = await User.create({
          name: payload.name || email.split('@')[0],
          email,
          password,
          googleId: payload.sub,
        })
      } catch (error) {
        if (error.code !== 11000) throw error
        user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] })
        if (!user || (user.googleId && user.googleId !== payload.sub)) {
          return res.status(409).json({ message: 'This Google account could not be linked to NOVA' })
        }
      }
    }

    if (user && !user.googleId) {
      user.googleId = payload.sub
      await user.save()
    }

    const token = createToken(user)
    return res.json({
      message: 'Google sign-in successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('Google sign-in failed:', error.name || 'AuthenticationError')
    return res.status(500).json({ message: 'Google sign-in could not be completed' })
  }
}

async function getProfile(req, res) {
  try {
    const user = req.user
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Profile fetch failed', error: error.message })
  }
}

module.exports = { register, login, googleLogin, getProfile }
