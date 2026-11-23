import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../assets/service/firebase';
import { CartContext } from './CartContext';
import { nombreCategoria } from '../utils/categorias';
import { formatearPrecio, tienePrecio, estaDisponible, limpiarDescripcion } from '../utils/formato';
import { obtenerFotos, imagenesParaMostrar } from '../utils/fotos';

// Foto grande con flechas, deslizamiento en el celular y miniaturas abajo
const Galeria = ({ imagenes, nombre }) => {
  const [actual, setActual] = useState(0);
  const [inicioToque, setInicioToque] = useState(null);
  const total = imagenes.length;
  const indice = Math.min(actual, total - 1);

  const ir = (paso) => setActual((i) => (i + paso + total) % total);

  const alSoltar = (e) => {
    if (inicioToque === null) return;
    const distancia = e.changedTouches[0].clientX - inicioToque;
    if (Math.abs(distancia) > 40) ir(distancia < 0 ? 1 : -1);
    setInicioToque(null);
  };

  if (total === 0) {
    return <div className="detalle__foto" aria-hidden="true" />;
  }

  return (
    <div className="galeria">
      <div
        className="galeria__principal"
        onTouchStart={(e) => setInicioToque(e.touches[0].clientX)}
        onTouchEnd={alSoltar}
      >
        <img className="detalle__foto" src={imagenes[indice]} alt={total > 1 ? `${nombre}, foto ${indice + 1} de ${total}` : nombre} />
        {total > 1 && (
          <>
            <button type="button" className="galeria__flecha galeria__flecha--izq" onClick={() => ir(-1)} aria-label="Foto anterior">
              <i className="bi bi-chevron-left" aria-hidden="true"></i>
            </button>
            <button type="button" className="galeria__flecha galeria__flecha--der" onClick={() => ir(1)} aria-label="Foto siguiente">
              <i className="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
            <span className="galeria__contador">{indice + 1} / {total}</span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="galeria__miniaturas" role="tablist" aria-label="Fotos">
          {imagenes.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === indice}
              aria-label={`Ver foto ${i + 1}`}
              className={`galeria__miniatura ${i === indice ? 'galeria__miniatura--activa' : ''}`}
              onClick={() => setActual(i)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ItemDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | no-existe | error
  const [agregado, setAgregado] = useState(0);
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const obtenerProducto = async () => {
      setEstado('cargando');
      try {
        const snap = await getDoc(doc(db, 'productos', id));
        if (snap.exists()) {
          const datos = snap.data();
          setProducto({ id: snap.id, ...datos });
          setImagenes(datos.foto ? [datos.foto] : []);
          setEstado('listo');
          // La galería se carga después: la portada ya se muestra mientras tanto
          obtenerFotos(snap.id)
            .then((galeria) => setImagenes(imagenesParaMostrar(datos.foto, galeria)))
            .catch(() => {});
        } else {
          setEstado('no-existe');
        }
      } catch (err) {
        console.error(err);
        setEstado('error');
      }
    };
    obtenerProducto();
  }, [id]);

  if (estado === 'cargando') {
    return (
      <div className="contenedor seccion">
        <div className="detalle" aria-busy="true">
          <div className="esqueleto" style={{ aspectRatio: '1 / 1', borderRadius: 24 }} />
          <div className="detalle__info">
            <div className="esqueleto" style={{ height: 44, width: '75%' }} />
            <div className="esqueleto" style={{ height: 32, width: '30%' }} />
            <div className="esqueleto" style={{ height: 90 }} />
          </div>
        </div>
      </div>
    );
  }

  if (estado !== 'listo') {
    return (
      <div className="error-pagina">
        <div className="error-pagina__numero"><i className="bi bi-egg-fried" aria-hidden="true"></i></div>
        <h1>{estado === 'no-existe' ? 'Esta comida ya no está en el menú' : 'No pudimos cargar esta comida'}</h1>
        <p>{estado === 'no-existe' ? 'Puede que la hayamos sacado. Mirá todo lo que tenemos hoy.' : 'Revisá tu conexión y volvé a intentar.'}</p>
        <Link to="/#menu" className="boton boton--primario">Ver el menú</Link>
      </div>
    );
  }

  const disponible = estaDisponible(producto);

  const agregar = () => {
    if (!disponible) return;
    addToCart(producto, cantidad);
    setAgregado(cantidad);
    setCantidad(1);
  };

  return (
    <div className="contenedor seccion">
      <Link to="/#menu" className="volver">
        <i className="bi bi-arrow-left" aria-hidden="true"></i> Volver al menú
      </Link>

      <div className="detalle">
        <Galeria key={producto.id} imagenes={imagenes} nombre={producto.nombre} />

        <div className="detalle__info">
          {producto.categoria && <span className="etiqueta-seccion">{nombreCategoria(producto.categoria)}</span>}
          <h1 className="detalle__titulo">{producto.nombre}</h1>
          {tienePrecio(producto) && <span className="precio detalle__precio">{formatearPrecio(producto.precio)}</span>}
          {producto.descripcion && <p className="detalle__descripcion">{limpiarDescripcion(producto.descripcion)}</p>}

          {!disponible && (
            <div className="aviso aviso--atencion">
              <i className="bi bi-clock" aria-hidden="true"></i> No disponible por ahora.
            </div>
          )}

          {disponible && (
            <div className="detalle__compra">
              <div className="cantidad" role="group" aria-label="Cantidad">
                <button
                  className="boton-icono"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1}
                  aria-label="Restar uno"
                >
                  <i className="bi bi-dash-lg" aria-hidden="true"></i>
                </button>
                <span className="cantidad__valor" aria-live="polite">{cantidad}</span>
                <button className="boton-icono" onClick={() => setCantidad((c) => c + 1)} aria-label="Sumar uno">
                  <i className="bi bi-plus-lg" aria-hidden="true"></i>
                </button>
              </div>
              <button className="boton boton--primario" onClick={agregar}>
                <i className="bi bi-bag-plus" aria-hidden="true"></i> Agregar
                {tienePrecio(producto) && ` · ${formatearPrecio(producto.precio * cantidad)}`}
              </button>
            </div>
          )}

          {agregado > 0 && (
            <div className="aviso aviso--exito" role="status">
              <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
              <span>
                {agregado === 1 ? 'Se agregó al carrito.' : `Se agregaron ${agregado} al carrito.`}{' '}
                <Link to="/cart">Ver carrito</Link>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
