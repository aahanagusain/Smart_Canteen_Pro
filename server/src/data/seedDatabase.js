const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') })

const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Coupon = require('../models/Coupon')
const Order = require('../models/Order')

const { users, coupons, restaurants, menuByRestaurant } = require('./seed')

const connectForSeeding = async () => {
  const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_canteen'

  try {
    console.log(`Connecting to database for seeding: ${connStr}`)
    await mongoose.connect(connStr, { serverSelectionTimeoutMS: 3000 })
    return
  } catch (error) {
    console.warn(`Could not connect to ${connStr}: ${error.message}`)
    console.log('Falling back to in-memory MongoDB for seeding...')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
    console.log(`Connected to in-memory MongoDB at: ${uri}`)
  }
}

const seedDB = async () => {
  try {
    await connectForSeeding()

    // Clear existing data
    console.log('Clearing existing database collections...')
    await User.deleteMany({})
    await Restaurant.deleteMany({})
    await Coupon.deleteMany({})
    await Order.deleteMany({})
    console.log('Database cleared.')

    // Seed Coupons
    console.log('Seeding coupons...')
    const seededCoupons = await Coupon.insertMany(coupons)
    console.log(`Seeded ${seededCoupons.length} coupons.`)

    // Seed Restaurants (combining with menus)
    console.log('Seeding restaurants with menus...')
    const restData = restaurants.map((r) => {
      const menu = menuByRestaurant[r.id] || []
      return {
        ...r,
        menu,
      }
    })
    const seededRestaurants = await Restaurant.insertMany(restData)
    console.log(`Seeded ${seededRestaurants.length} restaurants.`)

    // Seed Users and their order histories
    console.log('Seeding default user...')
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

      // Create user document first (without orderHistory array if we are referencing it)
      const userObj = {
        name,
        email: u.email,
        password: u.password,
        phone,
        address,
        favorites: u.favorites || { restaurants: [], dishes: [] },
      }
      
      const createdUser = await User.create(userObj)
      console.log(`Seeded User: ${createdUser.email} (ID: ${createdUser._id})`)

      // If user has orders in mock data, seed them in the Order collection
      if (u.orderHistory && u.orderHistory.length > 0) {
        console.log(`Seeding order history for ${createdUser.email}...`)
        const ordersToInsert = u.orderHistory.map((o) => {
          return {
            id: o.id,
            userId: createdUser._id,
            date: new Date(o.date),
            restaurantName: o.restaurantName,
            restaurantId: 'dominos-india', // Default mapping for the mock order
            items: o.items,
            subtotal: o.items.reduce((sum, item) => sum + item.price * item.qty, 0),
            couponApplied: o.couponApplied || null,
            discount: o.discount || 0,
            total: o.total,
            status: o.status || 'Delivered',
          }
        })
        const seededOrders = await Order.insertMany(ordersToInsert)
        console.log(`Seeded ${seededOrders.length} orders for ${createdUser.email}.`)
      }
    }

    console.log('Database Seeding Completed Successfully!')
    process.exit(0)
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`)
    process.exit(1)
  }
}

seedDB()
