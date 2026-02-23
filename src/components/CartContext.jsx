import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (producto) => {
    setCart((prevCart) => {
      // Verificar si el producto ya existe en el carrito
      const existingProduct = prevCart.find(item => item.id === producto.id);
      
      if (existingProduct) {
        // Si ya existe, aumentamos la cantidad
        return prevCart.map(item =>
          item.id === producto.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        return [...prevCart, { ...producto, quantity: 1 }];
      }
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  };

  // Función para obtener el total de artículos en el carrito
  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      updateQuantity,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};