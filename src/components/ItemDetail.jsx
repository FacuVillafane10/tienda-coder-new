import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../assets/service/firebase'; 

const ItemDetail = () => {
  const { id } = useParams(); 
  const { addToCart } = useContext(CartContext);

  // Estados para producto, cantidad, carga y errores
  const [producto, setProducto] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [notFound, setNotFound] = useState(false); // Estado de "no encontrado"
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Empieza a cargar el producto
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
          setNotFound(false); // Si existe, no está "no encontrado"
        } else {
          setNotFound(true);// Si no existe el producto
        }
      } catch (error) {
        setError("Hubo un problema al cargar el producto.");
        console.error(error);
      } finally {
        setLoading(false); // Deja de cargar
      }
    };

    fetchProduct();
  }, [id]);

  // Mientras se está cargando
  if (loading) {
    return <div className="container mt-5 text-center">Cargando...</div>;
  }

  // Si no se encuentra el producto
  if (notFound) {
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

  // Si hubo un error
  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          <h3>{error}</h3>
          <Link to="/" className="btn btn-primary mt-3">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  // Función para agregar al carrito
  const handleAddToCart = () => {
    if (producto.stock && quantity > producto.stock) {
      alert(`No podemos agregar más de ${producto.stock} unidades de este producto.`);
      return;
    }

    addToCart({ ...producto, quantity });
    setQuantity(1); // Reiniciar cantidad
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
            <div className="btn-group mb-3 bg-white" role="group">
              <button 
                className="btn btn-outline-secondary text-bg-dark"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="btn btn-outline-secondary text-bg-dark">
                {quantity}
              </span>
              <button 
                className="btn btn-outline-secondary text-bg-dark m-lg-1"
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