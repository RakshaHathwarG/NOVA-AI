const express = require('express')
const { register, login, googleLogin, getProfile } = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleLogin)
router.get('/profile', authMiddleware, getProfile)

module.exports = router
