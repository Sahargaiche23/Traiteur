import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Edit2, Save, LogOut, 
  Heart, ShoppingBag, Clock, Settings, Camera 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStore, useAdminAuth, useLivreurAuth } from '../store/useStore'
import { Link } from 'react-router-dom'

// Special emails - redirect to appropriate interface
const ADMIN_EMAIL = 'Yoldes.ch82@gmail.com'
const LIVREUR_EMAIL = 'livreur@yoldezchouaib.tn'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, logout, updateProfile } = useAuth()
  const { isAdminAuthenticated } = useAdminAuth()
  const { isLivreurAuthenticated } = useLivreurAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    isSignup: false,
  })

  // Redirect admin/livreur to their panel if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin')
      return
    }
    if (isLivreurAuthenticated) {
      navigate('/livreur')
      return
    }
    
    const email = user?.email?.toLowerCase()
    if (email === ADMIN_EMAIL.toLowerCase()) {
      navigate('/admin')
    } else if (email === LIVREUR_EMAIL.toLowerCase()) {
      navigate('/livreur')
    }
  }, [user, navigate, isAdminAuthenticated, isLivreurAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    const email = loginData.email.toLowerCase()
    
    // Check if admin email - redirect to admin
    if (email === ADMIN_EMAIL.toLowerCase()) {
      navigate('/admin')
      return
    }
    
    // Check if livreur email - redirect to livreur
    if (email === LIVREUR_EMAIL.toLowerCase()) {
      navigate('/livreur')
      return
    }
    
    // Simulate login for clients
    const userData = {
      id: Date.now(),
      firstName: loginData.isSignup ? loginData.firstName : loginData.email.split('@')[0],
      lastName: loginData.isSignup ? loginData.lastName : '',
      email: loginData.email,
      phone: '',
      address: '',
    }
    login(userData)
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      address: userData.address || '',
    })
    setShowLoginForm(false)
  }

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  // Get orders and menus from store
  const { orders: allOrders, fetchOrders, savedMenus } = useStore()
  
  // Fetch orders on mount
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchOrders()
    }
  }, [isAuthenticated, user?.email])
  
  // Filter orders for current user
  const orders = (allOrders || []).filter(order => {
    if (!user?.email) return false
    return order.customer?.email?.toLowerCase() === user.email.toLowerCase()
  })

  if (showLoginForm || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-secondary-900">
              {loginData.isSignup ? 'Créer un compte' : 'Connexion'}
            </h1>
            <p className="text-secondary-600 mt-2">
              {loginData.isSignup 
                ? 'Rejoignez-nous pour commander plus facilement' 
                : 'Accédez à votre compte'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginData.isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={loginData.firstName || ''}
                    onChange={(e) => setLoginData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={loginData.lastName || ''}
                    onChange={(e) => setLoginData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              {loginData.isSignup ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setLoginData(prev => ({ ...prev, isSignup: !prev.isSignup }))}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {loginData.isSignup 
                ? 'Déjà un compte? Se connecter' 
                : 'Pas de compte? Créer un compte'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-14 h-14 text-primary-600" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors cursor-pointer">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        updateProfile({ profileImage: reader.result })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-2xl font-bold text-secondary-900">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-secondary-600">{formData.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 text-secondary-600">
                  <ShoppingBag className="w-5 h-5" />
                  <span>{orders.length} commandes</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-600">
                  <Heart className="w-5 h-5" />
                  <span>{(savedMenus || []).length} menus</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-outline flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
              <button
                onClick={logout}
                className="p-3 text-secondary-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                Informations personnelles
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800">
                        {formData.firstName || '-'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800">
                        {formData.lastName || '-'}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800">
                      {formData.email || '-'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800">
                      {formData.phone || '-'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Adresse de livraison
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      placeholder="Votre adresse complète..."
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800">
                      {formData.address || '-'}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                Accès rapide
              </h2>
              <div className="space-y-2">
                {[
                  { to: '/orders', icon: Clock, label: 'Mes commandes', count: orders.length },
                  { to: '/menu-builder', icon: Heart, label: 'Mes menus', count: (savedMenus || []).length },
                  { to: '/catalog', icon: ShoppingBag, label: 'Commander' },
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="flex-1 font-medium text-secondary-800">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="px-2 py-1 bg-secondary-100 rounded-full text-xs font-medium text-secondary-600">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h2 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                  Dernières commandes
                </h2>
                <div className="space-y-3">
                  {orders.slice(-3).reverse().map((order, i) => (
                    <div key={i} className="p-3 bg-secondary-50 rounded-xl">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-secondary-800">
                          #{order.id.toString().slice(-6)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status?.toLowerCase() === 'delivered' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status?.toLowerCase() === 'delivered' ? 'Livré' : 'En cours'}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600">
                        {order.items?.length || 0} article(s) • {order.total?.toFixed(2) || '0.00'} TND
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/orders"
                  className="block mt-4 text-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Voir tout l'historique
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
