import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, ShoppingBag, Utensils, Users, TrendingUp,
  Plus, Edit2, Trash2, Check, X, Eye, Clock, Truck, Package,
  DollarSign, Star, Bell, Settings, Search, Filter, LogOut,
  Image, FileText, MessageSquare, Lock, Mail, ChefHat, Save,
  AlertCircle, CheckCircle, Upload, Printer, Phone, MapPin
} from 'lucide-react'
import { useStore, useAdminAuth } from '../store/useStore'
import { categories as staticCategories } from '../data/dishes'
import { API_BASE } from '../services/api'

// Use static categories as fallback
const categories = staticCategories

// Admin Login Component
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { loginAdmin } = useAdminAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const success = loginAdmin(email, password)
    if (success) {
      onLogin()
    } else {
      setError('Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">
            Espace Administration
          </h1>
          <p className="text-secondary-600 mt-2">
            Connectez-vous pour gérer votre restaurant
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yoldezchouaib.tn"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary">
            Se connecter
          </button>
        </form>

        <div className="mt-6 p-4 bg-secondary-50 rounded-xl">
          <p className="text-sm text-secondary-600 text-center">
            <strong>Identifiants administrateur:</strong><br />
            Email: Yoldes.ch82@gmail.com<br />
            Mot de passe: admin123
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Dish Form Modal
function DishFormModal({ dish, onSave, onClose }) {
  const [apiCategories, setApiCategories] = useState([])
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    nameAr: dish?.nameAr || '',
    description: dish?.description || '',
    price: dish?.price || '',
    image: dish?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    categoryId: dish?.categoryId || dish?.category?.id || '',
    portions: dish?.portions || ['Individuelle'],
    isPopular: dish?.isPopular || false,
    isAvailable: dish?.isAvailable !== false,
  })

  // Fetch categories from API
  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setApiCategories(data)
        // Set default category if not set
        if (!formData.categoryId && data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }))
        }
      })
      .catch(() => setApiCategories(categories)) // Fallback to static
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      portions: formData.portions.filter(p => p.trim()),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8"
      >
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-secondary-900">
            {dish ? 'Modifier le plat' : 'Ajouter un plat'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nom (Français) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nom (Arabe)
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none font-arabic"
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Prix (TND) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                min="0"
                step="0.5"
                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none bg-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {(apiCategories.length > 0 ? apiCategories : categories).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              URL de l'image
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Portions (séparées par des virgules)
            </label>
            <input
              type="text"
              value={formData.portions.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                portions: e.target.value.split(',').map(p => p.trim()) 
              }))}
              placeholder="Individuelle, Pour 2, Familiale"
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-secondary-700">Plat populaire</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-secondary-700">Disponible</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Annuler
            </button>
            <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              {dish ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Post Form Modal  
function PostFormModal({ post, onSave, onClose }) {
  const [formData, setFormData] = useState(post || {
    content: '',
    image: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-secondary-900">
            {post ? 'Modifier la publication' : 'Nouvelle publication'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Contenu *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={4}
              placeholder="Partagez une actualité, une promotion..."
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              URL de l'image (optionnel)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Annuler
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {post ? 'Mettre à jour' : 'Publier'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function Admin() {
  const { isAdminAuthenticated, logoutAdmin, adminUser } = useAdminAuth()
  const { 
    dishes, orders, posts, settings, customers, stats,
    addDish, updateDish, deleteDish, toggleDishAvailability,
    updateOrderStatus,
    addPost, updatePost, deletePost,
    updateSettings,
    fetchOrders, fetchCustomers, fetchStats, fetchDishes, fetchPosts
  } = useStore()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDishForm, setShowDishForm] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState(null)
  const [settingsForm, setSettingsForm] = useState(settings)
  const [messages, setMessages] = useState([])
  const [reviews, setReviews] = useState([])

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/all`)
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const approveReview = async (id) => {
    try {
      await fetch(`${API_BASE}/api/reviews/${id}/approve`, { method: 'PATCH' })
      fetchReviews()
      showNotification('Avis approuvé')
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const deleteReview = async (id) => {
    if (!confirm('Supprimer cet avis?')) return
    try {
      await fetch(`${API_BASE}/api/reviews/${id}`, { method: 'DELETE' })
      fetchReviews()
      showNotification('Avis supprimé')
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const markMessageRead = async (id) => {
    try {
      await fetch(`${API_BASE}/api/messages/${id}/read`, { method: 'PATCH' })
      fetchMessages()
    } catch (error) {
      console.error('Error marking message read:', error)
    }
  }

  const deleteMessage = async (id) => {
    if (!confirm('Supprimer ce message?')) return
    try {
      await fetch(`${API_BASE}/api/messages/${id}`, { method: 'DELETE' })
      fetchMessages()
      showNotification('Message supprimé')
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // Fetch admin data on load
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders()
      fetchCustomers()
      fetchStats()
      fetchMessages()
    }
  }, [isAdminAuthenticated])

  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'customers') fetchCustomers()
    if (activeTab === 'dishes') fetchDishes()
    if (activeTab === 'posts') fetchPosts()
    if (activeTab === 'dashboard') fetchStats()
    if (activeTab === 'messages') fetchMessages()
    if (activeTab === 'reviews') fetchReviews()
  }, [activeTab])

  // If not authenticated, show login
  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={() => {}} />
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, badge: stats?.pendingOrders || 0 },
    { id: 'dishes', label: 'Plats', icon: Utensils, badge: dishes?.length || 0 },
    { id: 'posts', label: 'Publications', icon: MessageSquare, badge: posts?.length || 0 },
    { id: 'customers', label: 'Clients', icon: Users, badge: stats?.totalCustomers || 0 },
    { id: 'messages', label: 'Messages', icon: Mail, badge: messages?.filter(m => !m.isRead).length || 0 },
    { id: 'reviews', label: 'Avis', icon: Star, badge: reviews?.filter(r => !r.isApproved).length || 0 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  const statusOptions = [
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
    { value: 'preparing', label: 'En préparation', color: 'bg-orange-100 text-orange-700' },
    { value: 'delivering', label: 'En livraison', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: 'Livrée', color: 'bg-green-100 text-green-700' },
  ]

  // Handler functions
  const handleSaveDish = async (dishData) => {
    try {
      if (editingDish) {
        await updateDish(editingDish.id, dishData)
        showNotification('Plat mis à jour avec succès')
      } else {
        await addDish(dishData)
        showNotification('Plat ajouté avec succès')
      }
      setShowDishForm(false)
      setEditingDish(null)
      fetchDishes() // Refresh list
    } catch (error) {
      showNotification('Erreur: ' + error.message, 'error')
    }
  }

  const handleDeleteDish = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat?')) {
      try {
        await deleteDish(id)
        showNotification('Plat supprimé')
        fetchDishes()
      } catch (error) {
        showNotification('Erreur: ' + error.message, 'error')
      }
    }
  }

  const handleSavePost = async (postData) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData)
        showNotification('Publication mise à jour')
      } else {
        await addPost(postData)
        showNotification('Publication créée')
      }
      setShowPostForm(false)
      setEditingPost(null)
      fetchPosts() // Refresh list
    } catch (error) {
      showNotification('Erreur: ' + error.message, 'error')
    }
  }

  const handleDeletePost = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication?')) {
      try {
        await deletePost(id)
        showNotification('Publication supprimée')
        fetchPosts()
      } catch (error) {
        showNotification('Erreur: ' + error.message, 'error')
      }
    }
  }

  const handleSaveSettings = async () => {
    try {
      await updateSettings(settingsForm)
      showNotification('Paramètres enregistrés')
    } catch (error) {
      showNotification('Erreur: ' + error.message, 'error')
    }
  }

  const filteredDishes = (dishes || []).filter(d => 
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.nameAr?.includes(searchQuery)
  )

  const filteredOrders = (orders || []).filter(o => 
    o.id?.toString().includes(searchQuery) ||
    o.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showDishForm && (
          <DishFormModal
            dish={editingDish}
            onSave={handleSaveDish}
            onClose={() => { setShowDishForm(false); setEditingDish(null) }}
          />
        )}
        {showPostForm && (
          <PostFormModal
            post={editingPost}
            onSave={handleSavePost}
            onClose={() => { setShowPostForm(false); setEditingPost(null) }}
          />
        )}
      </AnimatePresence>

      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary-600" />
              <h1 className="font-display text-xl font-bold text-secondary-900">
                Administration
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                <Bell className="w-6 h-6" />
                {(stats?.pendingOrders || 0) > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats?.pendingOrders || 0}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary-600">A</span>
                </div>
                <button
                  onClick={logoutAdmin}
                  className="p-2 text-secondary-600 hover:text-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-700 hover:bg-secondary-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Commandes', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-blue-500' },
                { label: 'En attente', value: stats?.pendingOrders || 0, icon: Clock, color: 'bg-yellow-500' },
                { label: 'Revenus', value: `${(stats?.totalRevenue || 0).toFixed(0)} TND`, icon: DollarSign, color: 'bg-green-500' },
                { label: 'Panier moyen', value: `${(stats?.avgOrderValue || 0).toFixed(0)} TND`, icon: TrendingUp, color: 'bg-purple-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-secondary-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-secondary-900">
                  Commandes récentes
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Voir tout
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-medium text-secondary-600">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orders || []).slice(0, 5).map((order) => {
                      const normalizedStatus = order.status?.toLowerCase() || 'pending'
                      const status = statusOptions.find(s => s.value === normalizedStatus) || statusOptions[0]
                      return (
                        <tr key={order.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-3 px-4 font-medium">#{order.id.toString().slice(-6)}</td>
                          <td className="py-3 px-4 text-secondary-600">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </td>
                          <td className="py-3 px-4 text-secondary-600">
                            {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                          </td>
                          <td className="py-3 px-4 font-semibold">{order.total?.toFixed(2)} TND</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-secondary-200">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                    <button className="p-2.5 border border-secondary-200 rounded-xl hover:bg-secondary-50">
                      <Filter className="w-5 h-5 text-secondary-600" />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-secondary-100 max-h-[600px] overflow-y-auto">
                  {(orders || []).map((order) => {
                    const normalizedStatus = order.status?.toLowerCase() || 'pending'
                    const status = statusOptions.find(s => s.value === normalizedStatus) || statusOptions[0]
                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-4 hover:bg-secondary-50 transition-colors ${
                          selectedOrder?.id === order.id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-secondary-900">
                            #{order.id.toString().slice(-6)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 mb-1">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-secondary-500">
                            {order.items?.length} article(s)
                          </span>
                          <span className="font-semibold text-primary-600">
                            {order.total?.toFixed(2)} TND
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              {selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                  <h3 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                    Commande #{selectedOrder.id.toString().slice(-6)}
                  </h3>
                  
                  {/* Status Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={selectedOrder.status?.toLowerCase() || 'pending'}
                      onChange={async (e) => {
                        await updateOrderStatus(selectedOrder.id, e.target.value)
                        fetchOrders() // Refresh orders
                        showNotification('Statut mis à jour')
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none bg-white"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-6 p-4 bg-secondary-50 rounded-xl">
                    <h4 className="font-medium text-secondary-800 mb-2">Client</h4>
                    <p className="text-secondary-600">
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </p>
                    <p className="text-sm text-secondary-500">{selectedOrder.customer?.phone}</p>
                    <p className="text-sm text-secondary-500">{selectedOrder.customer?.address}</p>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h4 className="font-medium text-secondary-800 mb-2">Articles</h4>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-secondary-600">{item.dish?.name || item.name} x{item.quantity}</span>
                          <span className="font-medium">{(item.price * item.quantity).toFixed(2)} TND</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-secondary-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-secondary-900">Total</span>
                      <span className="font-bold text-lg text-primary-600">
                        {selectedOrder.total?.toFixed(2)} TND
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-600">Sélectionnez une commande</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Dishes Tab */}
        {activeTab === 'dishes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-secondary-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="font-display text-xl font-semibold text-secondary-900">
                  Gestion des plats ({filteredDishes.length})
                </h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => { setEditingDish(null); setShowDishForm(true) }}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200 bg-secondary-50">
                      <th className="text-left py-4 px-6 font-medium text-secondary-600">Plat</th>
                      <th className="text-left py-4 px-6 font-medium text-secondary-600">Catégorie</th>
                      <th className="text-left py-4 px-6 font-medium text-secondary-600">Prix</th>
                      <th className="text-left py-4 px-6 font-medium text-secondary-600">Note</th>
                      <th className="text-left py-4 px-6 font-medium text-secondary-600">Statut</th>
                      <th className="text-left py-4 px-6 font-medium text-secondary-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDishes.map((dish) => {
                      // Handle category as object (from API) or string (ID)
                      const categoryName = typeof dish.category === 'object' 
                        ? dish.category?.name 
                        : categories.find(c => c.id === dish.category || c.slug === dish.category)?.name || dish.category
                      return (
                        <tr key={dish.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' }}
                              />
                              <div>
                                <p className="font-medium text-secondary-900">{dish.name}</p>
                                <p className="text-xs text-primary-600 font-arabic">{dish.nameAr}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-secondary-600">
                            {categoryName || 'Non catégorisé'}
                          </td>
                          <td className="py-4 px-6 font-semibold">{dish.price} TND</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{dish.rating || 0}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => toggleDishAvailability(dish.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                dish.isAvailable 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingDish(dish); setShowDishForm(true) }}
                                className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDish(dish.id)}
                                className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredDishes.length === 0 && (
                  <div className="p-12 text-center">
                    <Utensils className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-600">Aucun plat trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-secondary-200 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-secondary-900">
                  Publications ({posts.length})
                </h2>
                <button 
                  onClick={() => { setEditingPost(null); setShowPostForm(true) }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle publication
                </button>
              </div>
              <div className="divide-y divide-secondary-100">
                {posts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-secondary-50">
                    <div className="flex gap-4">
                      {post.image && (
                        <img
                          src={post.image}
                          alt=""
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-secondary-800 mb-2 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-secondary-500">
                          <span>{post.likes} likes</span>
                          <span>{post.comments?.length || 0} commentaires</span>
                          <span>{new Date(post.createdAt).toLocaleDateString('fr-TN')}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => { setEditingPost(post); setShowPostForm(true) }}
                          className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-600">Aucune publication</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="font-display text-xl font-semibold text-secondary-900">
                  Clients ({customers.length})
                </h2>
              </div>
              {customers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200 bg-secondary-50">
                        <th className="text-left py-4 px-6 font-medium text-secondary-600">Client</th>
                        <th className="text-left py-4 px-6 font-medium text-secondary-600">Email</th>
                        <th className="text-left py-4 px-6 font-medium text-secondary-600">Téléphone</th>
                        <th className="text-left py-4 px-6 font-medium text-secondary-600">Inscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="font-semibold text-primary-600">
                                  {customer.firstName?.[0]}{customer.lastName?.[0]}
                                </span>
                              </div>
                              <span className="font-medium text-secondary-900">
                                {customer.firstName} {customer.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-secondary-600">{customer.email}</td>
                          <td className="py-4 px-6 text-secondary-600">{customer.phone || '-'}</td>
                          <td className="py-4 px-6 text-secondary-600">
                            {new Date(customer.createdAt).toLocaleDateString('fr-TN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-600">Aucun client enregistré</p>
                  <p className="text-sm text-secondary-500 mt-2">
                    Les clients apparaîtront ici après leur première commande
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="font-display text-xl font-semibold text-secondary-900">
                  Messages de contact ({messages.length})
                </h2>
              </div>
              <div className="divide-y divide-secondary-100">
                {messages.length === 0 ? (
                  <div className="p-12 text-center">
                    <Mail className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-500">Aucun message</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-4 hover:bg-secondary-50 ${!msg.isRead ? 'bg-primary-50' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          {!msg.isRead && (
                            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                          <span className="font-semibold text-secondary-900">{msg.name}</span>
                          <span className="text-sm text-secondary-500">{msg.email}</span>
                        </div>
                        <span className="text-xs text-secondary-400">
                          {new Date(msg.createdAt).toLocaleString('fr-TN')}
                        </span>
                      </div>
                      <p className="text-sm text-primary-600 mb-1 font-medium">
                        Sujet: {msg.subject === 'general' ? 'Question générale' : 
                                msg.subject === 'order' ? 'Commande' :
                                msg.subject === 'catering' ? 'Traiteur' : msg.subject}
                      </p>
                      <p className="text-secondary-700 mb-3">{msg.message}</p>
                      {msg.phone && (
                        <p className="text-sm text-secondary-500 mb-3">
                          <Phone className="w-4 h-4 inline mr-1" /> {msg.phone}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {!msg.isRead && (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                          >
                            <Check className="w-3 h-3 inline mr-1" /> Marquer lu
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}`}
                          className="px-3 py-1.5 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                        >
                          <Mail className="w-3 h-3 inline mr-1" /> Répondre
                        </a>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          <Trash2 className="w-3 h-3 inline mr-1" /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="font-display text-xl font-semibold text-secondary-900">
                  Avis clients ({reviews.length})
                </h2>
                <p className="text-sm text-secondary-500 mt-1">
                  {reviews.filter(r => !r.isApproved).length} avis en attente
                </p>
              </div>
              <div className="divide-y divide-secondary-100">
                {reviews.length === 0 ? (
                  <div className="p-12 text-center">
                    <Star className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-500">Aucun avis</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className={`p-4 ${!review.isApproved ? 'bg-yellow-50' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold">{review.customerName}</span>
                          <span className="text-sm text-secondary-500 ml-2">{review.customerCity}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {review.isApproved ? 'Approuvé' : 'En attente'}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-secondary-300'}`} />
                        ))}
                      </div>
                      <p className="text-secondary-700 mb-3">"{review.comment}"</p>
                      <div className="flex gap-2">
                        {!review.isApproved && (
                          <button onClick={() => approveReview(review.id)} className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                            <Check className="w-3 h-3 inline mr-1" /> Approuver
                          </button>
                        )}
                        <button onClick={() => deleteReview(review.id)} className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                          <Trash2 className="w-3 h-3 inline mr-1" /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                Informations du restaurant
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nom du restaurant
                  </label>
                  <input
                    type="text"
                    value={settingsForm.restaurantName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, restaurantName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    value={settingsForm.openingHours}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, openingHours: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                  Paramètres de livraison
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Frais de livraison (TND)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFee}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Seuil livraison gratuite (TND)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, freeDeliveryThreshold: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Numéro WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="+216..."
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                  Compte administrateur
                </h2>
                <p className="text-secondary-600 mb-4">
                  Connecté en tant que: <strong>{adminUser?.email}</strong>
                </p>
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Se déconnecter
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <button 
                onClick={handleSaveSettings}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
