import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../lib/api'
import PaymentModal from '../components/PaymentModal'

export default function CartPage() {
  const { items, totalItems, totalPrice, inc, dec, remove, clear } = useCart()
  const [coupons, setCoupons] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Fetch available coupons
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const { data } = await api.get('/api/coupons')
        setCoupons(data)
      } catch (err) {
        console.error('Error fetching coupons', err)
      }
    }
    loadCoupons()
  }, [])

  // Auto-remove applied coupon if total price falls below its minimum limit
  useEffect(() => {
    if (appliedCoupon && totalPrice < appliedCoupon.minOrder) {
      setAppliedCoupon(null)
      setCouponSuccess('')
      setCouponError(`Coupon ${appliedCoupon.code} removed: min order of ₹${appliedCoupon.minOrder} not met.`)
    }
  }, [totalPrice, appliedCoupon])

  // Calculate discount based on applied coupon
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (totalPrice < appliedCoupon.minOrder) return 0

    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, totalPrice)
    } else if (appliedCoupon.type === 'percent') {
      let val = (totalPrice * appliedCoupon.value) / 100
      if (appliedCoupon.maxDiscount) {
        val = Math.min(val, appliedCoupon.maxDiscount)
      }
      return Math.min(val, totalPrice)
    }
    return 0
  }, [appliedCoupon, totalPrice])

  const finalTotal = parseFloat((totalPrice - discount).toFixed(2))

  const handleApplyCoupon = (codeToApply) => {
    setCouponError('')
    setCouponSuccess('')
    const code = (codeToApply || couponCode).trim().toUpperCase()
    if (!code) return

    const coupon = coupons.find((c) => c.code.toUpperCase() === code)
    if (!coupon) {
      setCouponError('Invalid coupon code')
      return
    }

    if (totalPrice < coupon.minOrder) {
      setCouponError(`Min order of ₹${coupon.minOrder} required for this coupon`)
      return
    }

    setAppliedCoupon(coupon)
    setCouponSuccess(`Coupon ${coupon.code} applied! (-₹${discount.toFixed(0)})`)
    setCouponCode('')
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponSuccess('')
    setCouponError('')
  }

  // Calculate total nutrition details
  const nutrition = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.calories += (item.calories || 0) * item.qty
        acc.protein += (item.protein || 0) * item.qty
        acc.carbs += (item.carbs || 0) * item.qty
        acc.fats += (item.fats || 0) * item.qty
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )
  }, [items])

  // Recommended daily caps to calculate progress bar percentages
  const proteinPercent = Math.min(100, (nutrition.protein / 60) * 100)
  const carbsPercent = Math.min(100, (nutrition.carbs / 250) * 100)
  const fatsPercent = Math.min(100, (nutrition.fats / 70) * 100)

  const handleCheckout = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async () => {
    try {
      const primaryItem = items[0]
      const orderData = {
        items,
        restaurantName: primaryItem.restaurantName,
        restaurantId: primaryItem.restaurantId,
        couponApplied: appliedCoupon ? appliedCoupon.code : null,
      }
      
      const { data } = await api.post('/api/orders', orderData)
      alert(data.message || 'Order placed successfully!')
      clear()
      handleRemoveCoupon()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.')
    }
  }

  return (
    <main className="page" style={{ paddingTop: 20 }}>
      {/* Redesigned Top Action Row */}
      <div className="cart-title-row">
        <h1 style={{ color: 'var(--primary-red)', fontWeight: 800 }}>Your Cart</h1>
        <div className="cart-title-actions">
          <Link className="btn-secondary" to="/">
            Continue Shopping
          </Link>
          {items.length > 0 && (
            <button className="btn-clear-cart" onClick={clear}>
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <p className="cart-item-count">{totalItems} items added</p>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: 10 }}>Add some delicious food from canteens to see them here.</p>
          <Link to="/" className="btn-rainbow" style={{ display: 'inline-block', width: 'auto', marginTop: 20 }}>
            Go Browse Canteens
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Left Column: Items & Coupons */}
          <div className="cart-left">
            <section className="cart-items-container">
              {items.map((item) => {
                const itemImage = item.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'

                return (
                  <article key={`${item.restaurantId}-${item.name}`} className="cart-item-card">
                    <img className="cart-item-image" src={itemImage} alt={item.name} />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-restaurant">{item.restaurantName}</p>
                      <p className="cart-item-price">₹{item.price}</p>
                      <span style={{ fontSize: 11, color: '#706865' }}>
                        {item.calories * item.qty} kcal | P: {item.protein * item.qty}g
                      </span>
                    </div>

                    <div className="cart-item-controls-price">
                      {/* Quantity Controller */}
                      <div className="quantity-controller">
                        <button className="quantity-btn" onClick={() => dec(item.restaurantId, item.name)}>
                          -
                        </button>
                        <span className="quantity-value">{item.qty}</span>
                        <button className="quantity-btn" onClick={() => inc(item.restaurantId, item.name)}>
                          +
                        </button>
                      </div>

                      {/* Subtotal and Remove Link */}
                      <div className="cart-item-total-col">
                        <p className="cart-item-subtotal">₹{item.price * item.qty}</p>
                        <button
                          className="cart-item-remove"
                          onClick={() => remove(item.restaurantId, item.name)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            {/* Coupons Form & Available Coupons Lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 12 }}>
              <section className="coupon-section">
                <h3>Apply Coupon</h3>
                <div className="coupon-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="coupon-input"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn-apply" onClick={() => handleApplyCoupon()}>
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8, fontWeight: 500 }}>{couponError}</p>}
                {couponSuccess && <p style={{ color: '#0f8b34', fontSize: 13, marginTop: 8, fontWeight: 600 }}>{couponSuccess}</p>}

                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '8px 12px', borderRadius: 8, marginTop: 12, border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>Applied: {appliedCoupon.code} (-₹{discount.toFixed(0)})</span>
                    <button onClick={handleRemoveCoupon} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}>Remove</button>
                  </div>
                )}
              </section>

              <section className="offers-section">
                <h3>Available Offers</h3>
                <div className="offers-list">
                  {coupons.map((coupon) => (
                    <div key={coupon.code} className="offer-card">
                      <div className="offer-details">
                        <span className="offer-code">{coupon.code}</span>
                        <span className="offer-desc">{coupon.description}</span>
                      </div>
                      <button
                        className="offer-apply-btn"
                        onClick={() => handleApplyCoupon(coupon.code)}
                        disabled={totalPrice < coupon.minOrder}
                        style={{ opacity: totalPrice < coupon.minOrder ? 0.5 : 1, cursor: totalPrice < coupon.minOrder ? 'not-allowed' : 'pointer' }}
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right Column: Order Summary & Nutrition Summary */}
          <div className="cart-right">
            {/* Order Summary */}
            <section className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-row" style={{ color: '#0f8b34', fontWeight: 600 }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
              <button className="btn-checkout" onClick={handleCheckout}>
                Checkout - ₹{finalTotal}
              </button>
            </section>

            {/* Nutrition Summary Sidebar */}
            <section className="nutrition-card">
              <div className="nutrition-card-header">
                NUTRITION SUMMARY
              </div>
              <div className="nutrition-calories-row">
                <span>Total Calories</span>
                <span className="nutrition-calories-val">
                  {nutrition.calories} kcal
                </span>
              </div>

              {/* Protein Bar */}
              <div className="nutrition-progress-item">
                <div className="nutrition-progress-header">
                  <span>Protein</span>
                  <span>{nutrition.protein}g / 60g</span>
                </div>
                <div className="nutrition-progress-bar-bg">
                  <div
                    className="nutrition-progress-bar-fill protein"
                    style={{ width: `${proteinPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Carbs Bar */}
              <div className="nutrition-progress-item">
                <div className="nutrition-progress-header">
                  <span>Carbs</span>
                  <span>{nutrition.carbs}g / 250g</span>
                </div>
                <div className="nutrition-progress-bar-bg">
                  <div
                    className="nutrition-progress-bar-fill carbs"
                    style={{ width: `${carbsPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Fats Bar */}
              <div className="nutrition-progress-item">
                <div className="nutrition-progress-header">
                  <span>Fats</span>
                  <span>{nutrition.fats}g / 70g</span>
                </div>
                <div className="nutrition-progress-bar-bg">
                  <div
                    className="nutrition-progress-bar-fill fats"
                    style={{ width: `${fatsPercent}%` }}
                  ></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={finalTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </main>
  )
}
