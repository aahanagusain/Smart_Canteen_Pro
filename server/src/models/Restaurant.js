const mongoose = require('mongoose')

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
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
  image: {
    type: String,
    default: '',
  },
})

const RestaurantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Use the slug as the unique identifier id
    },
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    rating: {
      type: Number,
      default: 4.0,
    },
    cuisine: {
      type: String,
      required: [true, 'Please add cuisine description'],
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'savory',
    },
    image: {
      type: String,
      default: '/images/artisan_bakery.png',
    },
    menu: {
      type: [MenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.model('Restaurant', RestaurantSchema)
