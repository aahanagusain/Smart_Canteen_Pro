import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useCart } from '../context/CartContext'
import { Button, Input, Loader } from '../components/ui'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('details') // details, canteens, dishes, history
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({ restaurants: [], dishes: [] })
  const [orderHistory, setOrderHistory] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [allMenuItems, setAllMenuItems] = useState([])
  
  // Profile Details Form State
  const [profileDetails, setProfileDetails] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || {}
    return {
      name: savedUser.name || '',
      email: savedUser.email || '',
      phone: savedUser.phone || '',
      address: savedUser.address || ''
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  const { addToCart, reorder } = useCart()
  const navigate = useNavigate()

  const loadProfileData = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user')) || {}
      const [profileRes, restRes] = await Promise.all([
        api.get('/api/auth/profile').catch(() => ({ data: savedUser })),
        api.get('/api/restaurants')
      ])
      
      const profile = profileRes.data || savedUser
      setFavorites(profile.favorites || { restaurants: [], dishes: [] })
      setProfileDetails({
        name: profile.name || savedUser.name || '',
        email: profile.email || savedUser.email || '',
        phone: profile.phone || savedUser.phone || '',
        address: profile.address || savedUser.address || ''
      })
      setOrderHistory(profile.orderHistory || [])
      setRestaurants(restRes.data)

      // Fetch all menus to cross-reference favorite dishes
      const menuPromises = restRes.data.map(r => api.get(`/api/restaurants/${r.id}/menu`))
      const menusData = await Promise.all(menuPromises)
      
      const allItems = []
      menusData.forEach((mRes) => {
        const { restaurant, menu } = mRes.data
        menu.forEach((item) => {
          allItems.push({
            ...item,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
          })
        })
      })
      setAllMenuItems(allItems)
    } catch (err) {
      console.error('Failed to load profile data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaveSuccess('')
    setSaveError('')
    try {
      const { data } = await api.put('/api/auth/profile', profileDetails)
      setSaveSuccess(data.message || 'Details updated successfully!')
      setIsEditing(false)
      // Update local storage username greeting and profile info
      const currentUser = JSON.parse(localStorage.getItem('user')) || {}
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...data.user,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address
      }))
      loadProfileData()
    } catch {
      setSaveError('Failed to update profile details.')
    }
  }

  const toggleFavoriteCanteen = async (id) => {
    try {
      const { data } = await api.post('/api/auth/favorites/toggle', { type: 'restaurants', itemId: id })
      setFavorites(data.favorites)
    } catch {
      alert('Failed to update favorite canteens.')
    }
  }

  const toggleFavoriteDish = async (dishName) => {
    try {
      const { data } = await api.post('/api/auth/favorites/toggle', { type: 'dishes', itemId: dishName })
      setFavorites(data.favorites)
    } catch {
      alert('Failed to update favorite dishes.')
    }
  }

  const handleReorder = (order) => {
    reorder(order.restaurantId || 'dominos-india', order.restaurantName, order.items)
    alert(`Added items from order ${order.id} to cart!`)
    navigate('/cart')
  }

  // Filter canteens and dishes that user favorited
  const favRestaurants = restaurants.filter(r => favorites.restaurants.includes(r.id))
  
  // Find full menu details for favorited dishes
  const favDishes = allMenuItems.filter(item => favorites.dishes.includes(item.name))

  if (loading) {
    return (
      <main className="page" style={{ textAlign: 'center', padding: 80 }}>
        <Loader text="Loading your profile dashboard..." />
      </main>
    )
  }

  return (
    <main className="page" style={{ paddingTop: 20 }}>
      {/* Page Header */}
      <section className="home-welcome-section" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-red)' }}>Your Profile Dashboard</h2>
        <p style={{ color: '#6e6b68', fontSize: 15, marginTop: 4 }}>
          Manage your contact info, favorite canteens and dishes, and review your order history.
        </p>
      </section>

      <div className="profile-layout">
        {/* Left Side: Tabs Navigation */}
        <aside className="profile-tabs-sidebar">
          <button 
            className={`profile-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Account Details
          </button>
          <button 
            className={`profile-tab-btn ${activeTab === 'canteens' ? 'active' : ''}`}
            onClick={() => setActiveTab('canteens')}
          >
            Favorite Canteens ({favRestaurants.length})
          </button>
          <button 
            className={`profile-tab-btn ${activeTab === 'dishes' ? 'active' : ''}`}
            onClick={() => setActiveTab('dishes')}
          >
            Favorite Dishes ({favDishes.length})
          </button>
          <button 
            className={`profile-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Order History ({orderHistory.length})
          </button>
        </aside>

        {/* Right Side: Tab Panel Content */}
        <section className="profile-panel-content">
          
          {/* Tab 1: Account Details */}
          {activeTab === 'details' && (
            <div className="profile-panel-card">
              <div className="profile-user-hero">
                <div className="profile-user-avatar">
                  {profileDetails.name ? profileDetails.name.substring(0, 2).toUpperCase() : 'SC'}
                </div>
                <div>
                  <h3>{profileDetails.name || 'User'}</h3>
                  <p>{profileDetails.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input
                  id="profile-name"
                  label="Full Name"
                  value={profileDetails.name}
                  onChange={(e) => setProfileDetails({ ...profileDetails, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
                
                <Input
                  id="profile-email"
                  label="Email Address"
                  type="email"
                  value={profileDetails.email}
                  onChange={(e) => setProfileDetails({ ...profileDetails, email: e.target.value })}
                  placeholder="Enter your email address"
                  required
                />

                <Input
                  id="profile-phone"
                  label="Phone Number"
                  value={profileDetails.phone}
                  onChange={(e) => setProfileDetails({ ...profileDetails, phone: e.target.value })}
                  placeholder="Enter your phone number (e.g. +91 98765 43210)"
                />

                <div className="ui-input-group">
                  <label className="ui-input-label" htmlFor="profile-address">Delivery Address</label>
                  <textarea
                    id="profile-address"
                    className="ui-input"
                    style={{ minHeight: 90, resize: 'vertical' }}
                    value={profileDetails.address}
                    onChange={(e) => setProfileDetails({ ...profileDetails, address: e.target.value })}
                    placeholder="Enter your hostel room, block, or home delivery address..."
                  />
                </div>

                {saveSuccess && <p style={{ color: '#0f8b34', fontSize: 14, fontWeight: 600 }}>{saveSuccess}</p>}
                {saveError && <p style={{ color: '#dc2626', fontSize: 14, fontWeight: 600 }}>{saveError}</p>}

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <Button type="submit" variant="gradient">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Favorite Canteens */}
          {activeTab === 'canteens' && (
            <div className="profile-panel-card">
              <h3>Favorite Canteens</h3>
              <p style={{ color: '#6e6b68', fontSize: 14, marginBottom: 20 }}>Canteens you added to your favorite list.</p>
              
              {favRestaurants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#faf8f5', borderRadius: 12, border: '1px dashed #e1dbd5' }}>
                  <p style={{ color: '#888' }}>You haven't favorited any canteens yet.</p>
                  <Button variant="secondary" style={{ marginTop: 12 }} onClick={() => navigate('/')}>
                    Browse Canteens
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {favRestaurants.map((r) => (
                    <div key={r.id} className="fav-item-row" onClick={() => navigate(`/restaurants/${r.id}/menu`)}>
                      <img className="fav-item-image" src={r.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'} alt={r.name} />
                      <div className="fav-item-details">
                        <h4>{r.name}</h4>
                        <p style={{ color: '#d15a28', fontWeight: 600, fontSize: 13 }}>{r.location} | {r.cuisine}</p>
                        <p style={{ color: '#6e6b68', fontSize: 13, marginTop: 2 }}>{r.description}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="favorite-btn active"
                          onClick={() => toggleFavoriteCanteen(r.id)}
                          title="Remove from favorites"
                          style={{ position: 'static' }}
                        >
                          Saved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Favorite Dishes */}
          {activeTab === 'dishes' && (
            <div className="profile-panel-card">
              <h3>Favorite Dishes</h3>
              <p style={{ color: '#6e6b68', fontSize: 14, marginBottom: 20 }}>Dishes you marked as favorites. You can add them straight to your cart!</p>

              {favDishes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#faf8f5', borderRadius: 12, border: '1px dashed #e1dbd5' }}>
                  <p style={{ color: '#888' }}>You haven't favorited any dishes yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {favDishes.map((dish) => (
                    <div key={dish.name} className="fav-item-row" style={{ cursor: 'default' }}>
                      <img className="fav-item-image" src={dish.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'} alt={dish.name} />
                      <div className="fav-item-details">
                        <h4>{dish.name}</h4>
                        <p style={{ color: '#8c8882', fontSize: 12 }}>From: <span style={{ fontWeight: 600, color: '#555' }}>{dish.restaurantName}</span></p>
                        
                        {/* Nutrition indicator */}
                        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#706865', marginTop: 4 }}>
                          <span>{dish.calories} kcal</span>
                          <span>| Protein: {dish.protein}g</span>
                          <span>| Carbs: {dish.carbs}g</span>
                          <span>| Fats: {dish.fats}g</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontWeight: 700, color: '#0b9e3a', fontSize: 15 }}>₹{dish.price}</span>
                        <Button 
                          variant="secondary"
                          style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6 }}
                          onClick={() => {
                            addToCart(dish.restaurantId, dish.restaurantName, dish)
                            alert(`Added ${dish.name} to cart!`)
                          }}
                        >
                          + Add to Cart
                        </Button>
                        <button 
                          className="favorite-btn active"
                          onClick={() => toggleFavoriteDish(dish.name)}
                          title="Remove from favorites"
                          style={{ position: 'static' }}
                        >
                          Saved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Order History */}
          {activeTab === 'history' && (
            <div className="profile-panel-card">
              <h3>Order History</h3>
              <p style={{ color: '#6e6b68', fontSize: 14, marginBottom: 20 }}>Past orders placed on your account.</p>

              {orderHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#faf8f5', borderRadius: 12, border: '1px dashed #e1dbd5' }}>
                  <p style={{ color: '#888' }}>No order history available.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {orderHistory.map((order) => {
                    const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })

                    return (
                      <div key={order.id} className="history-card">
                        {/* Header details */}
                        <div className="history-card-header">
                          <div>
                            <span className="history-order-id">#{order.id}</span>
                            <span className="history-date">{formattedDate}</span>
                          </div>
                          <span className="history-status-pill">{order.status}</span>
                        </div>

                        {/* Restaurant and Items */}
                        <div className="history-card-body">
                          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{order.restaurantName}</h4>
                          <ul className="history-items-list">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="history-item-bullet">
                                <span>{item.name} × {item.qty}</span>
                                <span>₹{item.price * item.qty}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Calculation summary */}
                        <div className="history-card-footer">
                          <div style={{ fontSize: 13, color: '#6e6b68' }}>
                            {order.couponApplied && (
                              <p style={{ color: '#0f8b34' }}>Coupon Applied: {order.couponApplied} (-₹{order.discount})</p>
                            )}
                            <p style={{ fontWeight: 600, color: 'var(--text-dark)', marginTop: 2 }}>Paid: ₹{order.total}</p>
                          </div>
                          <Button 
                            variant="secondary"
                            style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6 }}
                            onClick={() => handleReorder(order)}
                          >
                            Reorder
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </main>
  )
}
