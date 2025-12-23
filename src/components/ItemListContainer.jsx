// src/components/ItemListContainer.jsx
import React from 'react';

function ItemListContainer({ message }) {
  const items = [
    { id: 1, name: 'Producto 1', price: '$20' },
    { id: 2, name: 'Producto 2', price: '$30' },
    { id: 3, name: 'Producto 3', price: '$40' },
  ];

  return (
    <div>
      <h2>{message}</h2>
      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <button>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemListContainer;
