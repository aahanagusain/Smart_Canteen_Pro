const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
const orderRoutes = require('./routes/orderRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()

// Connect to Database
connectDB()

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
  : [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true)
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Smart Canteen Pro API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api', orderRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Smart Canteen Pro server running on http://localhost:${PORT}`)
})
