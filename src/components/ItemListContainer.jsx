// components/ItemListContainer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom

function ItemListContainer({ message, comidas, handleAddToCart }) {
  return (
    <div>
      <h3 className="d-flex justify-content-center">{message}</h3>
      <div className="item-list">
        {comidas.map((comida) => (
          <div key={comida.id} className="item-card">
            <img src={comida.foto} alt={comida.nombre} />
            <h3>{comida.nombre}</h3>
            <p className="descripcion-producto">{comida.descripcion}</p> 
            <button onClick={() => handleAddToCart(comida)}>Agregar al carrito</button>
            <Link to={`/product/${comida.id}`}>
              <button>Ver más sobre el Producto</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemListContainer;
