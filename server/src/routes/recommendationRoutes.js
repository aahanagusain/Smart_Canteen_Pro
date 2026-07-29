const express = require('express')
const { getRecommendations } = require('../controllers/recommendationController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Recommendations should be accessible to authenticated users
router.post('/', authMiddleware, getRecommendations)

module.exports = router
