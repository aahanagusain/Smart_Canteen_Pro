import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useCart } from '../context/CartContext'
import { Loader } from '../components/ui'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const userName = user?.name || 'Tanisha'

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/restaurants')
        setRestaurants(data)
      } catch {
        setError('Could not load restaurants')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <main className="page">
      {/* Redesigned Header Area */}
      <header className="home-header">
        <div className="home-header-top">
          <div>
            <h1 className="home-title">Smart Canteen Pro</h1>
            <p className="home-subtitle">Namaste, {userName}! Explore top Indian restaurants.</p>
          </div>
          <div className="header-buttons">
            <Link className="btn-secondary" to="/components-demo" style={{ display: 'inline-flex', alignItems: 'center' }}>
              UI Demo
            </Link>
            <Link className="btn-cart-badge" to="/cart">
              Cart ({totalItems})
            </Link>
            <button className="btn-logout-gradient" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Loading & Error States */}
      {loading ? <Loader text="Loading restaurants..." /> : null}
      {error ? <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p> : null}

      {/* Restaurant Cards Grid */}
      {!loading && !error && (
        <section className="restaurant-grid">
          {restaurants.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: 40 }}>
              No restaurants found.
            </p>
          ) : (
            restaurants.map((r) => (
              <article
                key={r.id}
                className="restaurant-card"
                onClick={() => navigate(`/restaurants/${r.id}/menu`)}
              >
                <div className="restaurant-image-wrapper">
                  <img
                    className="restaurant-image"
                    src={r.image || '/images/artisan_bakery.png'}
                    alt={r.name}
                  />
                </div>
                <div className="restaurant-info">
                  <div className="restaurant-info-header">
                    <h3 className="restaurant-name">{r.name}</h3>
                    <span className="restaurant-rating">
                      {r.rating} <span style={{ fontSize: 10 }}>★</span>
                    </span>
                  </div>
                  <p className="restaurant-location">{r.location}</p>
                  <p className="restaurant-desc">{r.description}</p>
                  <span className="restaurant-tag">{r.cuisine}</span>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  )
}
