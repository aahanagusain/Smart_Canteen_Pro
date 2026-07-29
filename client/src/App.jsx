import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MockGoogleLogin from './pages/MockGoogleLogin'
import OAuthCallback from './pages/OAuthCallback'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import ComponentsDemo from './pages/ComponentsDemo'
import RecommendationsPage from './pages/RecommendationsPage'
import Navbar from './components/Navbar'

const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mock-google-login" element={<MockGoogleLogin />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/components-demo" element={<ComponentsDemo />} />
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <HomePage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/restaurants/:id/menu"
        element={
          <ProtectedLayout>
            <MenuPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedLayout>
            <CartPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedLayout>
            <RecommendationsPage />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
