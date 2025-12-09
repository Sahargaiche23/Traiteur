import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-secondary-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-secondary-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-secondary-600 mb-8">
            Découvrez nos délicieux plats et commencez votre commande
          </p>
          <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Voir le menu
          </Link>
        </div>
      </div>
    )
  }

  const deliveryFee = total >= 50 ? 0 : 7
  const finalTotal = total + deliveryFee

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-secondary-900 mb-1">
              Votre Panier
            </h1>
            <p className="text-secondary-600">
              {cart.length} article{cart.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.id}-${JSON.stringify(item.options)}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{item.name}</h3>
                        <p className="text-sm text-secondary-500 font-arabic">{item.nameAr}</p>
                        {item.options?.portion && (
                          <p className="text-sm text-primary-600 mt-1">
                            {item.options.portion}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-secondary-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-bold text-lg text-secondary-900">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Continuer mes achats
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-secondary-600">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Livraison</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">Gratuit</span>
                  ) : (
                    <span>{deliveryFee.toFixed(2)} TND</span>
                  )}
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-secondary-500">
                    Livraison gratuite à partir de 50 TND
                  </p>
                )}
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-secondary-900">Total</span>
                    <span className="font-bold text-xl text-primary-600">
                      {finalTotal.toFixed(2)} TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code promo"
                    className="flex-1 px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                  />
                  <button className="px-4 py-3 bg-secondary-100 text-secondary-700 rounded-xl font-medium hover:bg-secondary-200 transition-colors text-sm">
                    Appliquer
                  </button>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Passer la commande
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <p className="text-sm text-secondary-500 text-center mb-3">
                  Paiement sécurisé
                </p>
                <div className="flex justify-center gap-4">
                  <div className="w-12 h-8 bg-secondary-100 rounded flex items-center justify-center text-xs font-bold text-secondary-500">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-secondary-100 rounded flex items-center justify-center text-xs font-bold text-secondary-500">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-secondary-100 rounded flex items-center justify-center text-xs font-bold text-secondary-500">
                    Cash
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
