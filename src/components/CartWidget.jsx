import React from 'react';
import '../../src/App.css';

function CartWidget({ count, message }) {
  return (
    <>
      <div className="cart-widget d-flex align-items-center d-flex justify-content-center text-dark">
        <h1 className="text-dark mr-2">{message}</h1>
        <div className="text-dark">
          <span className='text-span text-dark d-flex align-items-center'> </span>        
        </div>
      </div>
      <div>
        <h2 className='text-span text-dark d-flex align-items-center justify-content-center'>Productos en el carrito: {count}</h2>  
      </div>
    </>
  );
}

export default CartWidget;
