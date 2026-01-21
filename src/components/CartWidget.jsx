import React from 'react';
import '../../src/App.css';

function CartWidget({ count, message }) {
  return (
    <div className="cart-widget d-flex align-items-center">
      <span className="text-white mr-2">{message}</span>
      <div className="text-white">
        <span className='text-span'> <br /> <br /> <br />Productos en el carrito: {count}</span>
      </div>
    </div>
  );
}

export default CartWidget;
