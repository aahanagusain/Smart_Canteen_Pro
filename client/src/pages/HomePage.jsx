import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Loader, Toast } from '../components/ui'

const DEFAULT_RESTAURANT_IMAGE =
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
const DEFAULT_DISH_IMAGE =
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [favorites, setFavorites] = useState({ restaurants: [], dishes: [] })
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()
  const skipSearchEffect = useRef(true)

  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type })
  }

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { data } = await api.get('/api/auth/profile')
        setFavorites(data.favorites)
      } catch {
        setFavorites({ restaurants: [], dishes: [] })
      }
    }
    loadFavorites()
  }, [])

  const fetchRestaurants = useCallback(async (query, cat, isInitial = false) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setSearching(true)
    }

    try {
      const params = {}
      if (query) params.q = query
      if (cat && cat !== 'all') params.category = cat

      const hasFilters = query || (cat && cat !== 'all')
      const endpoint = hasFilters ? '/api/restaurants/search' : '/api/restaurants'
      const { data } = await api.get(endpoint, { params: hasFilters ? params : undefined })
      setRestaurants(data)
    } catch {
      showToast('Could not load restaurants')
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    fetchRestaurants('', 'all', true)
  }, [fetchRestaurants])

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false
      return undefined
    }
    if (loading) return undefined

    const timer = setTimeout(() => {
      fetchRestaurants(search, category)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, category, loading, fetchRestaurants])

  const toggleFavorite = async (e, id) => {
    e.stopPropagation()
    try {
      const { data } = await api.post('/api/auth/favorites/toggle', { type: 'restaurants', itemId: id })
      setFavorites(data.favorites)
      showToast(data.message, 'success')
    } catch {
      showToast('Could not update favorite restaurant')
    }
  }

  return (
    <main className="page" style={{ paddingTop: 20 }}>
      <section className="home-welcome-section" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-dark)' }}>Explore Indian Canteens</h2>
        <p style={{ color: '#6e6b68', fontSize: 15, marginTop: 4 }}>
          Discover and order delicious food with dynamic smart nutrition summaries.
        </p>
      </section>

      <div className="search-filter-row">
        <input
          type="text"
          placeholder="Search canteens, cuisines..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="savory">Savory</option>
          <option value="sweets">Sweets & Desserts</option>
        </select>
      </div>

      <div className="category-tabs">
        <button
          className={`category-tab ${category === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        <button
          className={`category-tab ${category === 'savory' ? 'active' : ''}`}
          onClick={() => setCategory('savory')}
        >
          Savory
        </button>
        <button
          className={`category-tab ${category === 'sweets' ? 'active' : ''}`}
          onClick={() => setCategory('sweets')}
        >
          Sweets
        </button>
      </div>

      {loading ? <Loader text="Loading restaurants..." /> : null}
      {searching && !loading ? <Loader text="Searching..." size="sm" /> : null}

      {!loading && (
        <section className="restaurant-grid">
          {restaurants.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: 40 }}>
              No restaurants match your search or filter.
            </p>
          ) : (
            restaurants.map((r) => {
              const isFav = favorites.restaurants.includes(r.id)
              return (
                <article
                  key={r.id}
                  className="restaurant-card"
                  onClick={() => navigate(`/restaurants/${r.id}/menu`)}
                >
                  <div className="restaurant-image-wrapper">
                    <img
                      className="restaurant-image"
                      src={r.image || DEFAULT_RESTAURANT_IMAGE}
                      alt={r.name}
                    />
                    <button
                      className={`favorite-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(e, r.id)}
                      title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      {isFav ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  <div className="restaurant-info">
                    <div className="restaurant-info-header">
                      <h3 className="restaurant-name">{r.name}</h3>
                      <span className="restaurant-rating">{r.rating}</span>
                    </div>
                    <p className="restaurant-location">{r.location}</p>
                    <p className="restaurant-desc">{r.description}</p>
                    <span className="restaurant-tag">{r.cuisine}</span>
                  </div>
                </article>
              )
            })
          )}
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
