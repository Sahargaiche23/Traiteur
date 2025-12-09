import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

export function useInitData() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { fetchDishes, fetchPosts, fetchSettings } = useStore()

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchDishes(),
          fetchPosts(),
          fetchSettings(),
        ])
      } catch (error) {
        console.error('Failed to initialize data:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    init()
  }, [])

  return { isInitialized }
}

export function useAdminData() {
  const { fetchOrders, fetchCustomers, fetchStats } = useStore()

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchOrders(),
          fetchCustomers(),
          fetchStats(),
        ])
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      }
    }

    init()
  }, [])
}
