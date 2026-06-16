const { users } = require('../data/seed')

const login = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  return res.status(200).json({
    token: 'week1-demo-token',
    user: { id: user.id, name: user.name, email: user.email },
  })
}

module.exports = { login }
