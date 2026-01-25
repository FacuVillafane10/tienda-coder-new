import React from 'react';

function ItemListContainer({ message, comidas, handleAddToCart }) {
  return (
    <div>
      <h3 className='d-flex justify-content-center '>{message}</h3>
      <div className="item-list">
        {comidas.map((comida) => (
          <div key={comida.id} className="item-card">
            <img src={comida.foto} alt={comida.nombre} width="150" height="150" />
            <h3>{comida.nombre}</h3>
            <p>{comida.descripcion}</p>
            <button onClick={handleAddToCart}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemListContainer;
