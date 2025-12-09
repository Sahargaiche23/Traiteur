import { useState } from 'react'
import { X, Gift, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
        <Gift className="w-5 h-5 flex-shrink-0" />
        <p className="text-center">
          <span className="font-semibold">Offre spéciale!</span> Livraison gratuite pour toute commande de plus de 50 TND
        </p>
        <Link 
          to="/catalog" 
          className="hidden sm:flex items-center gap-1 font-semibold hover:underline"
        >
          Commander
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
