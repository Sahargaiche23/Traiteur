import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, MapPin, Phone, Clock, CreditCard, Banknote, 
  Check, ArrowLeft, Truck, ShieldCheck 
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/useStore'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const { user, isAuthenticated, login } = useAuth()
  const { addOrder, addCustomer, settings } = useStore()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: 'Tunis',
    deliveryDate: '',
    deliveryTime: '',
    notes: '',
    paymentMethod: 'cash',
  })

  const deliveryFee = total >= 50 ? 0 : 7
  const finalTotal = total + deliveryFee

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format items for API
      const orderItems = cart.map(item => ({
        dishId: item.id,
        quantity: item.quantity,
        price: item.price,
        portion: item.selectedPortion || ''
      }))

      // Save order to store (which calls API)
      const newOrder = await addOrder({
        items: orderItems,
        total: finalTotal,
        customer: formData,
        address: formData.address,
        phone: formData.phone,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        notes: formData.notes,
      })

      // Auto-login the customer so they can track their order
      if (!isAuthenticated && formData.email) {
        login({
          id: Date.now(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        })
      }

      clearCart()
      setOrderId(newOrder?.id || Date.now())
      setOrderComplete(true)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-secondary-900 mb-2">
            Commande confirmée!
          </h2>
          <p className="text-secondary-600 mb-4">
            Merci pour votre commande. Vous recevrez une confirmation par SMS.
          </p>
          {formData.email && (
            <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2 mb-6">
              ✓ Vous êtes connecté(e) avec {formData.email} pour suivre vos commandes
            </p>
          )}
          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-secondary-600 mb-1">Numéro de commande</p>
            <p className="font-bold text-primary-600 text-lg">#{orderId?.toString().slice(-6)}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary"
            >
              Suivre ma commande
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Retour à l'accueil
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au panier
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {['Informations', 'Livraison', 'Paiement'].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 ${i < step ? 'text-primary-600' : i === step ? 'text-primary-600' : 'text-secondary-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' : 'bg-secondary-100 text-secondary-400'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:inline font-medium">{label}</span>
              </div>
              {i < 2 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-primary-600' : 'bg-secondary-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Info */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary-600" />
                    Informations personnelles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+216 XX XXX XXX"
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>
                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-6 btn-primary w-full"
                    >
                      Continuer
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6 flex items-center gap-2">
                    <Truck className="w-6 h-6 text-primary-600" />
                    Livraison
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Adresse de livraison *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Rue, numéro, appartement..."
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Ville
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                        >
                          <option value="Tunis">Tunis</option>
                          <option value="Ariana">Ariana</option>
                          <option value="Ben Arous">Ben Arous</option>
                          <option value="Manouba">Manouba</option>
                          <option value="Sousse">Sousse</option>
                          <option value="Sfax">Sfax</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Date de livraison *
                        </label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Créneau horaire *
                      </label>
                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                      >
                        <option value="">Choisir un créneau</option>
                        <option value="10:00-12:00">10h00 - 12h00</option>
                        <option value="12:00-14:00">12h00 - 14h00</option>
                        <option value="14:00-16:00">14h00 - 16h00</option>
                        <option value="16:00-18:00">16h00 - 18h00</option>
                        <option value="18:00-20:00">18h00 - 20h00</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Instructions de livraison
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Interphone, étage, code d'entrée..."
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                      />
                    </div>
                  </div>
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-6 btn-primary w-full"
                    >
                      Continuer
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary-600" />
                    Mode de paiement
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: 'cash', label: 'Paiement à la livraison', icon: Banknote, desc: 'Payez en espèces lors de la réception' },
                    ].map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          formData.paymentMethod === method.id ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                        }`}>
                          <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-secondary-900">{method.label}</p>
                          <p className="text-sm text-secondary-500">{method.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.paymentMethod === method.id ? 'border-primary-600 bg-primary-600' : 'border-secondary-300'
                        }`}>
                          {formData.paymentMethod === method.id && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-secondary-50 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-secondary-900">Paiement sécurisé</p>
                      <p className="text-sm text-secondary-600">
                        Vos informations sont protégées et cryptées
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        Confirmer la commande ({finalTotal.toFixed(2)} TND)
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                Votre commande
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-secondary-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-secondary-900">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-secondary-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-secondary-600">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-sm text-secondary-600">
                  <span>Livraison</span>
                  <span>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toFixed(2)} TND`}</span>
                </div>
                <div className="flex justify-between font-semibold text-secondary-900 text-lg pt-2 border-t border-secondary-200">
                  <span>Total</span>
                  <span className="text-primary-600">{finalTotal.toFixed(2)} TND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
