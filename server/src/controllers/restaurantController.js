const { menuByRestaurant, restaurants } = require('../data/seed')

const getRestaurants = (req, res) => {
  return res.status(200).json(restaurants)
}

const getRestaurantMenu = (req, res) => {
  const { id } = req.params
  const restaurant = restaurants.find((r) => r.id === id)
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }
  return res.status(200).json({
    restaurant,
    menu: menuByRestaurant[id] || [],
  })
}

module.exports = { getRestaurants, getRestaurantMenu }
