// src/components/NavBar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import CartWidget from './CartWidget';
import ItemListContainer from './ItemListContainer';

function NavBar({ count, message, setCount }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Mi Tienda</Navbar.Brand>
          <Nav className="ml-auto">
            <CartWidget count={count} message={message} />
          </Nav>
        </Container>
      </Navbar>
      <ItemListContainer message={message} />
    </>
  );
}

export default NavBar;
