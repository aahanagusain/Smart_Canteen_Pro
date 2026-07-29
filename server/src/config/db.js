const mongoose = require('mongoose')
const seedDatabaseHelper = require('../data/seedDatabaseHelper')
const syncRestaurantsFromSeed = require('../data/syncRestaurants')

let mongod = null

const connectDB = async () => {
  const connStr = process.env.MONGO_URI
  
  if (connStr) {
    try {
      console.log(`Connecting to MongoDB using environment URI...`)
      const conn = await mongoose.connect(connStr, { serverSelectionTimeoutMS: 3000 })
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      
      // Seed if the database is completely empty (no users exist)
      const User = require('../models/User')
      const count = await User.countDocuments()
      if (count === 0) {
        console.log('Database is empty. Automatically seeding mock data...')
        await seedDatabaseHelper()
      } else {
        await syncRestaurantsFromSeed()
      }
      return
    } catch (error) {
      console.error(`Failed to connect using MONGO_URI: ${error.message}`)
      console.log('Falling back to in-memory MongoDB server...')
    }
  }

  // Fallback to In-Memory MongoDB Server
  try {
    console.log('Starting in-memory MongoDB server...')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    console.log(`In-memory MongoDB Server started at: ${uri}`)

    const conn = await mongoose.connect(uri)
    console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`)

    // Seeding mock data on startup for in-memory DB
    console.log('Seeding mock data for In-Memory Database...')
    await seedDatabaseHelper()
  } catch (error) {
    console.error(`In-memory Database Start Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
