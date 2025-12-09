import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Trash2, Save, Edit2, Image, ChefHat, Utensils, X } from 'lucide-react'
import { categories } from '../data/dishes'
import { useCart } from '../context/CartContext'
import { useStore } from '../store/useStore'

export default function MenuBuilder() {
  const { addToCart } = useCart()
  const { dishes, fetchDishes } = useStore()
  const [savedMenus, setSavedMenus] = useState(() => {
    const saved = localStorage.getItem('savedMenus')
    return saved ? JSON.parse(saved) : []
  })
  const [currentMenu, setCurrentMenu] = useState({
    name: '',
    description: '',
    items: [],
  })
  const [editingMenu, setEditingMenu] = useState(null)
  const [showDishSelector, setShowDishSelector] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch dishes from API on mount
  useEffect(() => {
    fetchDishes()
  }, [])

  useEffect(() => {
    localStorage.setItem('savedMenus', JSON.stringify(savedMenus))
  }, [savedMenus])

  const filteredDishes = selectedCategory === 'all' 
    ? (dishes || [])
    : (dishes || []).filter(d => {
        const categorySlug = typeof d.category === 'object' ? d.category?.slug : d.category
        return categorySlug === selectedCategory
      })

  const addDishToMenu = (dish) => {
    const existing = currentMenu.items.find(item => item.id === dish.id)
    if (existing) {
      setCurrentMenu(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === dish.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }))
    } else {
      setCurrentMenu(prev => ({
        ...prev,
        items: [...prev.items, { ...dish, quantity: 1 }]
      }))
    }
  }

  const updateItemQuantity = (id, change) => {
    setCurrentMenu(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    }))
  }

  const removeItem = (id) => {
    setCurrentMenu(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const saveMenu = () => {
    if (!currentMenu.name.trim() || currentMenu.items.length === 0) return

    const newMenu = {
      id: editingMenu ? editingMenu.id : Date.now(),
      ...currentMenu,
      createdAt: editingMenu ? editingMenu.createdAt : new Date(),
      updatedAt: new Date(),
    }

    if (editingMenu) {
      setSavedMenus(prev => prev.map(m => m.id === editingMenu.id ? newMenu : m))
    } else {
      setSavedMenus(prev => [...prev, newMenu])
    }

    setCurrentMenu({ name: '', description: '', items: [] })
    setEditingMenu(null)
  }

  const editMenu = (menu) => {
    setCurrentMenu({
      name: menu.name,
      description: menu.description || '',
      items: menu.items,
    })
    setEditingMenu(menu)
  }

  const deleteMenu = (id) => {
    setSavedMenus(prev => prev.filter(m => m.id !== id))
  }

  const orderMenu = (menu) => {
    menu.items.forEach(item => {
      addToCart(item, item.quantity)
    })
  }

  const menuTotal = currentMenu.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-secondary-900 mb-2">
            Créer un Menu Préféré
          </h1>
          <p className="text-secondary-600">
            Composez votre menu personnalisé et sauvegardez-le pour commander rapidement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Menu Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-primary-600" />
                {editingMenu ? 'Modifier le menu' : 'Nouveau menu'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nom du menu *
                  </label>
                  <input
                    type="text"
                    value={currentMenu.name}
                    onChange={(e) => setCurrentMenu(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Déjeuner familial, Menu fête..."
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={currentMenu.description}
                    onChange={(e) => setCurrentMenu(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre menu..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Selected Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-secondary-900 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-primary-600" />
                  Plats sélectionnés
                </h2>
                <button
                  onClick={() => setShowDishSelector(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un plat
                </button>
              </div>

              {currentMenu.items.length > 0 ? (
                <div className="space-y-3">
                  {currentMenu.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary-900 truncate">{item.name}</h3>
                        <p className="text-sm text-primary-600">{item.price} TND</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">
                          {(item.price * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-secondary-400" />
                  </div>
                  <p className="text-secondary-600 mb-4">Aucun plat sélectionné</p>
                  <button
                    onClick={() => setShowDishSelector(true)}
                    className="btn-outline"
                  >
                    Parcourir les plats
                  </button>
                </div>
              )}

              {currentMenu.items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg text-secondary-700">Total du menu</span>
                    <span className="text-2xl font-bold text-primary-600">{menuTotal.toFixed(2)} TND</span>
                  </div>
                  <button
                    onClick={saveMenu}
                    disabled={!currentMenu.name.trim()}
                    className="w-full py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingMenu ? 'Mettre à jour le menu' : 'Sauvegarder le menu'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Saved Menus */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                Mes Menus Sauvegardés
              </h2>

              {savedMenus.length > 0 ? (
                <div className="space-y-4">
                  {savedMenus.map((menu) => (
                    <motion.div
                      key={menu.id}
                      layout
                      className="p-4 border border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-secondary-900">{menu.name}</h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => editMenu(menu)}
                            className="p-1.5 text-secondary-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMenu(menu.id)}
                            className="p-1.5 text-secondary-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {menu.description && (
                        <p className="text-sm text-secondary-500 mb-2">{menu.description}</p>
                      )}
                      <p className="text-sm text-secondary-600 mb-3">
                        {menu.items.length} plat{menu.items.length > 1 ? 's' : ''} • {' '}
                        <span className="font-semibold text-primary-600">
                          {menu.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} TND
                        </span>
                      </p>
                      <button
                        onClick={() => orderMenu(menu)}
                        className="w-full py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                      >
                        Commander ce menu
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8 text-secondary-400" />
                  </div>
                  <p className="text-secondary-600">
                    Aucun menu sauvegardé
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dish Selector Modal */}
        <AnimatePresence>
          {showDishSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowDishSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              >
                <div className="p-6 border-b border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-2xl font-semibold text-secondary-900">
                      Sélectionner des plats
                    </h3>
                    <button
                      onClick={() => setShowDishSelector(false)}
                      className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                    >
                      Tous
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-150px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDishes.map(dish => (
                      <div
                        key={dish.id}
                        className="flex items-center gap-4 p-4 border border-secondary-200 rounded-xl hover:border-primary-300 transition-colors"
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-secondary-900 truncate">{dish.name}</h4>
                          <p className="text-sm text-secondary-500 truncate">{dish.description}</p>
                          <p className="text-sm font-semibold text-primary-600 mt-1">{dish.price} TND</p>
                        </div>
                        <button
                          onClick={() => addDishToMenu(dish)}
                          className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
