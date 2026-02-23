import { Link, useParams } from 'react-router-dom';  // Agregado useParams
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../assets/service/firebase';

function ItemListContainer({ message }) {
  const { categoria } = useParams();  // Obtener el parámetro de la categoría desde la URL
  const { addToCart } = useContext(CartContext);  // Accedemos a la función addToCart
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  const handleAddToCart = (comida) => {
    addToCart(comida);  // Llamamos a la función para agregar al carrito
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productosQuery = collection(db, "productos");

        // Filtrar productos según la categoría de la URL
        if (categoria) {
          productosQuery = query(productosQuery, where("categoria", "==", categoria));  // Filtrar por la categoría
        }

        const querySnapshot = await getDocs(productosQuery);
        const productosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        setError('Error al obtener productos');
        console.error("Error obteniendo productos de Firebase: ", error);
      }
    };

    fetchProducts();
  }, [categoria]);  // Filtra nuevamente si la categoría cambia

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-wrap justify-content-center">
      <h3 className="text-center ">{message}</h3>
      <div className="item-list">
        {productos.length === 0 && <p>No se encontraron productos en esta categoría</p>}
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