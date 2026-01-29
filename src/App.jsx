// App.js
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import ItemDetail from './components/ItemDetail';  // Importamos ItemDetail
import comidas from './comidas';  
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import CartWidget from './components/CartWidget';
import Error from './components/Error';

function App() {
  const [count, setCount] = useState(0);  
  const message = "Bienvenidos a Paula Foods";

  const handleAddToCart = () => {
    setCount(count + 1); 
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar count={count} message={message} />
        <Routes>
          <Route 
            path='/' 
            element={<ItemListContainer message="Lista de productos disponibles" comidas={comidas} handleAddToCart={handleAddToCart} />} 
          />
          <Route path='/product/:id' element={<ItemDetail comidas={comidas} />} 
          />
          <Route path='*' element={<Error />} />
        </Routes>  
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
