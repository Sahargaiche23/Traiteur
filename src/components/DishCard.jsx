import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function DishCard({ dish, index = 0 }) {
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  const fallbackImage = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop`

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden card-hover group">
      <Link to={`/catalog/${dish.id}`} className="block relative h-52 overflow-hidden">
        <img
          src={imageError ? fallbackImage : dish.image}
          alt={dish.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {dish.isPopular && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
            Populaire
          </span>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 backdrop-blur-sm text-secondary-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
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
    </div>
  )
}
