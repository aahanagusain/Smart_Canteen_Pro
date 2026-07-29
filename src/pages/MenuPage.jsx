import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { useCart } from '../context/CartContext'
import { Loader, Toast } from '../components/ui'

const DEFAULT_DISH_IMAGE =
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'

export default function MenuPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [favorites, setFavorites] = useState({ restaurants: [], dishes: [] })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' })
  const { addToCart } = useCart()

  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type })
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [resMenu, resProfile] = await Promise.all([
          api.get(`/api/restaurants/${id}/menu`),
          api.get('/api/auth/profile').catch(() => ({ data: { favorites: { restaurants: [], dishes: [] } } })),
        ])
        setRestaurant(resMenu.data.restaurant)
        setMenu(resMenu.data.menu)
        setFavorites(resProfile.data.favorites)
      } catch {
        showToast('Failed to load menu')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const toggleFavoriteDish = async (dishName) => {
    try {
      const { data } = await api.post('/api/auth/favorites/toggle', { type: 'dishes', itemId: dishName })
      setFavorites(data.favorites)
      showToast(data.message, 'success')
    } catch {
      showToast('Could not update favorite dish')
    }
  }

  return (
    <main className="page" style={{ paddingTop: 20 }}>
      <div className="cart-title-row">
        <div>
          <h1 style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: 32 }}>
            {restaurant ? `${restaurant.name}` : 'Menu'}
          </h1>
          {restaurant && (
            <p style={{ color: '#d15a28', fontWeight: 600, fontSize: 15, marginTop: 4 }}>
              {restaurant.location} | {restaurant.cuisine}
            </p>
          )}
        </div>
        <div className="cart-title-actions">
          <Link to="/" className="btn-secondary">
            ← Back to Canteens
          </Link>
        </div>
      </div>

      <p style={{ color: '#6e6b68', fontSize: 14, marginBottom: 24 }}>
        {restaurant?.description || 'Select delicious dishes to add to your order.'}
      </p>

      {/* Map Embed Section */}
      {restaurant && (
        <section 
          id="restaurant-map-section"
          style={{ 
            marginBottom: 28, 
            background: 'var(--bg-surface)', 
            border: 'var(--card-border)',
            borderRadius: 16,
            boxShadow: 'var(--card-shadow)',
            padding: 20
          }}
        >
          <h3 
            id="restaurant-map-heading"
            style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: 'var(--text-dark)', 
              marginBottom: 12, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6 
            }}
          >
            📍 Restaurant Location Map
          </h3>
          <div 
            id="restaurant-map-container"
            style={{ 
              borderRadius: 12, 
              overflow: 'hidden', 
              border: '1px solid var(--border-color)', 
              height: 250, 
              width: '100%', 
              background: 'var(--bg-light)' 
            }}
          >
            <iframe
              id="restaurant-map-iframe"
              title="Restaurant Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.name + ', Dehradun')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      )}

      {loading ? <Loader text="Loading menu items..." /> : null}

      {!loading && restaurant && (
        <section className="restaurant-grid">
          {menu.map((item) => {
            const itemImage = item.image || DEFAULT_DISH_IMAGE
            const isDishFav = favorites.dishes.includes(item.name)

            return (
              <article key={item.name} className="restaurant-card" style={{ cursor: 'default' }}>
                <div className="restaurant-image-wrapper" style={{ height: 160 }}>
                  <img className="restaurant-image" src={itemImage} alt={item.name} />
                  <button
                    className={`favorite-btn ${isDishFav ? 'active' : ''}`}
                    onClick={() => toggleFavoriteDish(item.name)}
                    title={isDishFav ? 'Remove from Favorites' : 'Add to Favorites'}
                  >
                    {isDishFav ? 'Saved' : 'Save'}
                  </button>
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

                  <div style={{ display: 'flex', gap: 6, fontSize: 11, color: '#706865', marginBottom: 12 }}>
                    <span>{item.calories} kcal</span>
                    <span>| P: {item.protein}g</span>
                    <span>| C: {item.carbs}g</span>
                    <span>| F: {item.fats}g</span>
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

      <Toast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </main>
  )
}
