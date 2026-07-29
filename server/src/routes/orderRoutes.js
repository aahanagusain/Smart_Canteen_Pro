const express = require('express')
const { getCoupons, createOrder } = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')
const { validateBody, createOrderSchema } = require('../middleware/validationMiddleware')

const router = express.Router()

router.get('/coupons', getCoupons)
router.post('/orders', authMiddleware, validateBody(createOrderSchema), createOrder)

module.exports = router
