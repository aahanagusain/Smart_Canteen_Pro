const Restaurant = require('../models/Restaurant')
const { restaurants, menuByRestaurant } = require('./seed')

const syncRestaurantsFromSeed = async () => {
  try {
    let created = 0
    let updated = 0

    for (const r of restaurants) {
      const menu = menuByRestaurant[r.id] || []
      const existing = await Restaurant.findOne({ id: r.id })

      if (existing) {
        await Restaurant.updateOne({ id: r.id }, { ...r, menu })
        updated += 1
      } else {
        await Restaurant.create({ ...r, menu })
        created += 1
      }
    }

    console.log(
      `Restaurant sync: ${restaurants.length} in catalog (${created} added, ${updated} refreshed).`
    )
  } catch (error) {
    console.error(`Restaurant sync failed: ${error.message}`)
  }
}

module.exports = syncRestaurantsFromSeed
