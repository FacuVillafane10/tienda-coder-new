import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../assets/service/firebase';  

function ItemListContainer({ message }) {
  // State para almacenar productos desde Firebase
  const [productos, setProductos] = useState([]);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (comida) => {
    addToCart(comida);    
  };

  // Estado para manejar errores
  const [error, setError] = useState(null); // Asegúrate de que esta línea esté correctamente declarada.

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
  }, []); // Dependencias vacías para ejecutar solo una vez al montar

  return (
    <div>
      <h3 className="d-flex justify-content-center">{message}</h3>
      {error && <p>{error}</p>} {/* Muestra el mensaje de error si ocurre */}
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
    </div>
  );
}

export default ItemListContainer;
