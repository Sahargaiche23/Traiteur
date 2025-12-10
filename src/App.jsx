import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import MenuBuilder from './pages/MenuBuilder'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import OrderTracking from './pages/OrderTracking'
import Admin from './pages/Admin'
import DishDetail from './pages/DishDetail'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Livreur from './pages/Livreur'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { useStore } from './store/useStore'

function App() {
  const [loading, setLoading] = useState(true)
  const { fetchDishes, fetchPosts, fetchSettings } = useStore()
  const location = useLocation()

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([
          fetchDishes(),
          fetchPosts(),
          fetchSettings(),
        ])
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
      setTimeout(() => setLoading(false), 1000)
    }
    initApp()
  }, [])

  // Check if current path is admin or livreur
  const isSpecialRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/livreur')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h1 className="font-display text-3xl text-primary-800 mb-2">Traiteur Saida Fejjari Chouaieb</h1>
          <p className="text-secondary-600 font-arabic text-xl">سعيدة فجاري شعيب</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gradient-warm flex flex-col">
          {!isSpecialRoute && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:id" element={<DishDetail />} />
              <Route path="/menu-builder" element={<MenuBuilder />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderTracking />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/livreur" element={<Livreur />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          {!isSpecialRoute && <Footer />}
          {!isSpecialRoute && <WhatsAppButton />}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
