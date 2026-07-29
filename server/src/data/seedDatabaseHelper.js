const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Coupon = require('../models/Coupon')
const Order = require('../models/Order')

const { users, coupons, restaurants, menuByRestaurant } = require('./seed')

const seedDatabaseHelper = async () => {
  try {
    console.log('Seeding mock data helper triggered...')

    // Clear existing data
    await User.deleteMany({})
    await Restaurant.deleteMany({})
    await Coupon.deleteMany({})
    await Order.deleteMany({})
    console.log('Collections cleared.')

    // Seed Coupons
    await Coupon.insertMany(coupons)
    console.log(`Seeded ${coupons.length} coupons.`)

    // Seed Restaurants with embedded menus
    const restData = restaurants.map((r) => {
      const menu = menuByRestaurant[r.id] || []
      return {
        ...r,
        menu,
      }
    })
    await Restaurant.insertMany(restData)
    console.log(`Seeded ${restData.length} restaurants.`)

    // Seed default users
    for (const u of users) {
      let name = u.name
      let phone = u.phone
      let address = u.address

      try {
        const fs = require('fs')
        const path = require('path')
        const profilePath = path.join(__dirname, 'userProfilePersisted.json')
        if (fs.existsSync(profilePath)) {
          const persisted = JSON.parse(fs.readFileSync(profilePath, 'utf8') || '{}')
          const saved = persisted[u.email.toLowerCase()]
          if (saved) {
            if (saved.name) name = saved.name
            if (saved.phone) phone = saved.phone
            if (saved.address) address = saved.address
            console.log(`Restored persisted profile for user: ${u.email}`)
          }
        }
      } catch (fsErr) {
        console.error('Failed to restore persisted profile:', fsErr.message)
      }

      const createdUser = await User.create({
        name,
        email: u.email,
        password: u.password,
        phone,
        address,
        favorites: u.favorites || { restaurants: [], dishes: [] },
      })
      console.log(`Seeded User: ${createdUser.email}`)

      // If user has orders in mock data, seed them in the Order collection
      if (u.orderHistory && u.orderHistory.length > 0) {
        const ordersToInsert = u.orderHistory.map((o) => ({
          id: o.id,
          userId: createdUser._id,
          date: new Date(o.date),
          restaurantName: o.restaurantName,
          restaurantId: 'dominos-india',
          items: o.items,
          subtotal: o.items.reduce((sum, item) => sum + item.price * item.qty, 0),
          couponApplied: o.couponApplied || null,
          discount: o.discount || 0,
          total: o.total,
          status: o.status || 'Delivered',
        }))
        await Order.insertMany(ordersToInsert)
        console.log(`Seeded ${ordersToInsert.length} order history entries for ${createdUser.email}.`)
      }
    }

    console.log('Seeding Completed successfully.')
  } catch (error) {
    console.error(`Error in seedDatabaseHelper: ${error.message}`)
  }
}

module.exports = seedDatabaseHelper
