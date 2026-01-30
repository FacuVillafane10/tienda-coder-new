// components/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar({ message }) {
  const location = useLocation();

  return (
    <nav className="navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand-custom" to="/">
          <img src="/public/logoPau.ico" alt="Paula Foods Logo" className="navbar-logo" />
          <span className="brand-text">{message}</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="bi bi-house-door-fill"></i>
            <span>Inicio</span>
          </Link>
          <Link 
            to="/cart" 
            className={`nav-link-custom ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <i className="bi bi-cart3"></i>
            <span>Carrito</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;