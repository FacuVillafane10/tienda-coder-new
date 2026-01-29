import React from 'react';
import '../../src/App.css';

function CartWidget({ count, message }) {
  return (
    <div className="cart-widget d-flex flex-column align-items-center text-dark">
      <h1 className="text-dark">{message}</h1>
      {count > 0 && (
        <h2 className="text-span text-dark">Productos en el carrito: {count}</h2>
      )}
    </div>
  );
}

export default CartWidget;
