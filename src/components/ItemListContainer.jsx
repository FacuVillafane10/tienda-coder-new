import { Link, NavLink, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../assets/service/firebase';
import { CartContext } from './CartContext';
import { CATEGORIAS, nombreCategoria } from '../utils/categorias';
import { formatearPrecio, tienePrecio, estaDisponible, limpiarDescripcion } from '../utils/formato';

const TarjetaCargando = () => (
  <div className="tarjeta" aria-hidden="true">
    <div className="esqueleto" style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
    <div className="tarjeta__cuerpo">
      <div className="esqueleto" style={{ height: 22, width: '70%' }} />
      <div className="esqueleto" style={{ height: 14 }} />
      <div className="esqueleto" style={{ height: 14, width: '85%' }} />
      <div className="esqueleto" style={{ height: 38, marginTop: 12 }} />
    </div>
  </div>
);

function Tarjeta({ comida }) {
  const { addToCart } = useContext(CartContext);
  const [agregado, setAgregado] = useState(false);

  const agregar = () => {
    addToCart(comida);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1400);
  };

  return (
    <article className="tarjeta">
      <Link to={`/product/${comida.id}`} className="tarjeta__foto-link" tabIndex={-1} aria-hidden="true">
        <img src={comida.foto} alt="" className="tarjeta__foto" loading="lazy" />
        {comida.categoria && <span className="tarjeta__categoria">{nombreCategoria(comida.categoria)}</span>}
      </Link>
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__nombre">
          <Link to={`/product/${comida.id}`}>{comida.nombre}</Link>
        </h3>
        <p className="tarjeta__descripcion">{limpiarDescripcion(comida.descripcion)}</p>
        <div className="tarjeta__pie">
          {tienePrecio(comida) ? <span className="precio">{formatearPrecio(comida.precio)}</span> : <span />}
          <button
            className={`boton boton--chico ${agregado ? 'boton--secundario' : 'boton--primario'}`}
            onClick={agregar}
            aria-label={`Agregar ${comida.nombre} al carrito`}
          >
            {agregado ? (
              <><i className="bi bi-check-lg" aria-hidden="true"></i> Agregado</>
            ) : (
              <><i className="bi bi-plus-lg" aria-hidden="true"></i> Agregar</>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function ItemListContainer() {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      setError(null);
      try {
        let consulta = collection(db, 'productos');
        if (categoria) {
          consulta = query(consulta, where('categoria', '==', categoria));
        }
        const snapshot = await getDocs(consulta);
        const lista = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(estaDisponible) // Las comidas pausadas desde el panel no se muestran
          .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es'));
        setProductos(lista);
      } catch (err) {
        console.error('Error obteniendo productos de Firebase: ', err);
        setError('No pudimos cargar el menú. Revisá tu conexión y volvé a intentar.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, [categoria]);

  const categoriaActual = CATEGORIAS.find((c) => c.clave === categoria);

  return (
    <section id="menu" className="seccion">
      <div className="contenedor">
        <div className="menu__cabecera">
          <div>
            <span className="etiqueta-seccion">Nuestro menú</span>
            <h2 className="titulo-seccion">{categoriaActual ? categoriaActual.nombre : 'Todas las comidas'}</h2>
          </div>
          <nav className="filtros" aria-label="Categorías">
            <NavLink to="/#menu" end className={({ isActive }) => `filtro ${isActive ? 'filtro--activo' : ''}`}>
              Todas
            </NavLink>
            {CATEGORIAS.map((c) => (
              <NavLink
                key={c.clave}
                to={`/categorias/${c.clave}`}
                className={({ isActive }) => `filtro ${isActive ? 'filtro--activo' : ''}`}
              >
                {c.emoji} {c.nombre}
              </NavLink>
            ))}
          </nav>
        </div>

        {error && (
          <div className="vacio">
            <div className="vacio__icono"><i className="bi bi-wifi-off" aria-hidden="true"></i></div>
            <p>{error}</p>
          </div>
        )}

        {!error && (
          <div className="grilla">
            {cargando
              ? Array.from({ length: 6 }, (_, i) => <TarjetaCargando key={i} />)
              : productos.map((comida) => <Tarjeta key={comida.id} comida={comida} />)}
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <div className="vacio">
            <div className="vacio__icono"><i className="bi bi-basket" aria-hidden="true"></i></div>
            <p>Por ahora no hay comidas en esta categoría.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ItemListContainer;
