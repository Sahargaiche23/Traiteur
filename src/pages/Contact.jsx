import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  Facebook, Instagram, MessageCircle 
} from 'lucide-react'
import { API_BASE } from '../services/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send message to API
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Erreur envoi message')
      
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-secondary-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Une question? Une demande de devis? Nous sommes là pour vous aider!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                Nos Coordonnées
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Téléphone', value: '+216 93 156 280', href: 'tel:+21693156280' },
                  { icon: Mail, label: 'Email', value: 'Yoldes.ch82@gmail.com', href: 'mailto:Yoldes.ch82@gmail.com' },
                  { icon: MapPin, label: 'Adresse', value: 'Tunis, Sousse' },
                  { icon: Clock, label: 'Horaires', value: '8h - 22h, 7j/7' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-secondary-800 hover:text-primary-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-secondary-800">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                Suivez-nous
              </h2>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 hover:bg-primary-600 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-secondary-900 mb-2">
                    Message envoyé!
                  </h3>
                  <p className="text-secondary-600 mb-6">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn-primary"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                    Envoyez-nous un message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
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
                          className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
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
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Sujet *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                      >
                        <option value="general">Question générale</option>
                        <option value="order">Question sur une commande</option>
                        <option value="event">Demande pour événement</option>
                        <option value="quote">Demande de devis</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl shadow-sm p-4 h-80 overflow-hidden"
        >
          <div className="w-full h-full bg-secondary-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">
                Carte Google Maps - Tunis, Sousse
              </p>
              <p className="text-sm text-secondary-500 mt-2">
                Intégration Google Maps à venir
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
