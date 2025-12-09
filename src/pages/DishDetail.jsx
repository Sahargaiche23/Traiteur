import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, Minus, Plus, ShoppingCart, ArrowLeft, Clock, Users, ChefHat } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useCart } from '../context/CartContext'

export default function DishDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dishes } = useStore()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedPortion, setSelectedPortion] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Handle both string IDs (Prisma CUID) and numeric IDs
  const dish = dishes.find(d => d.id === id || d.id === Number(id))
  
  // Get category ID/slug for similar dishes
  const dishCategoryId = typeof dish?.category === 'object' ? dish?.category?.id : dish?.category
  const similarDishes = dishes.filter(d => {
    const catId = typeof d.category === 'object' ? d.category?.id : d.category
    return catId === dishCategoryId && d.id !== dish?.id
  }).slice(0, 3)

  if (!dish) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-secondary-800 mb-4">
            Plat non trouvé
          </h2>
          <Link to="/catalog" className="btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  // Calculate price multiplier based on portion
  const getPortionMultiplier = (portionIndex) => {
    const portion = dish.portions?.[portionIndex] || ''
    const portionLower = portion.toLowerCase()
    
    // Parse portion weight
    if (portionLower.includes('2kg') || portionLower.includes('2 kg')) return 4
    if (portionLower.includes('1kg') || portionLower.includes('1 kg')) return 2
    if (portionLower.includes('500g') || portionLower.includes('500 g')) return 1
    if (portionLower.includes('grande') || portionLower.includes('large')) return 2
    if (portionLower.includes('moyenne') || portionLower.includes('medium')) return 1.5
    if (portionLower.includes('petite') || portionLower.includes('small')) return 1
    
    // Default: first portion = 1, second = 2, third = 4
    return portionIndex === 0 ? 1 : portionIndex === 1 ? 2 : 4
  }

  const currentMultiplier = getPortionMultiplier(selectedPortion)
  const currentPrice = dish.price * currentMultiplier

  const handleAddToCart = () => {
    addToCart({ ...dish, price: currentPrice }, quantity, { portion: dish.portions[selectedPortion] })
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-secondary-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            {dish.isPopular && (
              <span className="absolute top-6 left-6 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-full">
                Populaire
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(dish.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-secondary-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-secondary-800">{dish.rating}</span>
              <span className="text-secondary-500">({dish.reviews} avis)</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl font-bold text-secondary-900 mb-2">
              {dish.name}
            </h1>
            <p className="font-arabic text-2xl text-primary-600 mb-6">{dish.nameAr}</p>

            {/* Price */}
            <div className="text-3xl font-bold text-primary-600 mb-6">
              {currentPrice.toFixed(2)} TND
              {currentMultiplier > 1 && (
                <span className="text-sm font-normal text-secondary-500 ml-2">
                  (base: {dish.price} TND)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-secondary-600 text-lg leading-relaxed mb-8">
              {dish.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-700">Préparation 30 min</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
                <Users className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-700">Pour 2-4 pers.</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
                <ChefHat className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-700">Fait maison</span>
              </div>
            </div>

            {/* Portions */}
            <div className="mb-8">
              <h3 className="font-medium text-secondary-800 mb-3">Portion</h3>
              <div className="flex flex-wrap gap-3">
                {(dish.portions || []).map((portion, i) => {
                  const portionPrice = dish.price * getPortionMultiplier(i)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedPortion(i)}
                      className={`px-5 py-2.5 rounded-full font-medium transition-colors ${
                        selectedPortion === i
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-secondary-200 text-secondary-700 hover:border-primary-500'
                      }`}
                    >
                      {portion}
                      <span className="ml-2 text-sm opacity-75">
                        ({portionPrice.toFixed(0)} TND)
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-medium text-secondary-800 mb-3">Quantité</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-semibold text-secondary-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total & Add to Cart */}
            <div className="mt-auto pt-8 border-t border-secondary-200">
              <div className="flex items-center justify-between mb-6">
                <span className="text-secondary-600">Total</span>
                <span className="text-3xl font-bold text-secondary-900">
                  {(currentPrice * quantity).toFixed(2)} TND
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Ajouter au panier
              </button>
            </div>
          </motion.div>
        </div>

        {/* Similar Dishes */}
        {similarDishes.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarDishes.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/catalog/${item.id}`}
                    className="block bg-white rounded-2xl shadow-sm overflow-hidden card-hover group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute bottom-4 left-4 px-3 py-1 bg-secondary-900/80 text-white text-sm font-semibold rounded-full">
                        {item.price} TND
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-arabic">{item.nameAr}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
