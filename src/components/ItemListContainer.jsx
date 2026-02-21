import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../assets/service/firebase';  

function ItemListContainer({ message }) {
  
  const [productos, setProductos] = useState([]);
  const { addToCart, cart, getCartCount } = useContext(CartContext); // Usamos getCartCount

  const handleAddToCart = (comida) => {
    addToCart(comida);    
  };

  const [error, setError] = useState(null); 

  useEffect(() => {
    const prodCollection = collection(db, "productos");
    
    getDocs(prodCollection)
      .then((res) => {
        const productosData = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);
      })
      .catch((error) => {
        setError('Error al obtener productos');
        console.error("Error obteniendo productos de Firebase: ", error);
      });
  }, []);

  const generarMensajeWhatsApp = () => {
  if (cart.length === 0) {
    return "Tu carrito está vacío. Agrega productos para realizar el pedido.";
  }

  // Crear el mensaje con saltos de línea usando \n
  const productosEnCarrito = cart.map(item => 
    `${item.nombre} (${item.quantity}) x $${item.precio}`).join('\n'); // Usamos \n para el salto de línea

  return `Hola, me gustaría hacer un pedido de los siguientes productos: \n${productosEnCarrito}`;
};

const numeroWhatsApp = '+5403512417327'; // Tu número de WhatsApp
const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(generarMensajeWhatsApp())}`;

  return (
    <div>
      <h3 className="d-flex justify-content-center">{message}</h3>
      {error && <p>{error}</p>}
      <div className="item-list">
        {productos.map((comida) => (
          <div key={comida.id} className="item-card">
            <img src={comida.foto} alt={comida.nombre} />
            <h3>{comida.nombre}</h3>
            <p className="descripcion-producto">{comida.descripcion}</p>
            <button 
              className="btn btn-primary mb-2"
              onClick={() => handleAddToCart(comida)}
            >
              Agregar al carrito
            </button>
            <Link to={`/product/${comida.id}`}>
              <button className="btn btn-secondary">
                Ver más sobre el Producto
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Botón para enviar el carrito por WhatsApp */}
      <button 
        className="btn btn-success mt-3" 
        onClick={() => window.open(linkWhatsApp, '_blank')}
        disabled={getCartCount() === 0} 
      >
        {getCartCount() === 0 ? "Carrito vacío" : "Enviar carrito a WhatsApp"}
      </button>
    </div>
  );
}

export default ItemListContainer;