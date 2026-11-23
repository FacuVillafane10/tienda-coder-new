import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CartContext } from './CartContext';

const claseLink = ({ isActive }) => `barra__link ${isActive ? 'barra__link--activo' : ''}`;

function NavBar() {
  const { getCartCount } = useContext(CartContext);
  const cantidad = getCartCount();

  return (
    <header className="barra">
      <div className="contenedor barra__interior">
        <Link to="/" className="barra__marca" aria-label="Paula Foods, ir al inicio">
          <img src="/logoPau.jpeg" alt="" className="barra__logo" />
          <span className="barra__nombre">Paula Foods</span>
        </Link>

        <nav className="barra__links" aria-label="Principal">
          <NavLink to="/" end className={(p) => `${claseLink(p)} barra__link--ocultable`}>
            Inicio
          </NavLink>
          <Link to="/#menu" className="barra__link">
            Menú
          </Link>
          <NavLink to="/nosotros" className={claseLink}>
            Nosotros
          </NavLink>
          <Link
            to="/cart"
            className="boton boton--primario boton--chico barra__carrito"
            aria-label={`Carrito, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`}
          >
            <i className="bi bi-bag" aria-hidden="true"></i>
            <span className="barra__link--ocultable">Carrito</span>
            {cantidad > 0 && <span className="contador">{cantidad}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
