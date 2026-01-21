import React from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import CartWidget from './CartWidget';
import "../App.css";


function NavBar({ count, message }) {
  return (
    <Navbar bg="body" className='container' expand="lg" >
      <Container>
        <Navbar.Brand href="#">  
          <img src="/logoPau.jpeg" alt="Paula Foods Logo" width="150" height="150" />         
          Paula Foods
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link href="#">Inicio</Nav.Link>
            <Nav.Link href="#">Nuestra Empresa</Nav.Link>
            <Nav.Link href="#">Nuestros Productos</Nav.Link>            
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="me-2 "
            />
            <Button variant="outline-success" type="submit">Buscar</Button>
          </Form>
          <CartWidget count={count} message={message} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
