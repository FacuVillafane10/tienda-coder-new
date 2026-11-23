import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import { formatearPrecio } from '../utils/formato';

// En el celular, una barra fija abajo muestra el pedido en curso y lleva al carrito
function BarraPedido() {
  const { getCartCount, getCartTotal } = useContext(CartContext);
  const { pathname } = useLocation();
  const cantidad = getCartCount();

  if (cantidad === 0 || pathname === '/cart' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Link to="/cart" className="barra-pedido">
      <span className="barra-pedido__texto">
        {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
        <strong>{formatearPrecio(getCartTotal())}</strong>
      </span>
      <span className="barra-pedido__boton">
        Ver pedido <i className="bi bi-arrow-right" aria-hidden="true"></i>
      </span>
    </Link>
  );
}

export default BarraPedido;
