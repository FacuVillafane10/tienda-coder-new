import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css'; // Importa los estilos
import { useContext } from 'react';
import { CartContext } from './CartContext';

function NavBar({ message }) {
  const location = useLocation();
  const { cart } = useContext(CartContext); 

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <nav className="navbar-custom container-fluid contenido">
      <div className="container-fluid">
        <Link className="navbar-brand-custom" to="/">
          <img src="/logoPau.ico" alt="Paula Foods Logo" className="navbar-logo" />
          <span className="brand-text">{message}</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`btn btn-primary nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="bi bi-house-door-fill"></i>
            <span>Inicio</span>
          </Link>

          {/* Categorías */}
          <div className="dropdown">
            <button 
              className="bbtn btn-primary nav-link-custom dropdown-toggle nav-link-custom" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              Categorías
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/categorias/comidas-rapidas">Comidas Rápidas</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/categorias/saludables">Saludables</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/categorias/menu-diario">Menú Diario</Link>
              </li>
            </ul>
          </div>

          {/* Nosotros */}
          <Link 
            to="/nosotros" 
            className={`btn btn-primary nav-link-custom ${location.pathname === '/nosotros' ? 'active' : ''}`}
          >
            <i className="bi bi-person-circle"></i>
            <span>Nosotros</span>
          </Link>


          {/* Carrito de compras */}
          <Link 
            to="/cart" 
            className={`nav-link-custom ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <button className="btn btn-primary">
              <i className="bi bi-cart3"></i> 
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
