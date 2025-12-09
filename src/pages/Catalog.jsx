import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, Heart, ShoppingCart, X, ChevronDown } from 'lucide-react'
import { categories } from '../data/dishes'
import { useStore } from '../store/useStore'
import { useCart } from '../context/CartContext'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showFilters, setShowFilters] = useState(false)
  const { dishes } = useStore()
  const { addToCart } = useCart()

  const filteredDishes = useMemo(() => {
    let result = [...(dishes || [])]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(dish => 
        dish.name.toLowerCase().includes(query) ||
        dish.nameAr.includes(query) ||
        dish.description.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(dish => {
        // Handle both object and string category
        const categorySlug = typeof dish.category === 'object' 
          ? dish.category?.slug 
          : dish.category
        return categorySlug === selectedCategory
      })
    }

    // Filter by price
    result = result.filter(dish => dish.price >= priceRange[0] && dish.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    return result
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    if (categoryId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', categoryId)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-secondary-900 mb-2">
            Nos Plats
          </h1>
          <p className="text-secondary-600">
            Découvrez notre sélection de plats traditionnels tunisiens
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un plat..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white cursor-pointer"
              >
                <option value="popular">Plus populaires</option>
                <option value="rating">Mieux notés</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                showFilters 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'border-secondary-200 text-secondary-700 hover:border-primary-500'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtres
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-secondary-100">
                  <h4 className="font-medium text-secondary-800 mb-3">Fourchette de prix (TND)</h4>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-3 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                      min="0"
                    />
                    <span className="text-secondary-400">à</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-3 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                      min="0"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-5 py-2.5 rounded-full font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 hover:bg-primary-50'
            }`}
          >
            Tous
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-5 py-2.5 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-700 hover:bg-primary-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-secondary-600 mb-6">
          {filteredDishes.length} plat{filteredDishes.length > 1 ? 's' : ''} trouvé{filteredDishes.length > 1 ? 's' : ''}
        </p>

        {/* Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, i) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden card-hover group"
                >
                  <Link to={`/catalog/${dish.id}`} className="block relative h-52 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {dish.isPopular && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        Populaire
                      </span>
                    )}
                    <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-secondary-900/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                        {dish.price} TND
                      </span>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-secondary-800">{dish.rating}</span>
                      <span className="text-sm text-secondary-400">({dish.reviews})</span>
                    </div>
                    <Link to={`/catalog/${dish.id}`}>
                      <h3 className="font-display text-lg font-semibold text-secondary-900 mb-1 hover:text-primary-600 transition-colors">
                        {dish.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-primary-600 font-arabic mb-2">{dish.nameAr}</p>
                    <p className="text-secondary-500 text-sm line-clamp-2 mb-4">
                      {dish.description}
                    </p>
                    <button
                      onClick={() => addToCart(dish)}
                      className="w-full py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter au panier
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-secondary-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-secondary-800 mb-2">
              Aucun plat trouvé
            </h3>
            <p className="text-secondary-600 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setPriceRange([0, 2000])
              }}
              className="btn-outline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
