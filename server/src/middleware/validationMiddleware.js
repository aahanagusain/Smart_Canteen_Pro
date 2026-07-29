const { z } = require('zod')

// Generic validation middleware wrapper
const validateBody = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError || error.name === 'ZodError') {
      const issues = error.issues || error.errors || []
      const errorMessages = issues.map(err => {
        const pathStr = err.path && err.path.length > 0 ? `${err.path.join('.')}: ` : ''
        return `${pathStr}${err.message}`
      }).join(', ')
      return res.status(400).json({
        message: `Validation failed: ${errorMessages}`,
        errors: issues
      })
    }
    return res.status(400).json({ message: error.message || 'Validation failed' })
  }
}

// Schemas definitions

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

const oauthLoginSchema = z.object({
  provider: z.enum(['google', 'github'], {
    errorMap: () => ({ message: "Provider must be either 'google' or 'github'" })
  }),
  code: z.string().min(1, 'Authorization code is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  name: z.string().optional()
})

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal(''))
})

const toggleFavoriteSchema = z.object({
  type: z.enum(['restaurants', 'dishes'], {
    errorMap: () => ({ message: "Type must be either 'restaurants' or 'dishes'" })
  }),
  itemId: z.string().min(1, 'Item ID is required')
})

const createOrderSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  restaurantId: z.string().optional().nullable(),
  couponApplied: z.string().optional().nullable(),
  items: z.array(
    z.object({
      name: z.string().min(1, 'Item name is required'),
      price: z.number().positive('Price must be greater than zero'),
      qty: z.number().int().positive('Quantity must be a positive integer'),
      calories: z.number().optional(),
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fats: z.number().optional()
    })
  ).min(1, 'Order must contain at least 1 item')
})

const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  location: z.string().min(1, 'Location is required'),
  cuisine: z.string().min(1, 'Cuisine type is required'),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional()
})

const updateRestaurantSchema = createRestaurantSchema.partial()

module.exports = {
  validateBody,
  registerSchema,
  loginSchema,
  oauthLoginSchema,
  updateProfileSchema,
  toggleFavoriteSchema,
  createOrderSchema,
  createRestaurantSchema,
  updateRestaurantSchema
}
