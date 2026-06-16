import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { useCart } from '../context/CartContext'

export default function MenuPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToCart, totalItems } = useCart()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/restaurants/${id}/menu`)
        setRestaurant(data.restaurant)
        setMenu(data.menu)
      } catch {
        setError('Failed to load menu')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <main className="page">
      {/* Redesigned Menu Header */}
      <div className="cart-title-row">
        <div>
          <h1 style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: 32 }}>
            {restaurant ? `${restaurant.name}` : 'Menu'}
          </h1>
          {restaurant && (
            <p style={{ color: '#d15a28', fontWeight: 600, fontSize: 15, marginTop: 4 }}>
              📍 {restaurant.location} • {restaurant.cuisine}
            </p>
          )}
        </div>
        <div className="cart-title-actions">
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link to="/cart" className="btn-cart-badge">
            Cart ({totalItems})
          </Link>
        </div>
      </div>

      <p style={{ color: '#6e6b68', fontSize: 14, marginBottom: 24 }}>
        {restaurant?.description || 'Select delicious dishes to add to your order.'}
      </p>

      {loading ? <p style={{ textAlign: 'center', padding: 40 }}>Loading menu items...</p> : null}
      {error ? <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p> : null}

      {/* Menu Grid */}
      {!loading && !error && (
        <section className="restaurant-grid">
          {menu.map((item) => {
            const itemImage =
              item.image ||
              (item.name.toLowerCase().includes('mud')
                ? '/images/chocolate_mud_scoop.png'
                : item.name.toLowerCase().includes('cotton')
                ? '/images/pink_candy_scoop.png'
                : '/images/ice_cream_cone.png')

            return (
              <article
                key={item.name}
                className="restaurant-card"
                style={{ cursor: 'default' }}
              >
                <div className="restaurant-image-wrapper" style={{ height: 160 }}>
                  <img className="restaurant-image" src={itemImage} alt={item.name} />
                </div>
                <div className="restaurant-info" style={{ padding: 16 }}>
                  <div className="restaurant-info-header" style={{ marginBottom: 8 }}>
                    <h3 className="restaurant-name" style={{ fontSize: 16 }}>
                      {item.name}
                    </h3>
                    <span style={{ color: '#0b9e3a', fontWeight: 700, fontSize: 16 }}>
                      ₹{item.price}
                    </span>
                  </div>
                  <button
                    className="btn-rainbow"
                    style={{ padding: '10px 14px', fontSize: 14, borderRadius: 8, marginTop: 'auto' }}
                    onClick={() => addToCart(id, restaurant?.name, item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
