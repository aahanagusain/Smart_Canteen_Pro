import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const userName = user?.name || 'User'

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="global-navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="brand-name">Smart Canteen Pro</span>
        </div>
        
        <nav className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            AI Assistant
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Cart <span className="nav-badge">{totalItems}</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Profile
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <ThemeToggle />
          <span className="user-greeting">Namaste, {userName}!</span>
          <button className="btn-logout-gradient" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
