import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, Truck, ChefHat, Check, Clock, MapPin, 
  Phone, Calendar, ArrowRight, Search, RefreshCw, Star, Send 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'

export default function OrderTracking() {
  const { orders, fetchOrders } = useStore()
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewSubmitted, setReviewSubmitted] = useState({})

  const submitReview = async (orderId) => {
    if (!reviewForm.comment.trim()) return
    try {
      await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Client',
          customerCity: user?.city || 'Tunisie',
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      })
      setReviewSubmitted(prev => ({ ...prev, [orderId]: true }))
      setReviewForm({ rating: 5, comment: '' })
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      await fetchOrders()
      setLoading(false)
    }
    loadOrders()
  }, [])

  // Filter orders for current user (by email)
  const userOrders = (orders || []).filter(order => {
    if (!user?.email) return false
    return order.customer?.email?.toLowerCase() === user.email.toLowerCase()
  })

  // Sort orders by date, most recent first
  const sortedOrders = [...userOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  useEffect(() => {
    if (sortedOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(sortedOrders[0])
    }
  }, [sortedOrders.length])

  const getStatusInfo = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending'
    const statuses = {
      pending: { 
        label: 'En attente', 
        color: 'text-yellow-600 bg-yellow-100',
        step: 1 
      },
      confirmed: { 
        label: 'Confirmée', 
        color: 'text-blue-600 bg-blue-100',
        step: 2 
      },
      preparing: { 
        label: 'En préparation', 
        color: 'text-orange-600 bg-orange-100',
        step: 3 
      },
      delivering: { 
        label: 'En livraison', 
        color: 'text-purple-600 bg-purple-100',
        step: 4 
      },
      delivered: { 
        label: 'Livrée', 
        color: 'text-green-600 bg-green-100',
        step: 5 
      },
    }
    return statuses[normalizedStatus] || statuses.pending
  }

  const orderSteps = [
    { icon: Clock, label: 'Commande reçue' },
    { icon: Check, label: 'Confirmée' },
    { icon: ChefHat, label: 'En préparation' },
    { icon: Truck, label: 'En livraison' },
    { icon: Package, label: 'Livrée' },
  ]

  const filteredOrders = searchId 
    ? sortedOrders.filter(o => o.id?.toString().includes(searchId))
    : sortedOrders

  if (sortedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-secondary-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-secondary-900 mb-2">
            Aucune commande
          </h2>
          <p className="text-secondary-600 mb-8">
            Vous n'avez pas encore passé de commande
          </p>
          <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
            Découvrir nos plats
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">
            Suivi des Commandes
          </h1>
          <p className="text-secondary-600">
            Suivez l'état de vos commandes en temps réel
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Rechercher par numéro de commande..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-secondary-800 mb-2">
              Mes commandes ({filteredOrders.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <motion.button
                    key={order.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                      selectedOrder?.id === order.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-secondary-200 bg-white hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-secondary-900">
                        #{order.id.toString().slice(-6)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 mb-1">
                      {order.items?.length || 0} article(s)
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-secondary-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </span>
                      <span className="font-semibold text-primary-600">
                        {order.total?.toFixed(2) || '0.00'} TND
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-secondary-100">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-secondary-900 mb-1">
                        Commande #{selectedOrder.id.toString().slice(-6)}
                      </h2>
                      <p className="text-secondary-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedOrder.createdAt).toLocaleString('fr-TN')}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary-100 rounded-full text-sm font-medium text-secondary-700 hover:bg-secondary-200 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      Actualiser
                    </button>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="p-6 bg-gradient-warm">
                  <h3 className="font-semibold text-secondary-800 mb-6">Suivi en temps réel</h3>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-secondary-200" />
                    {orderSteps.map((step, i) => {
                      const currentStep = getStatusInfo(selectedOrder.status).step
                      const isLastStep = i === orderSteps.length - 1
                      const isDelivered = currentStep === 5 // Status is "delivered"
                      const isCompleted = i + 1 < currentStep || (isLastStep && isDelivered)
                      const isCurrent = i + 1 === currentStep && !isDelivered
                      
                      return (
                        <div key={i} className="relative flex items-center gap-4 mb-6 last:mb-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                            isCompleted 
                              ? 'bg-green-500 text-white'
                              : isCurrent
                                ? 'bg-primary-600 text-white animate-pulse'
                                : 'bg-secondary-200 text-secondary-500'
                          }`}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              isCompleted || isCurrent ? 'text-secondary-900' : 'text-secondary-500'
                            }`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-primary-600">En cours...</p>
                            )}
                            {isCompleted && (
                              <p className="text-sm text-green-600">Terminé</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-t border-secondary-100">
                  <h3 className="font-semibold text-secondary-800 mb-4">Articles commandés</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-secondary-50 rounded-xl">
                        <img
                          src={item.dish?.image || item.image || 'https://via.placeholder.com/64'}
                          alt={item.dish?.name || item.name || 'Article'}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-secondary-900 truncate">
                            {item.dish?.name || item.name || 'Article'}
                          </h4>
                          <p className="text-sm text-secondary-500">
                            x{item.quantity}
                            {item.portion && ` • ${item.portion}`}
                          </p>
                        </div>
                        <p className="font-semibold text-secondary-900">
                          {(item.price * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="p-6 border-t border-secondary-100">
                  <h3 className="font-semibold text-secondary-800 mb-4">Informations de livraison</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondary-500">Adresse</p>
                        <p className="text-secondary-800">
                          {selectedOrder.customer?.address || 'Non spécifiée'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondary-500">Téléphone</p>
                        <p className="text-secondary-800">
                          {selectedOrder.customer?.phone || 'Non spécifié'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondary-500">Date de livraison</p>
                        <p className="text-secondary-800">
                          {selectedOrder.deliveryDate 
                            ? new Date(selectedOrder.deliveryDate).toLocaleDateString('fr-TN')
                            : 'Non spécifiée'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondary-500">Créneau horaire</p>
                        <p className="text-secondary-800">
                          {selectedOrder.deliveryTime || 'Non spécifié'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="p-6 bg-secondary-50 border-t border-secondary-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-secondary-800">Total</span>
                    <span className="font-bold text-2xl text-primary-600">
                      {selectedOrder.total?.toFixed(2) || '0.00'} TND
                    </span>
                  </div>
                </div>

                {/* Review Section - Only for delivered orders */}
                {getStatusInfo(selectedOrder.status).step === 5 && (
                  <div className="p-6 border-t border-secondary-100">
                    <h3 className="font-semibold text-secondary-800 mb-4">
                      {reviewSubmitted[selectedOrder.id] ? '✓ Merci pour votre avis!' : 'Donnez votre avis'}
                    </h3>
                    {!reviewSubmitted[selectedOrder.id] ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-secondary-600 mb-2">Note</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= reviewForm.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-secondary-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-secondary-600 mb-2">Votre commentaire</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Partagez votre expérience..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                          />
                        </div>
                        <button
                          onClick={() => submitReview(selectedOrder.id)}
                          className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Envoyer mon avis
                        </button>
                      </div>
                    ) : (
                      <p className="text-green-600 text-center">
                        Votre avis sera affiché après validation par notre équipe.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">Sélectionnez une commande pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
