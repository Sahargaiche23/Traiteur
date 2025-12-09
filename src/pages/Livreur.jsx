import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Truck, Package, MapPin, Phone, Clock, Check, X, 
  User, LogOut, Navigation, CheckCircle, AlertCircle,
  ChevronRight, Timer, DollarSign
} from 'lucide-react'
import { useStore, useLivreurAuth } from '../store/useStore'

// Login Component
function LivreurLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { loginLivreur } = useLivreurAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (loginLivreur(email, password)) {
      onLogin()
    } else {
      setError('Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">
            Espace Livreur
          </h1>
          <p className="text-secondary-600 mt-2">
            Connectez-vous pour voir vos livraisons
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
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="livreur@yoldezchouaib.tn"
              required
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-blue-500 outline-none"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-secondary-600 text-center">
            <strong>Identifiants de démonstration:</strong><br />
            Email: livreur@yoldezchouaib.tn<br />
            Mot de passe: livreur123
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function Livreur() {
  const { isLivreurAuthenticated, logoutLivreur, livreur } = useLivreurAuth()
  const { orders, updateOrderStatus, fetchOrders } = useStore()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (isLivreurAuthenticated) {
      fetchOrders()
    }
  }, [isLivreurAuthenticated])

  if (!isLivreurAuthenticated) {
    return <LivreurLogin onLogin={() => {}} />
  }

  // Filter orders for delivery
  const pendingDeliveries = (orders || []).filter(o => 
    o.status === 'preparing' || o.status === 'PREPARING'
  )
  const activeDeliveries = (orders || []).filter(o => 
    o.status === 'delivering' || o.status === 'DELIVERING'
  )
  const completedDeliveries = (orders || []).filter(o => 
    o.status === 'delivered' || o.status === 'DELIVERED'
  )

  const handleStartDelivery = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'delivering')
      fetchOrders()
    } catch (error) {
      console.error('Error starting delivery:', error)
    }
  }

  const handleCompleteDelivery = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'delivered')
      fetchOrders()
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error completing delivery:', error)
    }
  }

  const getDisplayOrders = () => {
    switch (activeTab) {
      case 'pending': return pendingDeliveries
      case 'active': return activeDeliveries
      case 'completed': return completedDeliveries
      default: return []
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg">Espace Livreur</h1>
                <p className="text-blue-200 text-sm">{livreur?.name}</p>
              </div>
            </div>
            <button
              onClick={logoutLivreur}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-yellow-600">{pendingDeliveries.length}</p>
            <p className="text-xs text-secondary-500">À prendre</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{activeDeliveries.length}</p>
            <p className="text-xs text-secondary-500">En cours</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{completedDeliveries.length}</p>
            <p className="text-xs text-secondary-500">Livrées</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          {[
            { id: 'pending', label: 'À prendre', count: pendingDeliveries.length },
            { id: 'active', label: 'En cours', count: activeDeliveries.length },
            { id: 'completed', label: 'Livrées', count: completedDeliveries.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        {getDisplayOrders().length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Package className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">Aucune commande</p>
          </div>
        ) : (
          getDisplayOrders().map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-secondary-900">
                      Commande #{order.id?.toString().slice(-6) || order.orderNumber?.slice(-6)}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{order.total?.toFixed(2)} TND</p>
                    <p className="text-xs text-secondary-400">
                      {order.items?.length || 0} articles
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-secondary-100"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Adresse de livraison</p>
                            <p className="text-sm text-secondary-600">
                              {order.address || order.customer?.address || 'Non spécifiée'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-secondary-400" />
                          <div>
                            <p className="text-sm font-medium">Téléphone</p>
                            <a 
                              href={`tel:${order.phone || order.customer?.phone}`}
                              className="text-sm text-blue-600"
                            >
                              {order.phone || order.customer?.phone || 'Non spécifié'}
                            </a>
                          </div>
                        </div>
                        
                        {/* Items */}
                        <div className="bg-secondary-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Articles:</p>
                          {order.items?.map((item, i) => (
                            <p key={i} className="text-sm text-secondary-600">
                              • {item.quantity}x {item.dish?.name || item.name}
                            </p>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          {(order.status === 'preparing' || order.status === 'PREPARING') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartDelivery(order.id)
                              }}
                              className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                              <Navigation className="w-4 h-4" />
                              Commencer la livraison
                            </button>
                          )}
                          {(order.status === 'delivering' || order.status === 'DELIVERING') && (
                            <>
                              <a
                                href={`tel:${order.phone || order.customer?.phone}`}
                                className="flex-1 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-medium flex items-center justify-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="w-4 h-4" />
                                Appeler
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCompleteDelivery(order.id)
                                }}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Livrée
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
