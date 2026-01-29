// NavBar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CartWidget from './CartWidget';  // Importamos el CartWidget

function NavBar({ count, message }) {  // Recibimos los props count y message
  return (
    <Navbar bg="light" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/logoPau.jpeg" alt="Logo de Paula Foods" width="150" height="150" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav as={Link} to="/" className="nav-link">Inicio</Nav>
            <Nav as={Link} to="/empresa" className="nav-link">Nuestra Empresa</Nav>
            <Nav as={Link} to="/productos" className="nav-link">Nuestros Productos</Nav>
          </Nav>
          <CartWidget count={count}  />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
