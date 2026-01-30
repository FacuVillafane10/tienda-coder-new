// components/ItemListContainer.jsx
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from './CartContext';

function ItemListContainer({ message, comidas }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (comida) => {
    addToCart(comida);    
  };

  return (
    <div>
      <h3 className="d-flex justify-content-center">{message}</h3>
      <div className="item-list">
        {comidas.map((comida) => (
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