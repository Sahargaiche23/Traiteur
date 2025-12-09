import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

// Default testimonials (fallback)
const defaultTestimonials = [
  {
    id: 1,
    customerName: 'Ahmed Ben Salem',
    customerCity: 'Tunis',
    rating: 5,
    comment: 'Le meilleur couscous que j\'ai goûté! Service impeccable et livraison rapide. Je recommande vivement.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    customerName: 'Fatma Mansouri',
    customerCity: 'Ariana',
    rating: 5,
    comment: 'Nous avons commandé pour notre mariage, tout était parfait! Les invités étaient ravis.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    customerName: 'Mohamed Trabelsi',
    customerCity: 'La Marsa',
    rating: 5,
    comment: 'Qualité exceptionnelle et goût authentique. C\'est devenu notre traiteur préféré pour tous les événements.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
]

export default function Testimonials() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    // Fetch approved reviews from API
    fetch('http://localhost:3001/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(() => setReviews([]))
  }, [])

  // Combine API reviews with default testimonials
  const allTestimonials = reviews.length > 0 
    ? [...reviews.slice(0, 6)] 
    : defaultTestimonials
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-secondary-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre plus grande fierté
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allTestimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary-50 rounded-2xl p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center overflow-hidden">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.customerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary-600">
                      {testimonial.customerName?.charAt(0) || 'C'}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">{testimonial.customerName}</h4>
                  <p className="text-sm text-secondary-500">{testimonial.customerCity}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating || 5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-secondary-700 leading-relaxed">
                "{testimonial.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
