
import { useParams } from 'react-router-dom';

const ItemDetail = ({ comidas }) => {
  const { id } = useParams();  

 
  const producto = comidas.find((comida) => comida.id === parseInt(id));

  if (!producto) {
    return <div>Producto no encontrado</div>;  // Si no se encuentra el producto, mostramos un mensaje
  }

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <h2 className='item-detail d-flex align-items-center justify-content-center'>{producto.nombre}</h2>
      <img className='img-comidas'  src={producto.foto} alt={producto.nombre}  />
      <p className="item-detail   desc-comida"><strong>Descripción: </strong> {producto.descripcion}</p>
      <button>Agregar al carrito</button>  
    </div>
  );
};

export default ItemDetail;
