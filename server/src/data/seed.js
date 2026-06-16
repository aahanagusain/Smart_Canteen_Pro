const users = [
  {
    id: 'u1',
    name: 'Week 1 Student',
    email: 'student@smartcanteen.com',
    password: 'week1pass',
  },
]

const restaurants = [
  {
    id: 'artisan-crumb-bakery',
    name: 'Artisan Crumb Bakery',
    location: 'Dehradun',
    rating: 4.6,
    cuisine: 'CAKES, PASTRIES & BAKERY',
    description: 'Freshly baked premium bread loaves, cupcakes, and chocolate celebration cakes.',
    category: 'sweets',
    image: '/images/artisan_bakery.png'
  },
  {
    id: 'barbeque-nation',
    name: 'Barbeque Nation',
    location: 'Mumbai',
    rating: 4.7,
    cuisine: 'GRILL & BBQ',
    description: 'Famous for live grill BBQ and unlimited buffet experience.',
    category: 'savory',
    image: '/images/barbeque_skewers.png'
  },
  {
    id: 'baskin-robbins',
    name: 'Baskin Robbins',
    location: 'Mumbai',
    rating: 4.5,
    cuisine: 'ICE CREAM & DESSERTS',
    description: '31 legendary flavors of rich premium ice creams, sundae cups, and shakes.',
    category: 'sweets',
    image: '/images/ice_cream_cone.png'
  },
  {
    id: 'dominos-india',
    name: "Domino's India",
    location: 'Delhi',
    rating: 4.2,
    cuisine: 'PIZZA & FAST FOOD',
    description: 'Hot, fresh, oven-baked pizzas, garlic breads, and pasta bowls.',
    category: 'savory',
    image: '/images/barbeque_skewers.png'
  },
  {
    id: 'sagar-ratna',
    name: 'Sagar Ratna',
    location: 'Delhi',
    rating: 4.4,
    cuisine: 'SOUTH INDIAN VEG',
    description: 'Authentic South Indian vegetarian delicacies, dosas, and filter coffee.',
    category: 'savory',
    image: '/images/artisan_bakery.png'
  }
]

const menuByRestaurant = {
  'artisan-crumb-bakery': [
    { name: 'Chocolate Celebration Cake', price: 350, calories: 450, protein: 6, carbs: 55, fats: 22 },
    { name: 'Red Velvet Cupcake', price: 90, calories: 250, protein: 3, carbs: 35, fats: 11 },
    { name: 'Sourdough Bread Loaf', price: 120, calories: 180, protein: 7, carbs: 38, fats: 1.5 }
  ],
  'barbeque-nation': [
    { name: 'Paneer Tikka Skewer', price: 250, calories: 320, protein: 15, carbs: 12, fats: 24 },
    { name: 'Veg Seekh Kabab', price: 220, calories: 280, protein: 12, carbs: 18, fats: 18 },
    { name: 'Grilled Pineapple', price: 180, calories: 120, protein: 1, carbs: 30, fats: 0 }
  ],
  'baskin-robbins': [
    { name: 'Mississippi Mud Scoop', price: 120, calories: 260, protein: 8, carbs: 32, fats: 6, image: '/images/chocolate_mud_scoop.png' },
    { name: 'Cotton Candy Scoop', price: 110, calories: 240, protein: 8, carbs: 28, fats: 6, image: '/images/pink_candy_scoop.png' },
    { name: 'Mint Chocolate Chip Scoop', price: 130, calories: 270, protein: 9, carbs: 30, fats: 7, image: '/images/ice_cream_cone.png' }
  ],
  'dominos-india': [
    { name: 'Farmhouse Pizza', price: 329, calories: 600, protein: 22, carbs: 75, fats: 20 },
    { name: 'Paneer Pizza', price: 359, calories: 650, protein: 25, carbs: 78, fats: 22 },
    { name: 'Garlic Bread', price: 149, calories: 350, protein: 8, carbs: 45, fats: 14 }
  ],
  'sagar-ratna': [
    { name: 'Rava Dosa', price: 220, calories: 350, protein: 8, carbs: 60, fats: 8 },
    { name: 'Onion Uttapam', price: 210, calories: 380, protein: 9, carbs: 65, fats: 9 },
    { name: 'Curd Rice', price: 170, calories: 280, protein: 6, carbs: 45, fats: 8 }
  ]
}

module.exports = { users, restaurants, menuByRestaurant }

