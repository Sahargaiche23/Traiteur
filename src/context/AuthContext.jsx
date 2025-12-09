import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('user')
      setIsAuthenticated(false)
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cart')
  }

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
