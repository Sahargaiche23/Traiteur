import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dishesApi, postsApi, ordersApi, customersApi, settingsApi, statsApi, authApi } from '../services/api'

// Storage key constant
const STORAGE_KEY = 'traiteur-storage'

// Main application store
export const useStore = create(
  persist(
    (set, get) => ({
      // ============ DISHES STATE ============
      dishes: initialDishes,
      categories: categories,

      addDish: (dish) => set((state) => ({
        dishes: [...state.dishes, { 
          ...dish, 
          id: Date.now(),
          rating: 0,
          reviews: 0,
          createdAt: new Date()
        }]
      })),

      updateDish: (id, updates) => set((state) => ({
        dishes: state.dishes.map(d => 
          d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
        )
      })),

      deleteDish: (id) => set((state) => ({
        dishes: state.dishes.filter(d => d.id !== id)
      })),

      toggleDishAvailability: (id) => set((state) => ({
        dishes: state.dishes.map(d => 
          d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
        )
      })),

      // ============ ORDERS STATE ============
      orders: [],

      addOrder: (order) => set((state) => ({
        orders: [...state.orders, {
          ...order,
          id: Date.now(),
          status: 'pending',
          createdAt: new Date()
        }]
      })),

      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => 
          o.id === id ? { ...o, status, updatedAt: new Date() } : o
        )
      })),

      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      })),

      // ============ POSTS STATE ============
      posts: initialPosts,

      addPost: (post) => set((state) => ({
        posts: [{
          ...post,
          id: Date.now(),
          likes: 0,
          comments: [],
          createdAt: new Date()
        }, ...state.posts]
      })),

      updatePost: (id, updates) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),

      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(p => p.id !== id)
      })),

      likePost: (id) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, likes: p.likes + 1 } : p
        )
      })),

      addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                comments: [...p.comments, {
                  id: Date.now(),
                  ...comment,
                  createdAt: new Date()
                }]
              } 
            : p
        )
      })),

      // ============ USERS/CUSTOMERS STATE ============
      customers: [],

      addCustomer: (customer) => set((state) => {
        const exists = state.customers.find(c => c.email === customer.email)
        if (exists) return state
        return {
          customers: [...state.customers, {
            ...customer,
            id: Date.now(),
            createdAt: new Date()
          }]
        }
      }),

      // ============ SAVED MENUS STATE ============
      savedMenus: [],

      addSavedMenu: (menu) => set((state) => ({
        savedMenus: [...state.savedMenus, {
          ...menu,
          id: Date.now(),
          createdAt: new Date()
        }]
      })),

      updateSavedMenu: (id, updates) => set((state) => ({
        savedMenus: state.savedMenus.map(m => 
          m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
        )
      })),

      deleteSavedMenu: (id) => set((state) => ({
        savedMenus: state.savedMenus.filter(m => m.id !== id)
      })),

      // ============ SETTINGS STATE ============
      settings: {
        restaurantName: 'Traiteur Yoldez Chouaib',
        phone: '+21623632664',
        email: 'Yoldes.ch82@gmail.com',
        address: 'Tunis, Sousse',
        deliveryFee: 7,
        freeDeliveryThreshold: 50,
        openingHours: '8h - 22h',
        whatsappNumber: '+21623632664',
      },

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      // ============ STATS ============
      getStats: () => {
        const state = get()
        const totalOrders = state.orders.length
        const pendingOrders = state.orders.filter(o => o.status === 'pending').length
        const preparingOrders = state.orders.filter(o => o.status === 'preparing').length
        const deliveringOrders = state.orders.filter(o => o.status === 'delivering').length
        const deliveredOrders = state.orders.filter(o => o.status === 'delivered').length
        const totalRevenue = state.orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + (o.total || 0), 0)
        const avgOrderValue = totalOrders > 0 
          ? state.orders.reduce((sum, o) => sum + (o.total || 0), 0) / totalOrders 
          : 0

        return {
          totalOrders,
          pendingOrders,
          preparingOrders,
          deliveringOrders,
          deliveredOrders,
          totalRevenue,
          avgOrderValue,
          totalDishes: state.dishes.length,
          totalCustomers: state.customers.length,
          totalPosts: state.posts.length,
        }
      }
    }),
    {
      name: STORAGE_KEY,
      storage: customStorage,
      partialize: (state) => ({
        orders: state.orders,
        customers: state.customers,
        savedMenus: state.savedMenus,
        settings: state.settings,
        posts: state.posts,
        dishes: state.dishes,
      }),
    }
  )
)

// Listen for changes from other tabs via BroadcastChannel
if (typeof window !== 'undefined' && channel) {
  channel.onmessage = (event) => {
    if (event.data.key === STORAGE_KEY) {
      try {
        const parsed = JSON.parse(event.data.value)
        if (parsed?.state) {
          useStore.setState(parsed.state)
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  
  // Also listen to storage events for other browser windows
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue)
        if (parsed?.state) {
          useStore.setState(parsed.state)
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  })
}

// Admin authentication store
export const useAdminAuth = create(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,

      loginAdmin: (email, password) => {
        // Default admin credentials (change in production!)
        if (email === 'Yoldes.ch82@gmail.com' && password === 'admin123') {
          set({ 
            isAdminAuthenticated: true, 
            adminUser: { email, name: 'Administrateur' }
          })
          return true
        }
        return false
      },

      logoutAdmin: () => set({ 
        isAdminAuthenticated: false, 
        adminUser: null 
      }),
    }),
    {
      name: 'admin-auth',
    }
  )
)
