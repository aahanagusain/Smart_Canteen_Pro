const User = require('../models/User')
const Order = require('../models/Order')

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() })
    
    if (user) {
      // Update existing user credentials seamlessly
      if (name) user.name = name
      user.password = password
      await user.save()
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password,
        phone: '',
        address: '',
        favorites: {
          restaurants: [],
          dishes: []
        }
      })
    }

    return res.status(200).json({
      token: `token-${user._id}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || ''
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Verify password matches
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.status(200).json({
      token: `token-${user._id}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || ''
      },
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const getProfile = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    // Fetch orders for this user
    const orders = await Order.find({ userId: user._id }).sort({ date: -1 })

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      favorites: user.favorites || { restaurants: [], dishes: [] },
      orderHistory: orders
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const updateProfile = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { name, phone, address, email } = req.body

  try {
    const dbUser = await User.findById(user._id)
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name !== undefined) dbUser.name = name
    if (phone !== undefined) dbUser.phone = phone
    if (address !== undefined) dbUser.address = address
    if (email !== undefined) dbUser.email = email

    await dbUser.save()

    // Persist to local JSON file to survive server restarts (due to MongoMemoryServer reset)
    try {
      const fs = require('fs')
      const path = require('path')
      const profilePath = path.join(__dirname, '../data/userProfilePersisted.json')
      let persistedData = {}
      if (fs.existsSync(profilePath)) {
        persistedData = JSON.parse(fs.readFileSync(profilePath, 'utf8') || '{}')
      }
      persistedData[dbUser.email.toLowerCase()] = {
        name: dbUser.name,
        phone: dbUser.phone,
        address: dbUser.address
      }
      fs.writeFileSync(profilePath, JSON.stringify(persistedData, null, 2), 'utf8')
      console.log(`Persisted profile updates locally for: ${dbUser.email}`)
    } catch (fsErr) {
      console.error('Failed to persist profile updates locally:', fsErr.message)
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        address: dbUser.address
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const toggleFavorite = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { type, itemId } = req.body // type: 'restaurants' or 'dishes'

  if (!type || !itemId) {
    return res.status(400).json({ message: 'Type and itemId are required' })
  }

  if (type !== 'restaurants' && type !== 'dishes') {
    return res.status(400).json({ message: 'Invalid favorite type. Must be restaurants or dishes' })
  }

  try {
    const dbUser = await User.findById(user._id)
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!dbUser.favorites) {
      dbUser.favorites = { restaurants: [], dishes: [] }
    }

    const list = dbUser.favorites[type]
    const index = list.indexOf(itemId)
    let isFavorite = false

    if (index >= 0) {
      list.splice(index, 1)
      isFavorite = false
    } else {
      list.push(itemId)
      isFavorite = true
    }

    dbUser.markModified(`favorites.${type}`)
    await dbUser.save()

    return res.status(200).json({
      message: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      favorites: dbUser.favorites,
      isFavorite
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

const oauthLogin = async (req, res) => {
  const { provider, code, email, name } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required for OAuth login' })
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Auto-create user for new OAuth signup
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: `oauth-${provider}-${Math.random().toString(36).slice(-8)}`,
        phone: '',
        address: '',
        favorites: {
          restaurants: [],
          dishes: []
        }
      })
      console.log(`Created new user via OAuth (${provider}): ${user.email}`)
    } else {
      if (name && (!user.name || user.name === user.email.split('@')[0])) {
        user.name = name
        await user.save()
      }
      console.log(`Logged in existing user via OAuth (${provider}): ${user.email}`)
    }

    return res.status(200).json({
      token: `token-${user._id}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || ''
      },
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

module.exports = { register, login, getProfile, updateProfile, toggleFavorite, oauthLogin }
