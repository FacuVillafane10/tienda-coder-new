// components/Cart.jsx
import { useContext } from 'react';
import { CartContext } from './CartContext';

function Cart() {
  const { cart, getCartCount } = useContext(CartContext); // Obtener carrito y método para contar los productos

  // Generar mensaje para WhatsApp con los productos del carrito
  const generarMensajeWhatsApp = () => {
    if (cart.length === 0) {
      return "Tu carrito está vacío. Agrega productos para realizar el pedido.";
    }

    const productosEnCarrito = cart.map(item => 
      `${item.nombre} (${item.quantity}) x $${item.precio}`).join('  '); // Usamos item.quantity

    if (cart.length === 1) {
      return `Hola, me gustaría hacer un pedido del siguiente producto: ${productosEnCarrito}`;
    }

    return `Hola, me gustaría hacer un pedido de los siguientes productos: ${productosEnCarrito}`;
  };

  const numeroWhatsApp = '+54903518084765'; // Tu número de WhatsApp
  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(generarMensajeWhatsApp())}`;

  return (
    <div>
      <h3>Carrito de compras</h3>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.foto} alt={item.nombre} />
              <h4>{item.nombre}</h4>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio: ${item.precio}</p>
            </div>
          ))}
          <h4>Total: ${cart.reduce((total, item) => total + item.precio * item.quantity, 0)}</h4>
          
          {/* Botón para enviar el carrito por WhatsApp */}
          <button 
            className="btn btn-success mt-3" 
            onClick={() => window.open(linkWhatsApp, '_blank')}
            disabled={getCartCount() === 0} 
          >
            {getCartCount() === 0 ? "Carrito vacío" : "Enviar carrito a WhatsApp"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;