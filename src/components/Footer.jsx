import { Link } from 'react-router-dom'
import { ChefHat, Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-orange rounded-full flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">Traiteur Yoldez Chouaib</h3>
                <p className="text-sm text-secondary-400 font-arabic">يولدز شعيب</p>
              </div>
            </div>
            <p className="text-secondary-400 leading-relaxed">
              Service traiteur de qualité en Tunisie. Cuisine traditionnelle pour vos événements et repas quotidiens.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Nos Plats
                </Link>
              </li>
              <li>
                <Link to="/menu-builder" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Créer un Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Suivre Commande
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Mon Compte
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span className="text-secondary-400">+216 23 632 664</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="text-secondary-400">Yoldes.ch82@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-secondary-400">Tunis, Sousse</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className="text-secondary-400">8h - 22h, 7j/7</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Suivez-nous</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="text-secondary-400 text-sm">
              Rejoignez notre communauté pour les dernières nouveautés et promotions!
            </p>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-500 text-sm">
            © 2025 Traiteur Yoldez Chouaib. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-secondary-500 hover:text-primary-400 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-secondary-500 hover:text-primary-400 transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
