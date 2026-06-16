import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, totalItems, totalPrice, inc, dec, remove, clear } = useCart()

  const handleCheckout = () => {
    alert(`Order placed successfully! Total Paid: ₹${totalPrice}`)
    clear()
  }

  return (
    <main className="page">
      {/* Redesigned Top Action Row */}
      <div className="cart-title-row">
        <h1>Your Cart</h1>
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
          {/* Left Column: Items */}
          <div className="cart-left">
            <section className="cart-items-container">
              {items.map((item) => {
                // Determine item image (from menu item or fallback to generic ice cream/food image)
                const itemImage =
                  item.image ||
                  (item.name.toLowerCase().includes('mud')
                    ? '/images/chocolate_mud_scoop.png'
                    : item.name.toLowerCase().includes('cotton')
                    ? '/images/pink_candy_scoop.png'
                    : '/images/ice_cream_cone.png')

                return (
                  <article key={`${item.restaurantId}-${item.name}`} className="cart-item-card">
                    <img className="cart-item-image" src={itemImage} alt={item.name} />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-restaurant">{item.restaurantName}</p>
                      <p className="cart-item-price">₹{item.price}</p>
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
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-right">
            {/* Order Summary */}
            <section className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
              <button className="btn-checkout" onClick={handleCheckout}>
                Checkout • ₹{totalPrice}
              </button>
            </section>
          </div>
        </div>
      )}
    </main>
  )
}
