const express = require('express')
const rateLimit = require('express-rate-limit')
const { register, login, getProfile, updateProfile, toggleFavorite, oauthLogin } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const {
  validateBody,
  registerSchema,
  loginSchema,
  oauthLoginSchema,
  updateProfileSchema,
  toggleFavoriteSchema
} = require('../middleware/validationMiddleware')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 attempts per 15 minutes
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = express.Router()

router.post('/register', authLimiter, validateBody(registerSchema), register)
router.post('/login', authLimiter, validateBody(loginSchema), login)
router.post('/oauth-login', authLimiter, validateBody(oauthLoginSchema), oauthLogin)
router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, validateBody(updateProfileSchema), updateProfile)
router.post('/favorites/toggle', authMiddleware, validateBody(toggleFavoriteSchema), toggleFavorite)

module.exports = router
