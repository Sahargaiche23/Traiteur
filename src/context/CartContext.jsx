import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Validate cart items against available dishes on load
  useEffect(() => {
    const validateCart = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/dishes')
        const dishes = await res.json()
        const validDishIds = new Set(dishes.map(d => d.id))
        
        setCart(prev => {
          const validItems = prev.filter(item => validDishIds.has(item.id))
          if (validItems.length !== prev.length) {
            console.log('Removed invalid items from cart')
          }
          return validItems
        })
      } catch (error) {
        console.error('Error validating cart:', error)
      }
    }
    validateCart()
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (dish, quantity = 1, options = {}) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === dish.id && JSON.stringify(item.options) === JSON.stringify(options)
      )
      
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }
      
      return [...prev, { ...dish, quantity, options }]
    })
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }
    setCart(prev => {
      const updated = [...prev]
      updated[index].quantity = quantity
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
