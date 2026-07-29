import { useState } from 'react'

export default function PaymentModal({ isOpen, onClose, amount, onPaymentSuccess }) {
  const [step, setStep] = useState('form') // form, processing, success
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {}
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number'
    }
    if (!formData.cardName) {
      newErrors.cardName = 'Please enter cardholder name'
    }
    if (!formData.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Please enter valid expiry (MM/YY)'
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter valid CVV'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setStep('processing')
      // Simulate payment processing
      setTimeout(() => {
        setStep('success')
        setTimeout(() => {
          onPaymentSuccess()
          handleClose()
        }, 2000)
      }, 2500)
    }
  }

  const handleClose = () => {
    setStep('form')
    setFormData({ cardNumber: '', cardName: '', expiry: '', cvv: '' })
    setErrors({})
    onClose()
  }

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').trim()
  }

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        {step === 'form' && (
          <>
            <div className="payment-modal-header">
              <h2>Secure Payment</h2>
              <button className="payment-close-btn" onClick={handleClose}>×</button>
            </div>

            <div className="payment-amount">
              <span>Total Amount</span>
              <strong>₹{amount.toFixed(2)}</strong>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
              <div className="payment-form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                  maxLength={19}
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              <div className="payment-form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
              </div>

              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                    maxLength={5}
                    className={errors.expiry ? 'error' : ''}
                  />
                  {errors.expiry && <span className="error-message">{errors.expiry}</span>}
                </div>

                <div className="payment-form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    maxLength={4}
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>

              <div className="payment-security-note">
                <span className="security-icon">🔒</span>
                <span>Your payment information is secure and encrypted</span>
              </div>

              <button type="submit" className="payment-submit-btn">
                Pay ₹{amount.toFixed(2)}
              </button>
            </form>

            <div className="payment-methods">
              <span>We accept:</span>
              <div className="payment-icons">
                <span>💳</span>
                <span>🏦</span>
                <span>💰</span>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="payment-processing">
            <div className="processing-spinner"></div>
            <h2>Processing Payment</h2>
            <p>Please wait while we process your payment...</p>
            <div className="processing-steps">
              <div className="processing-step active">Validating card details...</div>
              <div className="processing-step">Processing transaction...</div>
              <div className="processing-step">Confirming payment...</div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>
            <p className="success-amount">₹{amount.toFixed(2)} paid</p>
          </div>
        )}
      </div>
    </div>
  )
}
