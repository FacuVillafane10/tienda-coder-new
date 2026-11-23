import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import { formatearPrecio } from '../utils/formato';
import { WHATSAPP_POR_DEFECTO, obtenerWhatsApp } from '../utils/config';

const armarMensajePedido = (cart, total) => {
  const lineas = cart.map((item) => {
    const cantidad = item.quantity || 1;
    return `• ${cantidad} x ${item.nombre}: ${formatearPrecio((item.precio || 0) * cantidad)}`;
  });

  return ['¡Hola! Quiero hacer el siguiente pedido:', '', ...lineas, '', `Total: ${formatearPrecio(total)}`].join('\n');
};

const CartWidget = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, getCartCount, getCartTotal } = useContext(CartContext);
  // Se busca al abrir el carrito (no al tocar el botón) para que el celular no bloquee la ventana de WhatsApp
  const [numeroWhatsApp, setNumeroWhatsApp] = useState(WHATSAPP_POR_DEFECTO);

  useEffect(() => {
    obtenerWhatsApp().then(setNumeroWhatsApp);
  }, []);

  const totalItems = getCartCount();
  const total = getCartTotal();

  const enviarPedido = () => {
    if (cart.length === 0) return;
    const mensaje = encodeURIComponent(armarMensajePedido(cart, total));
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank', 'noopener');
  };

  const vaciar = () => {
    if (window.confirm('¿Vaciar el carrito?')) clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="contenedor">
        <div className="error-pagina">
          <div className="error-pagina__numero"><i className="bi bi-bag" aria-hidden="true"></i></div>
          <h1>Tu carrito está vacío</h1>
          <p>Elegí tus comidas del menú y armá tu pedido.</p>
          <Link to="/#menu" className="boton boton--primario">Ver el menú</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor seccion">
      <Link to="/#menu" className="volver">
        <i className="bi bi-arrow-left" aria-hidden="true"></i> Seguir comprando
      </Link>
      <h1 className="carrito__titulo">Tu pedido</h1>

      <div className="carrito">
        <ul className="carrito__lista" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {cart.map((producto) => {
            const cantidad = producto.quantity || 1;
            return (
              <li key={producto.id} className="linea">
                <img src={producto.foto} alt="" className="linea__foto" />
                <div className="linea__datos">
                  <h2 className="linea__nombre">{producto.nombre}</h2>
                  <span className="linea__precio-unitario">{formatearPrecio(producto.precio)} c/u</span>
                  <div className="cantidad" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
                    <button
                      className="boton-icono"
                      onClick={() => updateQuantity(producto.id, -1)}
                      disabled={cantidad <= 1}
                      aria-label="Restar uno"
                    >
                      <i className="bi bi-dash-lg" aria-hidden="true"></i>
                    </button>
                    <span className="cantidad__valor">{cantidad}</span>
                    <button className="boton-icono" onClick={() => updateQuantity(producto.id, 1)} aria-label="Sumar uno">
                      <i className="bi bi-plus-lg" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <div className="linea__lado">
                  <span className="linea__subtotal">{formatearPrecio((producto.precio || 0) * cantidad)}</span>
                  <button
                    className="boton boton--fantasma boton--chico"
                    onClick={() => removeFromCart(producto.id)}
                    aria-label={`Quitar ${producto.nombre}`}
                  >
                    <i className="bi bi-trash3" aria-hidden="true"></i> Quitar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="resumen">
          <h2>Resumen</h2>
          <div className="resumen__fila">
            <span>Productos</span>
            <span>{totalItems}</span>
          </div>
          <div className="resumen__total">
            <span>Total</span>
            <span className="precio">{formatearPrecio(total)}</span>
          </div>
          <button className="boton boton--whatsapp boton--ancho" onClick={enviarPedido}>
            <i className="bi bi-whatsapp" aria-hidden="true"></i> Enviar pedido por WhatsApp
          </button>
          <p className="resumen__nota">Se abre WhatsApp con tu pedido listo para enviar. Ahí coordinamos la entrega y el pago.</p>
          <button className="boton boton--fantasma boton--chico" onClick={vaciar}>
            Vaciar carrito
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartWidget;
