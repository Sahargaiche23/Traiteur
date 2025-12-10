import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ChefHat, Truck, Clock, Star, ArrowRight, Heart, MessageCircle, 
  Send, ThumbsUp, Sparkles, Calendar, Users, User 
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import PromoBanner from '../components/PromoBanner'
import Testimonials from '../components/Testimonials'

export default function Home() {
  const { addToCart } = useCart()
  const { dishes, posts, likePost, addComment } = useStore()
  const { user, isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState({})
  const popularDishes = (dishes || []).filter(d => d.isPopular).slice(0, 6)

  const handleLike = (postId) => {
    likePost(postId)
  }

  const handleComment = (postId) => {
    if (!newComment[postId]?.trim()) return
    // Use logged-in user's name or "Visiteur"
    const userName = isAuthenticated 
      ? (user?.firstName || user?.email?.split('@')[0] || 'Client')
      : 'Visiteur'
    addComment(postId, {
      userName,
      text: newComment[postId],
      userImage: user?.profileImage || null,
    })
    setNewComment(prev => ({ ...prev, [postId]: '' }))
  }

  return (
    <div className="overflow-hidden">
      <PromoBanner />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://news.gnet.tn/wp-content/uploads/2021/09/cuisine-tunisienne-art-culinaire-33.jpg"
            alt="Cuisine tunisienne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-950/90 via-secondary-950/70 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 backdrop-blur-sm rounded-full text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Cuisine Traditionnelle Tunisienne
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Traiteur<br />
              <span className="text-primary-400">Saida Fejjari Chouaieb</span>
            </h1>
            <p className="font-arabic text-2xl text-primary-200 mb-4">سعيدة فجاري شعيب</p>
            <p className="text-xl text-secondary-300 mb-8 leading-relaxed">
              Des saveurs authentiques pour vos événements et repas quotidiens. 
              Commandez en ligne et profitez de notre service de livraison rapide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="btn-primary flex items-center gap-2">
                Découvrir nos plats
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/menu-builder" className="btn-outline border-white text-white hover:bg-white hover:text-secondary-900">
                Créer un menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ChefHat, title: 'Cuisine Authentique', desc: 'Recettes traditionnelles préparées avec passion' },
              { icon: Truck, title: 'Livraison Rapide', desc: 'Livraison à domicile partout en Tunisie' },
              { icon: Calendar, title: 'Événements', desc: 'Mariages, anniversaires, réceptions sur mesure' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-primary-50 card-hover"
              >
                <div className="w-14 h-14 bg-gradient-orange rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-secondary-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Posts & Social Feed */}
      <section className="py-20 bg-gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-secondary-900 mb-4">
              Actualités & Partages
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Découvrez nos dernières créations et partagez vos expériences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
              >
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <p className="text-secondary-800 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between border-t border-secondary-100 pt-4">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-secondary-500 hover:text-primary-600 transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-2 text-secondary-500">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments.length}</span>
                      </span>
                    </div>
                    <span className="text-sm text-secondary-400">
                      {new Date(post.createdAt).toLocaleDateString('fr-TN')}
                    </span>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {post.comments.slice(-2).map(comment => (
                        <div key={comment.id} className="bg-secondary-50 rounded-lg p-3 flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {comment.userImage ? (
                              <img src={comment.userImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-primary-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-secondary-800">{comment.userName || comment.user}: </span>
                            <span className="text-secondary-600">{comment.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Ajouter un commentaire..."
                      className="flex-1 px-4 py-2 rounded-full border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold text-secondary-900 mb-2">
                Nos Plats Populaires
              </h2>
              <p className="text-secondary-600">Les favoris de nos clients</p>
            </div>
            <Link to="/catalog" className="btn-outline flex items-center gap-2">
              Voir tout le menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDishes.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary-400 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                      {dish.price} TND
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-secondary-800">{dish.rating}</span>
                    <span className="text-sm text-secondary-400">({dish.reviews} avis)</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-secondary-900 mb-1">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-primary-600 font-arabic mb-3">{dish.nameAr}</p>
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                    {dish.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/catalog/${dish.id}`}
                      className="flex-1 py-2.5 text-center border-2 border-primary-600 text-primary-600 rounded-full font-medium hover:bg-primary-50 transition-colors"
                    >
                      Détails
                    </Link>
                    <button
                      onClick={() => addToCart(dish)}
                      className="flex-1 py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Users className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Vous préparez un événement?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Mariages, anniversaires, réunions d'entreprise... Nous créons des menus sur mesure pour rendre votre événement inoubliable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/catalog?category=evenements" 
                className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:bg-secondary-50 transition-colors"
              >
                Voir nos formules événements
              </Link>
              <a 
                href="tel:+21693156280" 
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Stats */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Événements réalisés' },
              { value: '10K+', label: 'Clients satisfaits' },
              { value: '50+', label: 'Plats au menu' },
              { value: '4.9', label: 'Note moyenne' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
