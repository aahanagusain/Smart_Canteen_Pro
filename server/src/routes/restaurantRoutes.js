const express = require('express')
const {
  getRestaurants,
  getRestaurantById,
  searchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantMenu,
} = require('../controllers/restaurantController')
const {
  validateBody,
  createRestaurantSchema,
  updateRestaurantSchema
} = require('../middleware/validationMiddleware')

const router = express.Router()

router.get('/search', searchRestaurants)
router.get('/', getRestaurants)
router.post('/', validateBody(createRestaurantSchema), createRestaurant)
router.get('/:id/menu', getRestaurantMenu)
router.get('/:id', getRestaurantById)
router.put('/:id', validateBody(updateRestaurantSchema), updateRestaurant)
router.delete('/:id', deleteRestaurant)

module.exports = router
