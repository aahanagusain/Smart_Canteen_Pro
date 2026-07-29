import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function MockGoogleLogin() {
  const [searchParams] = useSearchParams()
  const redirectUri = searchParams.get('redirect_uri') || '/oauth-callback'
  const state = searchParams.get('state') || ''
  
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const accounts = [
    { name: 'Ria Sen', email: 'ria@gmail.com', avatar: 'R' },
    { name: 'Arjun Mehta', email: 'arjun@gmail.com', avatar: 'A' },
    { name: 'Priya Sharma', email: 'priya@gmail.com', avatar: 'P' }
  ]

  const handleSelectAccount = (user) => {
    setSelectedUser(user)
    setLoading(true)
    setTimeout(() => {
      const authInfo = btoa(JSON.stringify(user))
      const targetUrl = `${redirectUri}?code=mock_code_${authInfo}&state=${state}`
      window.location.href = targetUrl
    }, 1500)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customEmail || !customName) return
    handleSelectAccount({ name: customName, email: customEmail, avatar: customName.charAt(0).toUpperCase() })
  }

  return (
    <div className="google-oauth-bg">
      <div className="google-oauth-card">
        <div className="google-logo">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 12-4.53z"/>
          </svg>
        </div>

        {loading ? (
          <div className="google-loading-container">
            <div className="google-spinner"></div>
            <h3>Signing in with Google</h3>
            <p>Connecting back to Smart Canteen Pro...</p>
            <div className="google-user-preview" style={{ display: 'flex', gap: '12px' }}>
              <div className="google-avatar">{selectedUser.avatar}</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="google-user-name">{selectedUser.name}</div>
                <div className="google-user-email">{selectedUser.email}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="google-title">
              {showCustomForm ? 'Sign in' : 'Choose an account'}
            </h1>
            <p className="google-subtitle">
              to continue to <span className="app-name">Smart Canteen Pro</span>
            </p>

            {!showCustomForm ? (
              <div className="google-accounts-list">
                {accounts.map((acc) => (
                  <div
                    key={acc.email}
                    className="google-account-row"
                    onClick={() => handleSelectAccount(acc)}
                  >
                    <div className="google-avatar">{acc.avatar}</div>
                    <div className="google-account-info">
                      <div className="google-user-name">{acc.name}</div>
                      <div className="google-user-email">{acc.email}</div>
                    </div>
                  </div>
                ))}

                <div
                  className="google-account-row google-use-another"
                  onClick={() => setShowCustomForm(true)}
                >
                  <div className="google-avatar google-avatar-another">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 6H3v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1zm-3-11h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
                    </svg>
                  </div>
                  <div className="google-account-info">
                    <div className="google-user-name" style={{ color: '#1a73e8' }}>
                      Use another account
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="google-custom-form">
                <div className="google-input-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="google-input-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="google-buttons-row">
                  <button
                    type="button"
                    className="google-btn-text"
                    onClick={() => setShowCustomForm(false)}
                  >
                    Back
                  </button>
                  <button type="submit" className="google-btn-primary">
                    Next
                  </button>
                </div>
              </form>
            )}
            
            <div className="google-card-footer">
              To continue, Google will share your name, email address, language preference, and profile picture with Smart Canteen Pro.
            </div>
          </>
        )}
      </div>
      
      <div className="google-oauth-footer">
        <span>English (United States)</span>
        <div className="footer-links">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  )
}
