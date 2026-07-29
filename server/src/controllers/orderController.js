const Coupon = require('../models/Coupon')
const Order = require('../models/Order')

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({})
    return res.status(200).json(coupons)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const createOrder = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { items, restaurantName, restaurantId, couponApplied } = req.body

  if (!items || !items.length || !restaurantName) {
    return res.status(400).json({ message: 'Items and restaurantName are required' })
  }

  try {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

    let discount = 0
    let coupon = null

    if (couponApplied) {
      coupon = await Coupon.findOne({ code: couponApplied.toUpperCase() })
      if (!coupon) {
        return res.status(400).json({ message: 'Invalid coupon code' })
      }

      if (subtotal < coupon.minOrder) {
        return res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} is required for this coupon` })
      }

      if (coupon.type === 'flat') {
        discount = coupon.value
      } else if (coupon.type === 'percent') {
        discount = (subtotal * coupon.value) / 100
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount)
        }
      }
      // Make sure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal)
    }

    const total = parseFloat((subtotal - discount).toFixed(2))
    const orderId = `ord-${Math.floor(100 + Math.random() * 900)}`

    const newOrder = await Order.create({
      id: orderId,
      userId: user._id,
      date: new Date(),
      restaurantName,
      restaurantId: restaurantId || '',
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fats: item.fats || 0
      })),
      subtotal,
      couponApplied: couponApplied || null,
      discount: parseFloat(discount.toFixed(2)),
      total,
      status: 'Delivered'
    })

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

module.exports = { getCoupons, createOrder }
