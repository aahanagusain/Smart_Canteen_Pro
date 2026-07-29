# Smart Canteen Pro

Welcome to **Smart Canteen Pro**.
A full-stack food ordering application with a clean, responsive interface for browsing canteens, viewing menus, and managing orders.

## 🚀 Live Deployments
* **Live Frontend (Vercel)**: [https://smart-canteen-pro.vercel.app](https://smart-canteen-pro.vercel.app)
* **Live Backend API (Render)**: [https://smart-canteen-pro.onrender.com](https://smart-canteen-pro.onrender.com)

## 🛠️ Tech Stack Summary
* **Frontend**: React (v19), Vite, React Router DOM (v7), Axios, Vanilla CSS styling.
* **Backend**: Node.js, Express, CORS configuration, Zod validation.
* **Database**: MongoDB Atlas (Cloud Database), Mongoose (ODM).
* **AI Integration**: Google Gemini API (for personalized food recommendations).

## ⚠️ Free-Tier Hosting Limitations
Since this project is hosted on free cloud tiers, please note the following:
1. **Cold Starts (Render Backend)**: Render automatically spins down the backend service after 15 minutes of inactivity. When visiting the site for the first time or after a break, the initial request (loading canteens or signing in) may take **50–60 seconds** to respond while the server wakes up. Subsequent actions are fast.
2. **Storage Limit (MongoDB Atlas)**: The database is hosted on the free M0 sandbox, limiting storage to **512 MB**, which is fully sufficient for testing.
3. **Serverless Timeout (Vercel Frontend)**: The frontend is served instantly via Vercel Edge networks, but API calls back to Render are subject to Render's cold start time.

## How to Run the Project

### Prerequisites

Install [Node.js](https://nodejs.org/) before you begin.

### How to Run Backend Locally

From the project root:

```bash
cd server
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

The API runs at [http://localhost:5000](http://localhost:5000).

Environment variables (see `server/.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `5000`) |
| `CLIENT_URL` | Frontend origin for CORS (default: `http://localhost:3000`) |

### How to Run Frontend Locally

```bash
cd client
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Run Both Together

From the project root:

```bash
npm install
npm run dev
```

This starts both apps together:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 1) Install dependencies (first-time setup)

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

## Login Credentials

### Sign up

- Open the login page and click **Sign Up**.
- Create an account with your name, email, and password.

### Demo login

- On the login page, switch to **Login** mode.
- **Email**: `ria@gmail.com`
- **Password**: `password123`

## Project Structure

```text
Smart_Canteen/
├── client/              # React (Vite) frontend
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # App state (CartContext)
│       ├── pages/       # Screens (Login, Home, Menu, Cart, Profile)
│       ├── index.css    # Main stylesheet
│       └── main.jsx     # Frontend entry point
├── server/              # Express API backend
│   └── src/
│       ├── controllers/ # API route handlers
│       ├── data/        # Seed/mock data
│       └── index.js     # Backend entry point
└── package.json         # Scripts for running both apps
```

## Features

1. **Authentication**: Sign up, login, and protected routes.
2. **Canteen browsing**: Search, filter, and explore restaurants with ratings and details.
3. **Menu and cart**: Add items, update quantities, apply coupons, and checkout.
4. **Profile dashboard**: Manage account details, favorites, and order history.
5. **UI component library**: Reusable Button, Input, Modal, Toast, and Loader components.

## Database Integration (Week 5)

We migrated the Smart Canteen Pro backend from temporary in-memory arrays to a real database using **MongoDB Atlas + Mongoose**.

### Why MongoDB?
- **Flexible Schema**: MongoDB matches the document structure of our canteen, menu, and user models.
- **Embedded Documents**: MenuItem and OrderItem are stored as subdocuments inside Restaurant and Order collections respectively, avoiding complex SQL joins and improving speed.
- **Node.js/Express Ecosystem**: Mongoose makes it straightforward to build clean validation schemas, run complex queries, and integrate with standard Express middleware.
- **Excellent Developer Experience**: For testing convenience, we have configured a smart database connection module. If no cloud MongoDB connection string is provided, the backend automatically spins up an in-memory database daemon using `mongodb-memory-server` and pre-seeds it! This ensures the app runs out-of-the-box for grading without requiring manual DB configuration.

### Database Schema Diagram
Below is the database entity-relationship schema showing collections, fields, and relationships:

![Smart Canteen Schema Diagram](docs/W5_SchemaDiagram_TBI-26100589.png)

### Database Setup Instructions

1. **Environment Variables**:
   In `server/.env`, specify your MongoDB Atlas URI:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_canteen?retryWrites=true&w=majority
   ```
   *Note: If `MONGO_URI` is omitted or unable to connect, the server will fall back to a local in-memory database and populate it automatically with mock canteens and user profiles.*

2. **Seeding the Database Manually**:
   If you are using a cloud MongoDB cluster and want to seed it manually, run:
   ```bash
   cd server
   node src/data/seedDatabase.js
   ```

## REST API Endpoints (Week 5 Database Integrated)

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/search?q=&category=` | Search/filter restaurants |
| GET | `/api/restaurants/:id` | Get one restaurant |
| POST | `/api/restaurants` | Create a restaurant |
| PUT | `/api/restaurants/:id` | Update a restaurant |
| DELETE | `/api/restaurants/:id` | Delete a restaurant |
| GET | `/api/restaurants/:id/menu` | Get restaurant menu |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/coupons` | List coupons |
| POST | `/api/orders` | Place order (auth required) |

## Component Library

Reusable components live in `client/src/components/ui/`.
View the demo page at `/components-demo` after starting the app.
