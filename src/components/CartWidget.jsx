import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const NUMERO_WHATSAPP = '5493518084765';

const formatearPrecio = (valor) => `$${valor.toLocaleString('es-AR')}`;

const armarMensajePedido = (cart, totalPrice) => {
  const lineas = cart.map((item) => {
    const cantidad = item.quantity || 1;
    return `• ${cantidad} x ${item.nombre}: ${formatearPrecio((item.precio || 0) * cantidad)}`;
  });

  return [
    '¡Hola! Quiero hacer el siguiente pedido:',
    '',
    ...lineas,
    '',
    `Total: ${formatearPrecio(totalPrice)}`,
  ].join('\n');
};

const CartWidget = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((total, item) => {
    const price = item.precio || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);

  const enviarPedido = () => {
    if (cart.length === 0) {
      return;
    }

    const mensaje = encodeURIComponent(armarMensajePedido(cart, totalPrice));
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, '_blank', 'noopener');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Carrito de Compras</h2>

      {cart.length === 0 ? (
        <div className="text-center my-5">
          <p className="mb-3">Tu carrito está vacío.</p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-arrow-left"></i> Ver productos
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {cart.map((producto) => (
              <div key={producto.id} className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src={producto.foto}
                      className="img-fluid rounded-start container-fluid"
                      alt={producto.nombre}
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">{producto.nombre}</h5>
                          <p className="card-text text-muted small">{producto.descripcion}</p>
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
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => updateQuantity(producto.id, -1)}
                            disabled={(producto.quantity || 1) <= 1}
                          >
                            <i className="bi bi-dash-lg text-dark "></i>
                          </button>
                          <span className="btn btn-outline-dark btn-sm ">{producto.quantity || 1}</span>
                          <button
                            className="btn btn-outline-dark btn-sm text-black"
                            onClick={() => updateQuantity(producto.id, 1)}
                          >
                            <i className="bi bi-plus-lg text-black"></i>
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

                <div className="d-flex justify-content-between mb-3">
                  <span>Total:</span>
                  <strong>{formatearPrecio(totalPrice)}</strong>
                </div>

                <button className="btn btn-success w-100 mb-2" onClick={enviarPedido}>
                  <i className="bi bi-whatsapp"></i> Enviar pedido por WhatsApp
                </button>
                <button className="btn btn-outline-danger w-100 mb-2" onClick={clearCart}>
                  <i className="bi bi-trash"></i> Vaciar carrito
                </button>
                <Link to="/" className="btn btn-outline-primary w-100">
                  <i className="bi bi-arrow-left"></i> Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartWidget;
