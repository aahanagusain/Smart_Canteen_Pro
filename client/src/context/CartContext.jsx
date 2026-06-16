import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  const addToCart = (restaurantId, restaurantName, menuItem) => {
    setItems((prev) => {
      const index = prev.findIndex((x) => x.restaurantId === restaurantId && x.name === menuItem.name)
      if (index >= 0) {
        const next = [...prev]
        next[index] = { ...next[index], qty: next[index].qty + 1 }
        return next
      }
      return [
        ...prev,
        {
          restaurantId,
          restaurantName,
          name: menuItem.name,
          price: menuItem.price,
          qty: 1,
        },
      ]
    })
  }

  const inc = (restaurantId, name) =>
    setItems((prev) =>
      prev.map((x) => (x.restaurantId === restaurantId && x.name === name ? { ...x, qty: x.qty + 1 } : x))
    )

  const dec = (restaurantId, name) =>
    setItems((prev) =>
      prev.map((x) =>
        x.restaurantId === restaurantId && x.name === name ? { ...x, qty: Math.max(1, x.qty - 1) } : x
      )
    )

  const remove = (restaurantId, name) =>
    setItems((prev) => prev.filter((x) => !(x.restaurantId === restaurantId && x.name === name)))

  const clear = () => setItems([])

  const totalItems = useMemo(() => items.reduce((sum, x) => sum + x.qty, 0), [items])
  const totalPrice = useMemo(() => items.reduce((sum, x) => sum + x.qty * x.price, 0), [items])

  return (
    <CartContext.Provider value={{ items, addToCart, inc, dec, remove, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
