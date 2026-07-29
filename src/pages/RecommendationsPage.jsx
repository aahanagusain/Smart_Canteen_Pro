import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Loader, Toast } from '../components/ui'
import { useCart } from '../context/CartContext'

export default function RecommendationsPage() {
  const { addToCart } = useCart()
  const [mood, setMood] = useState('')
  const [category, setCategory] = useState('all')
  const [maxCalories, setMaxCalories] = useState(800)
  const [minProtein, setMinProtein] = useState(10)
  const [useCalorieLimit, setUseCalorieLimit] = useState(false)
  const [useProteinLimit, setUseProteinLimit] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Gemini is cooking up healthy food ideas...')
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type })
  }

  // Rotate loading messages during API calls
  useEffect(() => {
    if (!loading) return undefined

    const messages = [
      'Consulting Smart Canteen AI Chef...',
      'Checking current restaurant menus...',
      'Calculating calories and protein balances...',
      'Matching ingredients to your mood...',
      'Preparing customized nutrition details...'
    ]

    let index = 0
    const timer = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingMessage(messages[index])
    }, 2000)

    return () => clearInterval(timer)
  }, [loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRecommendations([])

    const payload = {
      mood: mood.trim(),
      category: category !== 'all' ? category : undefined,
      maxCalories: useCalorieLimit ? Number(maxCalories) : undefined,
      minProtein: useProteinLimit ? Number(minProtein) : undefined
    }

    try {
      const { data } = await api.post('/api/recommendations', payload)
      setRecommendations(data.recommendations || [])
      if (data.recommendations?.length === 0) {
        showToast('No recommendations found matching those criteria.', 'info')
      } else {
        showToast('Successfully generated recommendations!', 'success')
      }
    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch recommendations.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (dish) => {
    // Format menuItem as expected by CartContext
    const menuItem = {
      name: dish.name,
      price: dish.price,
      calories: dish.calories || 0,
      protein: dish.protein || 0,
      carbs: dish.carbs || 0,
      fats: dish.fats || 0,
      image: dish.image || ''
    }

    addToCart(dish.restaurantId, dish.restaurantName, menuItem)
    showToast(`Added ${dish.name} from ${dish.restaurantName} to cart!`, 'success')
  }

  return (
    <main className="page" style={{ paddingTop: 20 }}>
      {/* Title Header with Gradient */}
      <section className="recommendations-header" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-dark)', display: 'inline-block' }}>
          Smart AI Recommendations
        </h2>
        <span 
          style={{
            marginLeft: 12,
            padding: '4px 10px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            background: 'var(--rainbow-gradient)',
            color: '#fff',
            verticalAlign: 'middle'
          }}
        >
          Live Gemini AI
        </span>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 6 }}>
          Input your goals, cravings, or mood, and let our Gemini nutritionist recommend the perfect meal.
        </p>
      </section>

      {/* Main Grid: Form Left, Results/Status Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* Form panel */}
        <section 
          className="restaurant-card" 
          style={{ 
            padding: 24, 
            background: 'var(--bg-surface)', 
            border: 'var(--card-border)',
            borderRadius: 16,
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18, color: 'var(--text-dark)' }}>
            Tell Us What You Want
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Goal / Mood input */}
            <div style={{ marginBottom: 20 }}>
              <label 
                htmlFor="moodInput" 
                style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-dark)' }}
              >
                Cravings / Goal / Mood
              </label>
              <textarea
                id="moodInput"
                placeholder="e.g. 'I just came from a workout and want a spicy snack with high protein', 'Something sweet but low calorie', 'A filling lunch under 150 rupees'"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: 90,
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 14,
                  resize: 'vertical',
                  background: 'var(--bg-light)',
                  color: 'var(--text-dark)'
                }}
                required
              />
            </div>

            {/* Category selection */}
            <div style={{ marginBottom: 20 }}>
              <label 
                style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-dark)' }}
              >
                Food Category
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['all', 'savory', 'sweets'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      border: category === cat ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                      background: category === cat ? 'var(--bg-light)' : 'var(--bg-surface)',
                      color: category === cat ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Calories Slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label 
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={useCalorieLimit}
                    onChange={(e) => setUseCalorieLimit(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Max Calories
                </label>
                {useCalorieLimit && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-orange)' }}>
                    {maxCalories} kcal
                  </span>
                )}
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="50"
                value={maxCalories}
                onChange={(e) => setMaxCalories(e.target.value)}
                disabled={!useCalorieLimit}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-orange)',
                  opacity: useCalorieLimit ? 1 : 0.4,
                  cursor: useCalorieLimit ? 'pointer' : 'default'
                }}
              />
            </div>

            {/* Protein Slider */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label 
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={useProteinLimit}
                    onChange={(e) => setUseProteinLimit(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Min Protein
                </label>
                {useProteinLimit && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)' }}>
                    {minProtein}g
                  </span>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={minProtein}
                onChange={(e) => setMinProtein(e.target.value)}
                disabled={!useProteinLimit}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-green)',
                  opacity: useProteinLimit ? 1 : 0.4,
                  cursor: useProteinLimit ? 'pointer' : 'default'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-rainbow"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'AI is thinking...' : 'Get AI Recommendations'}
            </button>
          </form>
        </section>

        {/* Results/Status panel */}
        <section style={{ width: '100%' }}>
          
          {/* Loading state */}
          {loading && (
            <div 
              style={{
                padding: 40,
                textAlign: 'center',
                background: 'var(--bg-surface)',
                borderRadius: 16,
                border: 'var(--card-border)',
                boxShadow: 'var(--card-shadow)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300
              }}
            >
              <Loader text={loadingMessage} size="lg" />
              <div 
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              >
                Analyzing smart canteen menus...
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {error && (
            <div 
              style={{
                padding: 24,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 16,
                color: '#e53e3e',
                marginBottom: 20
              }}
            >
              <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Recommendation Call Failed</h4>
              <p style={{ fontSize: 14, lineHeight: '1.5' }}>{error}</p>
              {error.includes('key is not configured') && (
                <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: 10 }}>
                  💡 <strong>How to fix:</strong> Open <code>server/.env</code> file on your local machine and add <code>GEMINI_API_KEY=your_real_gemini_key</code>. Then restart your backend server.
                </div>
              )}
            </div>
          )}

          {/* Empty state (No search performed yet) */}
          {!loading && !error && recommendations.length === 0 && (
            <div 
              style={{
                padding: 48,
                textAlign: 'center',
                background: 'var(--bg-surface)',
                borderRadius: 16,
                border: 'var(--card-border)',
                boxShadow: 'var(--card-shadow)',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>
                AI Nutrition Assistant Ready
              </h3>
              <p style={{ fontSize: 14, maxWidth: 400, color: 'var(--text-muted)' }}>
                Fill in your desired flavor style, fitness goals, or meal craving on the left, and we will query Gemini to recommend from our canteen catalog.
              </p>
            </div>
          )}

          {/* Recommendations list */}
          {!loading && recommendations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-dark)' }}>
                  Our Recommended Matches ({recommendations.length})
                </h3>
                <button 
                  onClick={() => setRecommendations([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-orange)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Clear Results
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {recommendations.map((dish, i) => (
                  <article
                    key={i}
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 16,
                      border: 'var(--card-border)',
                      boxShadow: 'var(--card-shadow)',
                      padding: 20,
                      display: 'grid',
                      gridTemplateColumns: dish.image ? '120px 1fr' : '1fr',
                      gap: 20,
                      alignItems: 'start',
                      transition: 'transform 0.2s',
                    }}
                    className="restaurant-card"
                  >
                    {dish.image && (
                      <div 
                        style={{ 
                          width: 120, 
                          height: 120, 
                          borderRadius: 12, 
                          overflow: 'hidden',
                          background: 'var(--bg-surface-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-dark)' }}>
                            {dish.name}
                          </h4>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            from <strong>{dish.restaurantName}</strong>
                          </span>
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-orange)' }}>
                          ₹{dish.price}
                        </span>
                      </div>

                      {/* AI Reasoning Section */}
                      {dish.reason && (
                        <div 
                          style={{
                            marginTop: 10,
                            marginBottom: 12,
                            padding: '10px 14px',
                            background: 'var(--bg-surface-muted)',
                            borderLeft: '3px solid var(--accent-orange)',
                            borderRadius: '0 8px 8px 0',
                            fontSize: 13,
                            lineHeight: '1.4',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic'
                          }}
                        >
                          <strong>AI Insight:</strong> {dish.reason}
                        </div>
                      )}

                      {/* Nutrition Specs */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                        <span style={{ padding: '3px 8px', background: '#fff0ec', color: '#ff6b35', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                          🔥 {dish.calories || 0} kcal
                        </span>
                        <span style={{ padding: '3px 8px', background: '#edfdf3', color: '#3cbd69', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                          💪 {dish.protein || 0}g protein
                        </span>
                        <span style={{ padding: '3px 8px', background: '#f0f3ff', color: '#3f51b5', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                          🌾 {dish.carbs || 0}g carbs
                        </span>
                        <span style={{ padding: '3px 8px', background: '#fffbf0', color: '#ffb300', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                          🥑 {dish.fats || 0}g fats
                        </span>
                      </div>

                      {/* Action */}
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleAddToCart(dish)}
                          style={{
                            padding: '8px 16px',
                            background: 'var(--rainbow-gradient)',
                            border: 'none',
                            borderRadius: 10,
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>

      {/* Global Toast for notifications */}
      <Toast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </main>
  )
}
