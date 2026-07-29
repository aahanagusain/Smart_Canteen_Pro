const Restaurant = require('../models/Restaurant')

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({})
    return res.status(200).json(restaurants)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id })
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    return res.status(200).json(restaurant)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const searchRestaurants = async (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim()
  const category = req.query.category || 'all'

  try {
    const filter = {}

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { cuisine: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    }

    if (category !== 'all') {
      filter.category = category
    }

    const results = await Restaurant.find(filter)
    return res.status(200).json(results)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const createRestaurant = async (req, res) => {
  const { name, location, rating, cuisine, description, category, image } = req.body

  if (!name || !location || !cuisine) {
    return res.status(400).json({ message: 'name, location, and cuisine are required' })
  }

  const id = slugify(name)
  
  try {
    const existing = await Restaurant.findOne({ id })
    if (existing) {
      return res.status(400).json({ message: 'A restaurant with this name already exists' })
    }

    const restaurant = await Restaurant.create({
      id,
      name,
      location,
      rating: rating ?? 4.0,
      cuisine,
      description: description || '',
      category: category || 'savory',
      image: image || '/images/artisan_bakery.png',
      menu: []
    })

    return res.status(201).json(restaurant)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id })
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    const { name, location, rating, cuisine, description, category, image } = req.body

    if (name !== undefined) restaurant.name = name
    if (location !== undefined) restaurant.location = location
    if (rating !== undefined) restaurant.rating = rating
    if (cuisine !== undefined) restaurant.cuisine = cuisine
    if (description !== undefined) restaurant.description = description
    if (category !== undefined) restaurant.category = category
    if (image !== undefined) restaurant.image = image

    await restaurant.save()

    return res.status(200).json(restaurant)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const deleteRestaurant = async (req, res) => {
  try {
    const result = await Restaurant.findOneAndDelete({ id: req.params.id })
    if (!result) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const getRestaurantMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id })
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    return res.status(200).json({
      restaurant,
      menu: restaurant.menu || [],
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  searchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantMenu,
}
