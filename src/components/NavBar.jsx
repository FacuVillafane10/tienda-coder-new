import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import './NavBar.css';

function NavBar({ message }) {
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="pf-navbar">
      {/* Logo */}
      <Link to="/" className="pf-navbar__logo-link" aria-label="Ir al inicio">
        <img src="/logoPau.ico" alt="Paula Foods Logo" className="pf-navbar__logo" />
      </Link>

      {/* Links de navegación */}
      <div className="pf-navbar__links">
        <Link
          to="/"
          className={`pf-nav-link ${isActive('/') ? 'pf-nav-link--active' : ''}`}
          aria-label="Ir a la página de inicio"
        >
          <i className="bi bi-house-door-fill"></i>
          Inicio
        </Link>

        {/* Dropdown Categorías */}
        <div className="dropdown">
          <button
            className="pf-nav-link pf-nav-link--dropdown dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Abrir menú de categorías"
          >
            Categorías
          </button>
          <ul className="dropdown-menu pf-dropdown-menu">
            <li>
              <Link
                className="dropdown-item pf-dropdown-item"
                to="/categorias/comidarapida"
                aria-label="Ir a comidas rápidas"
              >
                🍔 Comidas Rápidas
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item pf-dropdown-item"
                to="/categorias/saludables"
                aria-label="Ir a opciones saludables"
              >
                🥗 Saludables
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item pf-dropdown-item"
                to="/categorias/menudiario"
                aria-label="Ver menú diario"
              >
                🍽️ Menú Diario
              </Link>
            </li>
          </ul>
        </div>

        <Link
          to="/nosotros"
          className={`pf-nav-link ${isActive('/nosotros') ? 'pf-nav-link--active' : ''}`}
          aria-label="Ir a la sección de nosotros"
        >
          <i className="bi bi-person-circle"></i>
          Nosotros
        </Link>
      </div>

      {/* Botón Carrito */}
      <div className="pf-navbar__actions">
        <Link
          to="/cart"
          className="pf-cart-btn"
          aria-label="Ir al carrito de compras"
        >
          <i className="bi bi-cart3"></i>
          <span>Carrito</span>
          {totalItems > 0 && (
            <span className="pf-cart-badge">{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;