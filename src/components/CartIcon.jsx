// components/CartIcon.jsx
import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import './CartIcon.css'; // ← Cambia esta línea

function CartIcon() {
  const { getCartCount } = useContext(CartContext);
  const count = getCartCount();

  if (count === 0) return null;

  return (
    <Link to="/cart" className="cart-icon-floating">
      <div className="cart-icon-container">
        <i className="bi bi-cart-fill"></i>
        <span className="cart-badge">{count}</span>
      </div>
    </Link>
  );
}

export default CartIcon;