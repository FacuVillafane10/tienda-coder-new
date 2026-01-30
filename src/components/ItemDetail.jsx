// components/ItemDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from './CartContext';

const ItemDetail = ({ comidas }) => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  
  const producto = comidas.find((comida) => comida.id === parseInt(id));

  if (!producto) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">
          <h3>Producto no encontrado</h3>
          <Link to="/" className="btn btn-primary mt-3">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Agregar el producto múltiples veces según la cantidad
    for (let i = 0; i < quantity; i++) {
      addToCart(producto);
    }
    alert(`${quantity} ${producto.nombre}(s) agregado(s) al carrito`);
    setQuantity(1); // Reset cantidad
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img 
            className="img-fluid rounded shadow" 
            src={producto.foto} 
            alt={producto.nombre} 
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{producto.nombre}</h2>
          <p className="lead">
            <strong>Descripción:</strong>
          </p>
          <p>{producto.descripcion}</p>
          
          <div className="mt-4">
            <label className="me-3"><strong>Cantidad:</strong></label>
            <div className="btn-group mb-3" role="group">
              <button 
                className="btn btn-outline-secondary"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="btn btn-outline-secondary disabled">
                {quantity}
              </span>
              <button 
                className="btn btn-outline-secondary"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button 
              className="btn btn-success"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
            <Link to="/cart" className="btn btn-primary">
              Ir al carrito
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;