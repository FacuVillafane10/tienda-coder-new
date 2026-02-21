import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../assets/service/firebase';  

function ItemListContainer({ message }) {
  const { categoria } = useParams();  // Obtener el parámetro de la categoría desde la URL
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

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
    <div>
      <h3>{message}</h3>
      <div className="item-list">
        {productos.length === 0 && <p>No se encontraron productos en esta categoría</p>}
        {productos.map((producto) => (
          <div key={producto.id} className="item-card">
            <img src={producto.foto} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p className="descripcion-producto">{producto.descripcion}</p>
            <button className="btn btn-primary mb-2">
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemListContainer;