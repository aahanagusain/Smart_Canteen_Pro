const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

app.use(
  cors({
    origin: CLIENT_URL,
  })
)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Week 1 API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)

app.listen(PORT, () => {
  console.log(`Week1 server running on http://localhost:${PORT}`)
})
