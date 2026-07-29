const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    default: 0,
  },
  protein: {
    type: Number,
    default: 0,
  },
  carbs: {
    type: Number,
    default: 0,
  },
  fats: {
    type: Number,
    default: 0,
  },
})

const OrderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      default: '',
    },
    items: {
      type: [OrderItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    couponApplied: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Delivered',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.model('Order', OrderSchema)
