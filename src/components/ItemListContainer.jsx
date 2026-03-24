import { Link, useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../assets/service/firebase';
import './ItemListContainer.css';

function ItemListContainer({ message }) {
  const { categoria } = useParams();  // Obtener el parámetro de la categoría desde la URL
  const { addToCart } = useContext(CartContext);  // Accedemos a la función addToCart
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // Agregamos el estado loading

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
      } finally {
        setLoading(false);  // Una vez que los datos están listos, cambia el estado a false
      }
    };

    fetchProducts();
  }, [categoria]);  // Filtra nuevamente si la categoría cambia

  if (loading) {
    return <div className="text-center">Cargando...</div>;  // Mostrar "Cargando..." mientras se obtiene la data
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4 mt-4 text-black">{message}</h3>
      <div className="row justify-content-center ">
        {productos.length === 0 && <p>No se encontraron productos en esta categoría</p>}
        {productos.map((comida) => (
          <div key={comida.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="item-card shadow-lg rounded-3 p-3">
              <img
                src={comida.foto}
                alt={comida.nombre}
                className="img-fluid rounded-3 mb-3"
              />
              <h5 className="text-center">{comida.nombre}</h5>
              <p className="descripcion-producto text-muted">{comida.descripcion}</p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleAddToCart(comida)}
                >
                  Agregar al carrito
                </button>
                <Link to={`/product/${comida.id}`} className="w-100 mt-2">
                  <button className="btn btn-outline-secondary w-100">
                    Ver más
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemListContainer;