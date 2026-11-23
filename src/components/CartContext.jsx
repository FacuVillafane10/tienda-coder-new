import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

const CLAVE_GUARDADO = 'paulafoods-carrito';

// Se guarda solo lo necesario para mostrar el carrito y armar el pedido
const resumirProducto = ({ id, nombre, precio, foto, quantity }) => ({ id, nombre, precio, foto, quantity });

const leerCarritoGuardado = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(leerCarritoGuardado);

  // El carrito no se pierde si se recarga la página
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(cart));
    } catch {
      // Sin espacio o almacenamiento bloqueado: el carrito sigue funcionando en memoria
    }
  }, [cart]);

  // Agrega un producto; si ya estaba, suma la cantidad
  const addToCart = (producto, cantidad = 1) => {
    setCart((prevCart) => {
      const existente = prevCart.find((item) => item.id === producto.id);
      if (existente) {
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, quantity: (item.quantity || 1) + cantidad } : item
        );
      }
      return [...prevCart, resumirProducto({ ...producto, quantity: cantidad })];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
      )
    );
  };

  const getCartCount = () => cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const getCartTotal = () => cart.reduce((total, item) => total + (Number(item.precio) || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, getCartCount, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
