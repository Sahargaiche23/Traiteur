import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dishesApi, postsApi, ordersApi, customersApi, settingsApi, statsApi, authApi } from '../services/api'

// Main application store with API integration
export const useStore = create((set, get) => ({
  // ============ LOADING STATE ============
  isLoading: false,
  error: null,

  // ============ DISHES STATE ============
  dishes: [],
  categories: [],

  fetchDishes: async () => {
    set({ isLoading: true })
    try {
      const { data } = await dishesApi.getAll()
      set({ dishes: data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  addDish: async (dish) => {
    try {
      const { data } = await dishesApi.create(dish)
      set((state) => ({ dishes: [...state.dishes, data] }))
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  updateDish: async (id, updates) => {
    try {
      const { data } = await dishesApi.update(id, updates)
      set((state) => ({
        dishes: state.dishes.map(d => d.id === id ? data : d)
      }))
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  deleteDish: async (id) => {
    try {
      await dishesApi.delete(id)
      set((state) => ({
        dishes: state.dishes.filter(d => d.id !== id)
      }))
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  toggleDishAvailability: async (id) => {
    const dish = get().dishes.find(d => d.id === id)
    if (dish) {
      return get().updateDish(id, { isAvailable: !dish.isAvailable })
    }
  },

  // ============ ORDERS STATE ============
  orders: [],

  fetchOrders: async () => {
    set({ isLoading: true })
    try {
      const { data } = await ordersApi.getAll()
      set({ orders: data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  addOrder: async (order) => {
    try {
      const { data } = await ordersApi.create(order)
      set((state) => ({ orders: [data, ...state.orders] }))
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const { data } = await ordersApi.updateStatus(id, status)
      set((state) => ({
        orders: state.orders.map(o => o.id === id ? data : o)
      }))
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // ============ POSTS STATE ============
  posts: [],

  fetchPosts: async () => {
    set({ isLoading: true })
    try {
      const { data } = await postsApi.getAll()
      set({ posts: data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  addPost: async (post) => {
    try {
      const { data } = await postsApi.create(post)
      set((state) => ({ posts: [data, ...state.posts] }))
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  updatePost: async (id, updates) => {
    try {
      const { data } = await postsApi.update(id, updates)
      set((state) => ({
        posts: state.posts.map(p => p.id === id ? data : p)
      }))
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  deletePost: async (id) => {
    try {
      await postsApi.delete(id)
      set((state) => ({
        posts: state.posts.filter(p => p.id !== id)
      }))
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  likePost: async (id) => {
    try {
      const { data } = await postsApi.like(id)
      set((state) => ({
        posts: state.posts.map(p => p.id === id ? data : p)
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  addComment: async (postId, comment) => {
    try {
      await postsApi.addComment(postId, comment)
      // Refresh posts to get updated comments
      get().fetchPosts()
    } catch (error) {
      set({ error: error.message })
    }
  },

  // ============ CUSTOMERS STATE ============
  customers: [],

  fetchCustomers: async () => {
    try {
      const { data } = await customersApi.getAll()
      set({ customers: data })
    } catch (error) {
      set({ error: error.message })
    }
  },

  addCustomer: async (customer) => {
    try {
      const { data } = await customersApi.create(customer)
      set((state) => ({ customers: [...state.customers, data] }))
      return data
    } catch (error) {
      // Ignore duplicate email errors
      if (!error.response?.data?.error?.includes('Email')) {
        set({ error: error.message })
      }
    }
  },

  // ============ SETTINGS STATE ============
  settings: {
    restaurantName: 'Traiteur Saida Fejjari Chouaieb',
    phone: '+21693156280',
    email: 'Yoldes.ch82@gmail.com',
    address: 'Tunis, Sousse',
    deliveryFee: 7,
    freeDeliveryThreshold: 50,
    openingHours: '8h - 22h',
    whatsappNumber: '+21693156280',
  },

  fetchSettings: async () => {
    try {
      const { data } = await settingsApi.get()
      set({ settings: data })
    } catch (error) {
      set({ error: error.message })
    }
  },

  updateSettings: async (updates) => {
    try {
      const { data } = await settingsApi.update(updates)
      set({ settings: data })
      return data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // ============ STATS ============
  stats: null,

  fetchStats: async () => {
    try {
      const { data } = await statsApi.get()
      set({ stats: data })
      return data
    } catch (error) {
      set({ error: error.message })
    }
  },

  // ============ SAVED MENUS (Local) ============
  savedMenus: [],

  addSavedMenu: (menu) => set((state) => ({
    savedMenus: [...state.savedMenus, {
      ...menu,
      id: Date.now(),
      createdAt: new Date()
    }]
  })),

  deleteSavedMenu: (id) => set((state) => ({
    savedMenus: state.savedMenus.filter(m => m.id !== id)
  })),
}))

// Admin authentication store
export const useAdminAuth = create(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,
      token: null,

      loginAdmin: async (email, password) => {
        try {
          const { data } = await authApi.adminLogin(email, password)
          localStorage.setItem('admin-token', data.token)
          set({ 
            isAdminAuthenticated: true, 
            adminUser: data.user,
            token: data.token
          })
          return true
        } catch (error) {
          // Fallback to local auth for demo
          if (email === 'Yoldes.ch82@gmail.com' && password === 'admin123') {
            set({ 
              isAdminAuthenticated: true, 
              adminUser: { email, name: 'Administrateur' }
            })
            return true
          }
          return false
        }
      },

      logoutAdmin: () => {
        localStorage.removeItem('admin-token')
        set({ 
          isAdminAuthenticated: false, 
          adminUser: null,
          token: null
        })
      },
    }),
    {
      name: 'admin-auth',
    }
  )
)

// Livreur authentication store
export const useLivreurAuth = create(
  persist(
    (set) => ({
      isLivreurAuthenticated: false,
      livreur: null,

      loginLivreur: (email, password) => {
        if (email === 'livreur@yoldezchouaib.tn' && password === 'livreur123') {
          set({ 
            isLivreurAuthenticated: true, 
            livreur: { email, name: 'Livreur 1', phone: '+21693156280' }
          })
          return true
        }
        return false
      },

      logoutLivreur: () => {
        set({ 
          isLivreurAuthenticated: false, 
          livreur: null
        })
      },
    }),
    {
      name: 'livreur-auth',
    }
  )
)
