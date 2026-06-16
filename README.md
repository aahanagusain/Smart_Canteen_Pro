# Smart Canteen Pro - Week 1

Welcome to **Smart Canteen Pro**.
This is the Week 1 prototype of the project, focused on a clean and responsive food-ordering experience.

## How to Run the Project

### Prerequisites

Install [Node.js](https://nodejs.org/) before you begin.

### 1) Install dependencies

Run these commands from the project root:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2) Start the app

Go back to the project root and run:

```bash
npm run dev
```

This starts both apps together:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Login Credentials

### Option 1: Sign-up demo flow

- Open the login page and click **Sign Up**.
- If you enter `user1` as full name, the app signs in with the demo profile name **Tanisha**.
- You can also enter any other name to see it in the welcome message.

### Option 2: Seeded backend login

- On the login page, switch to **Login** mode.
- **Email**: `student@smartcanteen.com`
- **Password**: `week1pass`

## Project Structure

```text
Smart_Canteen/
├── client/              # React (Vite) frontend
│   ├── public/          # Static assets
│   └── src/
│       ├── context/     # App state (CartContext)
│       ├── pages/       # Screens (Login, Home, Menu, Cart)
│       ├── index.css    # Main stylesheet
│       └── main.jsx     # Frontend entry point
├── server/              # Express API backend
│   └── src/
│       ├── controllers/ # API route handlers
│       ├── data/        # Seed/mock data
│       └── index.js     # Backend entry point
└── package.json         # Scripts for running both apps
```

## Week 1 Features

1. **Polished UI**: A modern login screen and a clean canteen browsing layout.
2. **Canteen browsing**: Card-based canteen list with images, ratings, descriptions, and tags.
3. **Cart flow**: Add items, update quantities, remove items, clear cart, and see live total updates.

> Note: Features like filters, coupons, and nutrition tracking are intentionally left for later weeks to keep Week 1 simple.
