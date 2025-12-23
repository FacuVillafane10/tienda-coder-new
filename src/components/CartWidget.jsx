// src/components/CartWidget.jsx
import React from 'react';

function CartWidget({ count, message }) {
  return (
    <div className="cart-widget d-flex align-items-center">
      <span className="text-white mr-2">{message}</span>
      <div className="text-white">
        <span>Items en el carrito: {count}</span>
      </div>
    </div>
  );
}

export default CartWidget;
