import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import './CartWidget.css'; 

function CartWidget() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false); 

  
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  
  const totalPrice = cart.reduce((total, item) => {
    const price = item.precio || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }


    clearCart();

    
    setPaymentSuccess(true);
  };

  
  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">
          <h4>Tu carrito está vacío</h4>
          <p>¡Agrega algunos productos deliciosos!</p>
          <Link to="/" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Carrito de Compras</h2>


      {paymentSuccess && (
        <div className="alert alert-success text-center">
          <h4>¡Pago realizado con éxito!</h4>
          <p>Tu pedido ha sido procesado. Gracias por comprar con nosotros.</p>
          <Link to="/" className="btn btn-primary">
            Regresar al inicio
          </Link>
        </div>
      )}


      {!paymentSuccess && (
        <div className="row">
          <div className="col-md-8">
            {cart.map((producto) => (
              <div key={producto.id} className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img 
                      src={producto.foto} 
                      className="img-fluid rounded-start" 
                      alt={producto.nombre}
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">{producto.nombre}</h5>
                          <p className="card-text text-muted small">
                            {producto.descripcion}
                          </p>
                        </div>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(producto.id)}
                          aria-label={`Eliminar ${producto.nombre}`}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>

                      <div className="d-flex align-items-center mt-2">
                        <label className="me-2">Cantidad:</label>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(producto.id, -1)}
                            disabled={(producto.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <span className="btn btn-outline-secondary btn-sm disabled">
                            {producto.quantity || 1}
                          </span>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(producto.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="card sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="card-title">Resumen del pedido</h5>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Total de productos:</span>
                  <strong>{totalItems}</strong>
                </div>
                {/* Descomentar si tienes precios */}
                
                <div className="d-flex justify-content-between mb-3">
                  <span>Total:</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
               
                <button 
                  className="btn btn-success w-100 mb-2"
                  onClick={handleCheckout} // Llamada al proceso de pago
                >
                  Proceder al pago
                </button>
                <button 
                  className="btn btn-outline-danger w-100 mb-2"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
                <Link to="/?#" className="btn btn-outline-primary w-100">
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartWidget;
